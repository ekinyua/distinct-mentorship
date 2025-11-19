const MPESA_ENV =
  process.env.MPESA_ENV === "production" ? "production" : "sandbox";

const MPESA_BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

export type MpesaStkPushRequest = {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  description: string;
};

export type MpesaStkPushResponse = {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage?: string;
};

export type MpesaQueryResponse = {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
};

export type MpesaCallbackResult = {
  checkoutRequestId: string;
  resultCode: number;
  resultDesc: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  phoneNumber?: string;
  transactionDate?: string;
};

const callbackStore = new Map<string, MpesaCallbackResult>();

export function storeCallback(result: MpesaCallbackResult) {
  callbackStore.set(result.checkoutRequestId, result);
}

export function getStoredCallback(checkoutRequestId: string) {
  return callbackStore.get(checkoutRequestId) ?? null;
}

export function clearStoredCallback(checkoutRequestId: string) {
  callbackStore.delete(checkoutRequestId);
}

export function getTimestamp(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  const seconds = `${date.getSeconds()}`.padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function buildPassword(
  shortCode: string,
  passKey: string,
  timestamp: string
) {
  return Buffer.from(`${shortCode}${passKey}${timestamp}`).toString("base64");
}

export function sanitizePhoneNumber(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) return trimmed.slice(1);
  if (trimmed.startsWith("0")) return `254${trimmed.slice(1)}`;
  return trimmed;
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required M-Pesa environment variable: ${name}`);
  }
  return value;
}

export async function getAccessToken(): Promise<string> {
  const key = requireEnv("MPESA_CONSUMER_KEY");
  const secret = requireEnv("MPESA_CONSUMER_SECRET");

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");

  const res = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch M-Pesa access token: ${res.status} ${text}`
    );
  }

  const data = (await res.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error("M-Pesa token response missing access_token");
  }

  return data.access_token;
}

export async function initiateStkPush(
  payload: MpesaStkPushRequest
): Promise<MpesaStkPushResponse> {
  const shortCode = requireEnv("MPESA_SHORTCODE");
  const passKey = requireEnv("MPESA_PASSKEY");
  const callbackUrl = requireEnv("MPESA_CALLBACK_URL");

  const timestamp = getTimestamp();
  const password = buildPassword(shortCode, passKey, timestamp);

  const token = await getAccessToken();

  const body = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: payload.amount,
    PartyA: sanitizePhoneNumber(payload.phoneNumber),
    PartyB: shortCode,
    PhoneNumber: sanitizePhoneNumber(payload.phoneNumber),
    CallBackURL: callbackUrl,
    AccountReference: payload.accountReference.slice(0, 12),
    TransactionDesc: payload.description.slice(0, 100),
  };

  const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as MpesaStkPushResponse & {
    errorCode?: string;
    errorMessage?: string;
  };

  if (!res.ok) {
    const message =
      data.errorMessage ||
      data.ResponseDescription ||
      "STK Push request failed";
    throw new Error(message);
  }

  if (!data.CheckoutRequestID) {
    throw new Error("M-Pesa STK Push response missing CheckoutRequestID");
  }

  return data;
}

export async function queryStkPush(
  checkoutRequestId: string
): Promise<MpesaQueryResponse> {
  const shortCode = requireEnv("MPESA_SHORTCODE");
  const passKey = requireEnv("MPESA_PASSKEY");

  const timestamp = getTimestamp();
  const password = buildPassword(shortCode, passKey, timestamp);
  const token = await getAccessToken();

  const body = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };

  const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as MpesaQueryResponse & {
    errorCode?: string;
    errorMessage?: string;
  };

  if (!res.ok) {
    const message =
      data.errorMessage ||
      data.ResponseDescription ||
      "STK Query request failed";
    throw new Error(message);
  }

  if (typeof data.ResultCode === "undefined") {
    throw new Error("M-Pesa STK Query response missing ResultCode");
  }

  return data;
}

type MpesaCallbackBody = {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number | string;
      ResultDesc?: string;
      CallbackMetadata?: {
        Item?: Array<{ Name?: string; Value?: unknown }>;
      };
    };
  };
};

export function parseCallbackBody(raw: unknown): MpesaCallbackResult | null {
  try {
    const body = raw as MpesaCallbackBody;
    const callback = body.Body?.stkCallback;
    if (!callback) return null;

    const items = callback.CallbackMetadata?.Item ?? [];
    const meta: Record<string, unknown> = {};
    for (const item of items) {
      if (!item?.Name) continue;
      if (Object.prototype.hasOwnProperty.call(item, "Value")) {
        meta[item.Name] = item.Value as unknown;
      }
    }

    const result: MpesaCallbackResult = {
      checkoutRequestId: String(callback.CheckoutRequestID),
      resultCode: Number(callback.ResultCode),
      resultDesc: String(callback.ResultDesc),
    };

    if (meta.Amount != null) result.amount = Number(meta.Amount);
    if (meta.MpesaReceiptNumber != null)
      result.mpesaReceiptNumber = String(meta.MpesaReceiptNumber);
    if (meta.PhoneNumber != null) result.phoneNumber = String(meta.PhoneNumber);
    if (meta.TransactionDate != null)
      result.transactionDate = String(meta.TransactionDate);

    return result;
  } catch (error) {
    console.error("[MPESA_CALLBACK_PARSE_ERROR]", error);
    return null;
  }
}
