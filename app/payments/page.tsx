"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { Header } from "@/components/Header";
import {
  ServiceId,
  formatPrice,
  getServiceById,
  services,
} from "@/lib/services";

type PaymentState =
  | "idle"
  | "processing"
  | "awaiting_confirmation"
  | "success"
  | "failed";

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  serviceId?: string;
  general?: string;
}

interface TransactionDetails {
  checkoutRequestId: string;
  resultCode: number;
  resultDesc: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  phoneNumber?: string;
  transactionDate?: string;
}

export default function PaymentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialServiceId = useMemo(() => {
    const fromQuery = searchParams.get("service") as ServiceId | null;
    if (fromQuery) {
      const found = getServiceById(fromQuery);
      if (found) return fromQuery;
    }
    return services[0]?.id ?? "";
  }, [searchParams]);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serviceId, setServiceId] = useState<ServiceId | "">(initialServiceId);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [transaction, setTransaction] = useState<TransactionDetails | null>(
    null
  );

  const selectedService = serviceId
    ? getServiceById(serviceId as ServiceId)
    : null;

  const amount = selectedService?.price ?? 0;

  const isBusy =
    paymentState === "processing" || paymentState === "awaiting_confirmation";

  const currentStep = useMemo(() => {
    if (paymentState === "idle") return 1;
    if (
      paymentState === "processing" ||
      paymentState === "awaiting_confirmation"
    )
      return 2;
    return 3;
  }, [paymentState]);

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Please enter the learner's full name.";
    } else if (fullName.trim().length < 3) {
      nextErrors.fullName = "Name should be at least 3 characters long.";
    }

    const phone = phoneNumber.trim();
    const phonePattern = /^254[17]\d{8}$/;
    if (!phone) {
      nextErrors.phoneNumber = "Please enter the M-Pesa phone number.";
    } else if (!phonePattern.test(phone)) {
      nextErrors.phoneNumber =
        "Enter a valid Kenyan phone number, e.g. 2547XXXXXXXX.";
    }

    if (!serviceId) {
      nextErrors.serviceId = "Please select a service.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setTransaction(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!selectedService) {
      setErrors({ general: "Selected service could not be found." });
      return;
    }

    try {
      setPaymentState("processing");

      const res = await fetch("/api/mpesa-stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim(),
          amount,
          accountReference: selectedService.name,
          description: `Payment for ${
            selectedService.name
          } - ${fullName.trim()}`,
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const message =
          (errorBody && (errorBody.error as string)) ||
          "We couldn't start the M-Pesa payment. Please try again.";
        setErrors({ general: message });
        setPaymentState("failed");
        return;
      }

      const data = await res.json();

      if (!data.success || !data.checkoutRequestId) {
        const message =
          data?.message ||
          data?.CustomerMessage ||
          "M-Pesa did not accept the payment request.";
        setErrors({ general: message });
        setPaymentState("failed");
        return;
      }

      setPaymentState("awaiting_confirmation");

      await pollPaymentStatus(data.checkoutRequestId as string);
    } catch (error) {
      console.error("[PAYMENT_SUBMIT_ERROR]", error);
      setErrors({
        general:
          "Something went wrong while processing your payment. Please check your internet connection and try again.",
      });
      setPaymentState("failed");
    }
  }

  async function pollPaymentStatus(checkoutId: string) {
    const maxAttempts = 20; // ~60 seconds with 3s delay
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await delay(3000);

      try {
        const res = await fetch("/api/mpesa-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutRequestId: checkoutId }),
        });

        if (!res.ok) {
          // Keep waiting unless we've reached the last attempt
          if (attempt === maxAttempts - 1) {
            setErrors({
              general:
                "We couldn't confirm the payment status. Please check your M-Pesa app or try again.",
            });
            setPaymentState("failed");
          }
          continue;
        }

        const data = (await res.json()) as TransactionDetails & {
          success?: boolean;
        };

        if (!data || typeof data.resultCode === "undefined") {
          continue;
        }

        setTransaction(data);

        if (data.resultCode === 0) {
          setPaymentState("success");
          return;
        }

        // Common M-Pesa error codes
        if ([1032, 1037, 1].includes(data.resultCode)) {
          setPaymentState("failed");
          return;
        }
      } catch (error) {
        console.error("[PAYMENT_POLL_ERROR]", error);
        if (attempt === maxAttempts - 1) {
          setErrors({
            general:
              "We couldn't confirm the payment status. Please check your M-Pesa app or try again.",
          });
          setPaymentState("failed");
        }
      }
    }
  }

  function resetForm() {
    setPaymentState("idle");
    setErrors({});
    setTransaction(null);
  }

  function goHome() {
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="section-container py-10">
        <button
          type="button"
          onClick={goHome}
          className="mb-6 inline-flex items-center gap-2 cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 hover:text-primary"
        >
          <span
            aria-hidden
            className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-[0.7rem]"
          >
            {"<"}
          </span>
          <span>Back to home</span>
        </button>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] md:items-start">
          <section className="card relative overflow-hidden p-6 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  <span className="mr-1" aria-hidden>
                    🔒
                  </span>
                  M-Pesa Payment
                </p>
                <h1 className="mt-3 font-serif text-2xl font-semibold text-slate-900 sm:text-3xl">
                  Complete your enrollment payment
                </h1>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  You&apos;ll receive an M-Pesa STK Push on your phone. Confirm
                  the amount and enter your PIN to complete the payment.
                </p>
              </div>
              <div className="hidden text-right text-xs text-slate-500 sm:block">
                <p className="font-semibold text-slate-700">Support</p>
                <p>+254 700 000 000</p>
                <p>info@distinctmentorship.com</p>
              </div>
            </div>

            <ol className="mb-6 flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-slate-500">
              <li className={currentStep >= 1 ? "text-primary" : ""}>
                <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[0.6rem]">
                  1
                </span>
                Enter details
              </li>
              <li
                className="flex-1 border-t border-dashed border-slate-300"
                aria-hidden
              />
              <li className={currentStep >= 2 ? "text-primary" : ""}>
                <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[0.6rem]">
                  2
                </span>
                Confirm on phone
              </li>
              <li
                className="flex-1 border-t border-dashed border-slate-300"
                aria-hidden
              />
              <li className={currentStep >= 3 ? "text-primary" : ""}>
                <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[0.6rem]">
                  3
                </span>
                Confirmation
              </li>
            </ol>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="text-xs font-medium text-slate-700"
                  >
                    Learner&apos;s full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Amina Wanjiru"
                    disabled={isBusy}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="text-xs font-medium text-slate-700"
                  >
                    M-Pesa phone number
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="2547XXXXXXXX"
                    disabled={isBusy}
                  />
                  <p className="mt-1 text-[0.7rem] text-slate-500">
                    Use the phone number registered to M-Pesa (format:
                    2547XXXXXXXX).
                  </p>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)]">
                <div>
                  <label
                    htmlFor="service"
                    className="text-xs font-medium text-slate-700"
                  >
                    Service
                  </label>
                  <select
                    id="service"
                    value={serviceId}
                    onChange={(e) =>
                      setServiceId(e.target.value as ServiceId | "")
                    }
                    disabled={isBusy}
                    className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select a programme</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  {errors.serviceId && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.serviceId}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-700">Amount</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {formatPrice(amount)}
                  </p>
                  <p className="mt-1 text-[0.7rem] text-slate-500">
                    Payment is per learner. Amount is based on the selected
                    programme.
                  </p>
                </div>
              </div>

              {errors.general && (
                <div className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {errors.general}
                </div>
              )}

              <div className="mt-4 flex flex-col items-start justify-between gap-3 border-t border-dashed border-slate-200 pt-4 text-xs text-slate-600 sm:flex-row sm:items-center">
                <div>
                  {paymentState === "idle" && (
                    <p>
                      After clicking{" "}
                      <span className="font-semibold">Pay with M-Pesa</span>,
                      check your phone for an STK Push prompt and enter your
                      PIN.
                    </p>
                  )}
                  {paymentState === "processing" && (
                    <p className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-primary" />
                      Sending payment request to your phone — please wait…
                    </p>
                  )}
                  {paymentState === "awaiting_confirmation" && (
                    <p>
                      We&apos;ve sent an STK Push to your phone. Confirm the
                      amount and enter your PIN to complete the payment.
                    </p>
                  )}
                  {paymentState === "success" && (
                    <p className="text-green-700">
                      Payment confirmed. A receipt has been generated below.
                    </p>
                  )}
                  {paymentState === "failed" && !errors.general && (
                    <p className="text-red-700">
                      The payment could not be completed. Please try again or
                      contact support.
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  {paymentState !== "success" && (
                    <button
                      type="submit"
                      disabled={isBusy || !selectedService}
                      className="btn-primary inline-flex items-center cursor-pointer justify-center rounded-full px-6 py-2 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {paymentState === "idle" && "Pay with M-Pesa"}
                      {paymentState === "processing" && "Sending request..."}
                      {paymentState === "awaiting_confirmation" &&
                        "Awaiting confirmation..."}
                      {paymentState === "failed" && "Try Again"}
                    </button>
                  )}
                  {paymentState === "awaiting_confirmation" && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}
                  {paymentState === "success" && (
                    <button
                      type="button"
                      onClick={goHome}
                      className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
                    >
                      Return Home
                    </button>
                  )}
                </div>
              </div>

              {transaction && (
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-800">
                      Payment receipt
                    </p>
                    <p className="text-[0.7rem] text-slate-500">
                      {transaction.transactionDate ||
                        "Time recorded at confirmation"}
                    </p>
                  </div>
                  <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2">
                    <div>
                      <dt className="text-slate-500">Status</dt>
                      <dd className="font-medium">
                        {transaction.resultCode === 0
                          ? "Successful"
                          : "Not successful"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Amount</dt>
                      <dd className="font-medium">
                        {transaction.amount
                          ? formatPrice(transaction.amount)
                          : formatPrice(amount)}
                      </dd>
                    </div>
                    {transaction.mpesaReceiptNumber && (
                      <div>
                        <dt className="text-slate-500">M-Pesa receipt</dt>
                        <dd className="font-mono text-[0.75rem]">
                          {transaction.mpesaReceiptNumber}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-slate-500">Phone</dt>
                      <dd className="font-medium">
                        {transaction.phoneNumber || phoneNumber}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </form>
          </section>

          <aside className="space-y-4 text-sm text-slate-700">
            <div className="card p-5">
              <h2 className="font-serif text-lg font-semibold text-slate-900">
                Programme summary
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Review the programme details before confirming payment on your
                phone.
              </p>
              {selectedService ? (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Programme
                  </p>
                  <p className="font-medium text-slate-900">
                    {selectedService.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedService.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="text-xs text-slate-500">
                      Amount payable
                    </span>
                    <span className="text-lg font-semibold text-slate-900">
                      {formatPrice(amount)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-xs text-slate-500">
                  Select a programme to see the amount and details here.
                </p>
              )}
            </div>

            <div className="card space-y-3 p-5 text-xs text-slate-600">
              <h3 className="text-sm font-semibold text-slate-900">
                Helpful tips
              </h3>
              <ul className="list-disc space-y-2 pl-4">
                <li>Keep your phone nearby with network signal.</li>
                <li>
                  When the STK Push appears, confirm the amount and check that
                  the paybill is correct before entering your PIN.
                </li>
                <li>
                  If you don&apos;t receive a prompt within a minute, check your
                  M-Pesa messages or try the payment again.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
