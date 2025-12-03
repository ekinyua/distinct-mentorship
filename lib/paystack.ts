import { sanitizePhoneNumber } from "./mpesa";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

interface PaystackApiResponse<T> {
  status?: boolean;
  message?: string;
  data?: T;
}

interface PaystackChargeData {
  reference?: string;
  status?: string;
  display_text?: string;
}

export interface PaystackChargeParams {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  description: string;
  payerName?: string;
}

export interface PaystackMpesaCharge {
  reference: string;
  status: string;
  displayText?: string;
  raw: unknown;
}

function requirePaystackEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required Paystack environment variable: ${name}`);
  }
  return value;
}

export async function createPaystackMpesaCharge(
  params: PaystackChargeParams
): Promise<PaystackMpesaCharge> {
  const secretKey = requirePaystackEnv("PAYSTACK_SECRET_KEY");

  const email =
    process.env.PAYSTACK_CUSTOMER_EMAIL ||
    "payments@distinctmentorship.com";

  // Paystack expects the amount in the smallest currency unit (e.g. kobo/cents).
  const amountMinor = params.amount * 100;

  const phone = `+${sanitizePhoneNumber(params.phoneNumber)}`;

  const body = {
    amount: amountMinor,
    email,
    currency: "KES",
    mobile_money: {
      phone,
      provider: "mpesa",
    },
    metadata: {
      accountReference: params.accountReference,
      description: params.description,
      payerName: params.payerName,
    },
  };

  const res = await fetch(`${PAYSTACK_BASE_URL}/charge`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as PaystackApiResponse<
    PaystackChargeData
  >;

  if (!res.ok || !json.status || !json.data || !json.data.reference) {
    const message =
      json.message ||
      (json as { error?: string }).error ||
      "Paystack charge request failed";
    throw new Error(message);
  }

  return {
    reference: String(json.data.reference),
    status: String(json.data.status || ""),
    displayText: json.data.display_text,
    raw: json,
  };
}

interface PaystackVerifyData {
  reference?: string;
  status?: string;
  amount?: number;
  paid_at?: string | null;
  gateway_response?: string | null;
  customer?: {
    phone?: string | null;
    email?: string | null;
  };
}

export interface PaystackVerificationResult {
  reference: string;
  status: string;
  amount: number | null;
  paidAt: string | null;
  gatewayResponse: string | null;
  customerPhone: string | null;
}

export async function verifyPaystackTransaction(
  reference: string
): Promise<PaystackVerificationResult | null> {
  const secretKey = requirePaystackEnv("PAYSTACK_SECRET_KEY");

  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const json = (await res.json().catch(() => ({}))) as PaystackApiResponse<
    PaystackVerifyData
  >;

  if (!res.ok || !json.status || !json.data || !json.data.reference) {
    console.warn("[PAYSTACK_VERIFY_FAILED]", reference, json.message);
    return null;
  }

  const data = json.data;

  return {
    reference: String(data.reference),
    status: String(data.status || ""),
    amount:
      typeof data.amount === "number" ? Math.round(data.amount / 100) : null,
    paidAt: data.paid_at ?? null,
    gatewayResponse: data.gateway_response ?? null,
    customerPhone: data.customer?.phone ?? null,
  };
}
