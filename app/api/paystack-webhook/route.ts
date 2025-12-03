import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

import { prisma } from "@/lib/prisma";
import { MpesaCallbackResult, storeCallback } from "@/lib/mpesa";

type PaystackWebhookPayload = {
  event?: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
    paid_at?: string | null;
    gateway_response?: string | null;
    currency?: string;
    customer?: {
      phone?: string | null;
      email?: string | null;
    };
    metadata?: {
      accountReference?: string;
      description?: string;
      payerName?: string;
    };
  };
};

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error(
        "[PAYSTACK_WEBHOOK_MISCONFIGURED] PAYSTACK_SECRET_KEY is missing",
      );
      return NextResponse.json({ error: "Webhook misconfigured" }, {
        status: 500,
      });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      console.warn("[PAYSTACK_WEBHOOK_NO_SIGNATURE]");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const hash = createHmac("sha512", secret).update(rawBody).digest("hex");

    if (hash !== signature) {
      console.warn("[PAYSTACK_WEBHOOK_INVALID_SIGNATURE]");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody) as PaystackWebhookPayload;

    if (payload.event !== "charge.success" || !payload.data) {
      // Ignore other events; acknowledge receipt so Paystack does not retry.
      return NextResponse.json({ received: true });
    }

    const data = payload.data;

    const reference = String(data.reference ?? "");
    if (!reference) {
      console.warn("[PAYSTACK_WEBHOOK_MISSING_REFERENCE]", payload);
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const amountMinor = typeof data.amount === "number" ? data.amount : 0;
    const amount = Math.round(amountMinor / 100);
    const phone = data.customer?.phone ?? null;
    const paidAt = data.paid_at ?? null;
    const gatewayResponse =
      data.gateway_response ?? "Payment successful via Paystack M-Pesa";

    const accountReference =
      data.metadata?.accountReference ?? "Paystack M-Pesa payment";
    const description =
      data.metadata?.description ?? "Created from Paystack webhook";
    const payerName = data.metadata?.payerName;

    const status = "SUCCESS" as const;
    const resultCode = 0;
    const resultDesc = gatewayResponse;

    try {
      await prisma.transaction.upsert({
        where: { checkoutRequestId: reference },
        update: {
          status,
          amount: amount || undefined,
          phoneNumber: phone ?? undefined,
          mpesaReceiptNumber: reference,
          transactionDate: paidAt ?? undefined,
          resultCode,
          resultDesc,
          accountReference,
          description,
          payerName,
          rawCallback: payload,
          environment: "paystack",
        },
        create: {
          checkoutRequestId: reference,
          amount,
          phoneNumber: phone ?? "",
          mpesaReceiptNumber: reference,
          transactionDate: paidAt ?? undefined,
          resultCode,
          resultDesc,
          status,
          accountReference,
          description,
          payerName,
          rawCallback: payload,
          environment: "paystack",
        },
      });
    } catch (dbError) {
      console.error("[PAYSTACK_WEBHOOK_DB_ERROR]", dbError);
    }

    const callback: MpesaCallbackResult = {
      checkoutRequestId: reference,
      resultCode,
      resultDesc,
      amount,
      mpesaReceiptNumber: reference,
      phoneNumber: phone ?? undefined,
      transactionDate: paidAt ?? undefined,
    };

    storeCallback(callback);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[PAYSTACK_WEBHOOK_ERROR]", error);
    return NextResponse.json({ received: false }, { status: 500 });
  }
}
