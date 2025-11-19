import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  MpesaCallbackResult,
  getStoredCallback,
  queryStkPush,
} from "@/lib/mpesa";

interface QueryBody {
  checkoutRequestId: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<QueryBody>;

    if (!body.checkoutRequestId) {
      return NextResponse.json(
        { error: "Missing checkoutRequestId." },
        { status: 400 }
      );
    }

    const checkoutRequestId = body.checkoutRequestId;

    // First, check if we already have a transaction record in the database
    const tx = await prisma.transaction.findUnique({
      where: { checkoutRequestId },
    });

    if (tx && tx.status !== "PENDING") {
      return NextResponse.json({
        success: tx.status === "SUCCESS",
        checkoutRequestId: tx.checkoutRequestId,
        resultCode: tx.resultCode ?? (tx.status === "SUCCESS" ? 0 : 1),
        resultDesc:
          tx.resultDesc ?? (tx.status === "SUCCESS" ? "Success" : "Failed"),
        mpesaReceiptNumber: tx.mpesaReceiptNumber,
        amount: tx.amount,
        phoneNumber: tx.phoneNumber,
        transactionDate: tx.transactionDate,
      });
    }

    // Fallback: check the in-memory callback store (useful immediately after callback)
    const stored: MpesaCallbackResult | null =
      getStoredCallback(checkoutRequestId);

    if (stored) {
      return NextResponse.json({
        success: stored.resultCode === 0,
        ...stored,
      });
    }

    // Final fallback: ask Safaricom directly via STK query and update the DB
    const result = await queryStkPush(checkoutRequestId);

    try {
      await prisma.transaction.updateMany({
        where: { checkoutRequestId },
        data: {
          status: result.ResultCode === 0 ? "SUCCESS" : "FAILED",
          resultCode: result.ResultCode,
          resultDesc: result.ResultDesc,
        },
      });
    } catch (dbError) {
      console.error("[MPESA_QUERY_DB_ERROR]", dbError);
    }

    return NextResponse.json({
      success: result.ResultCode === 0,
      checkoutRequestId: result.CheckoutRequestID,
      resultCode: result.ResultCode,
      resultDesc: result.ResultDesc,
    });
  } catch (error) {
    console.error("[MPESA_QUERY_ERROR]", error);
    return NextResponse.json(
      {
        error:
          "We could not confirm the payment status at this time. Please try again.",
      },
      { status: 500 }
    );
  }
}
