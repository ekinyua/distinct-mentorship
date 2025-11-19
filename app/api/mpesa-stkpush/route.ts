import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { initiateStkPush } from "@/lib/mpesa";

interface RequestBody {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  description: string;
  payerName?: string;
}

const PHONE_PATTERN = /^254[17]\d{8}$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<RequestBody>;

    if (!body.phoneNumber || !body.amount || !body.accountReference) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!PHONE_PATTERN.test(body.phoneNumber.trim())) {
      return NextResponse.json(
        { error: "Invalid phone number format. Use 2547XXXXXXXX." },
        { status: 400 }
      );
    }

    if (body.amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than zero." },
        { status: 400 }
      );
    }

    const description = body.description || body.accountReference;

    const res = await initiateStkPush({
      phoneNumber: body.phoneNumber,
      amount: body.amount,
      accountReference: body.accountReference,
      description,
    });

    const success = res.ResponseCode === "0";

    // Record the transaction in the database for later lookup
    try {
      await prisma.transaction.create({
        data: {
          checkoutRequestId: res.CheckoutRequestID,
          merchantRequestId: res.MerchantRequestID,
          amount: body.amount,
          phoneNumber: body.phoneNumber.trim(),
          accountReference: body.accountReference,
          description,
          payerName: body.payerName,
          status: success ? "PENDING" : "FAILED",
          environment:
            process.env.MPESA_ENV === "production" ? "production" : "sandbox",
        },
      });
    } catch (dbError) {
      console.error("[MPESA_STK_PUSH_DB_ERROR]", dbError);
    }

    return NextResponse.json({
      success,
      merchantRequestId: res.MerchantRequestID,
      checkoutRequestId: res.CheckoutRequestID,
      responseCode: res.ResponseCode,
      responseDescription: res.ResponseDescription,
      customerMessage: res.CustomerMessage,
    });
  } catch (error) {
    console.error("[MPESA_STK_PUSH_ERROR]", error);
    return NextResponse.json(
      {
        error:
          "We could not start the M-Pesa payment. Please check the details and try again.",
      },
      { status: 500 }
    );
  }
}
