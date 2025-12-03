import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createPaystackMpesaCharge } from "@/lib/paystack";

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

    const charge = await createPaystackMpesaCharge({
      phoneNumber: body.phoneNumber,
      amount: body.amount,
      accountReference: body.accountReference,
      description,
      payerName: body.payerName,
    });

    const success = !!charge.reference;

    // Record the transaction in the database for later lookup
    try {
      await prisma.transaction.create({
        data: {
          checkoutRequestId: charge.reference,
          merchantRequestId: charge.reference,
          amount: body.amount,
          phoneNumber: body.phoneNumber.trim(),
          accountReference: body.accountReference,
          description,
          payerName: body.payerName,
          status: success ? "PENDING" : "FAILED",
          environment: "paystack",
        },
      });
    } catch (dbError) {
      console.error("[MPESA_STK_PUSH_DB_ERROR]", dbError);
    }

    return NextResponse.json({
      success,
      merchantRequestId: charge.reference,
      checkoutRequestId: charge.reference,
      responseCode: "0",
      responseDescription: charge.status,
      customerMessage:
        charge.displayText ||
        "A payment request has been sent to your phone. Please complete the authorization.",
    });
  } catch (error) {
    console.error("[MPESA_STK_PUSH_ERROR]", error);
    const message =
      error instanceof Error
        ? error.message
        : "We could not start the M-Pesa payment. Please check the details and try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
