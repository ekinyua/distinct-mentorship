import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  MpesaCallbackResult,
  getStoredCallback,
  queryStkPush,
} from "@/lib/mpesa";
import { verifyPaystackTransaction } from "@/lib/paystack";

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

    // If this is a Paystack-backed transaction, use Paystack's verify API
    // instead of querying Safaricom directly.
    if (tx && tx.environment === "paystack") {
      try {
        const verification = await verifyPaystackTransaction(checkoutRequestId);

        if (verification && verification.status) {
          const normalizedStatus = verification.status.toLowerCase();
          const isSuccess = normalizedStatus === "success";
          const isFinal = [
            "success",
            "failed",
            "abandoned",
            "reversed",
          ].includes(normalizedStatus);

          if (isFinal) {
            const resultCode = isSuccess ? 0 : 1;
            const resultDesc =
              verification.gatewayResponse ??
              (isSuccess ? "Success" : "Failed");

            try {
              await prisma.transaction.upsert({
                where: { checkoutRequestId },
                update: {
                  status: isSuccess ? "SUCCESS" : "FAILED",
                  resultCode,
                  resultDesc,
                  amount: verification.amount ?? tx.amount ?? undefined,
                  phoneNumber:
                    verification.customerPhone ?? tx.phoneNumber ?? undefined,
                  transactionDate:
                    verification.paidAt ?? tx.transactionDate ?? undefined,
                  mpesaReceiptNumber: verification.reference,
                  environment: "paystack",
                },
                create: {
                  checkoutRequestId,
                  amount: verification.amount ?? 0,
                  phoneNumber: verification.customerPhone ?? "",
                  status: isSuccess ? "SUCCESS" : "FAILED",
                  resultCode,
                  resultDesc,
                  description: "Created from Paystack verify fallback",
                  mpesaReceiptNumber: verification.reference,
                  environment: "paystack",
                },
              });
            } catch (dbError) {
              console.error("[PAYSTACK_VERIFY_DB_ERROR]", dbError);
            }

            return NextResponse.json({
              success: isSuccess,
              checkoutRequestId,
              resultCode,
              resultDesc,
              mpesaReceiptNumber: verification.reference,
              amount: verification.amount ?? tx.amount,
              phoneNumber:
                verification.customerPhone ?? tx.phoneNumber ?? undefined,
              transactionDate:
                verification.paidAt ?? tx.transactionDate ?? undefined,
            });
          }
        }
      } catch (verifyError) {
        console.error("[PAYSTACK_VERIFY_ERROR]", verifyError);
      }

      // If verification did not return a final status, treat as pending.
      return NextResponse.json({
        success: false,
        checkoutRequestId,
        resultCode: 1032,
        resultDesc: "Transaction pending or not found",
      });
    }

    // Final fallback for direct M-Pesa: ask Safaricom via STK query and update the DB
    try {
      const result = await queryStkPush(checkoutRequestId);

      try {
        await prisma.transaction.upsert({
          where: { checkoutRequestId },
          update: {
            status: result.ResultCode === 0 ? "SUCCESS" : "FAILED",
            resultCode: result.ResultCode,
            resultDesc: result.ResultDesc,
          },
          create: {
            checkoutRequestId,
            amount: 0, // Unknown at this point if not in DB
            phoneNumber: "", // Unknown
            status: result.ResultCode === 0 ? "SUCCESS" : "FAILED",
            resultCode: result.ResultCode,
            resultDesc: result.ResultDesc,
            description: "Created from query fallback",
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
    } catch (queryError) {
      // If Safaricom query fails (e.g. transaction not found yet), return pending
      // so the frontend keeps polling.
      console.log("[MPESA_QUERY_PENDING]", queryError);
      return NextResponse.json({
        success: false,
        checkoutRequestId,
        resultCode: 1032, // Use a code that implies pending/cancelled or just rely on success: false
        resultDesc: "Transaction pending or not found",
      });
    }
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
