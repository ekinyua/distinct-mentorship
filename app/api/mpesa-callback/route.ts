import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { parseCallbackBody, storeCallback } from "@/lib/mpesa";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("[MPESA_CALLBACK_RAW]", JSON.stringify(body, null, 2));

    const parsed = parseCallbackBody(body);
    if (parsed) {
      // Update the matching transaction in the database
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {
          status: parsed.resultCode === 0 ? "SUCCESS" : "FAILED",
          resultCode: parsed.resultCode,
          resultDesc: parsed.resultDesc,
          mpesaReceiptNumber: parsed.mpesaReceiptNumber,
          transactionDate: parsed.transactionDate,
        };

        if (parsed.amount != null) {
          updateData.amount = parsed.amount;
        }
        if (parsed.phoneNumber) {
          updateData.phoneNumber = parsed.phoneNumber;
        }

        await prisma.transaction.upsert({
          where: { checkoutRequestId: parsed.checkoutRequestId },
          update: updateData,
          create: {
            checkoutRequestId: parsed.checkoutRequestId,
            amount: parsed.amount || 0,
            phoneNumber: parsed.phoneNumber || "",
            mpesaReceiptNumber: parsed.mpesaReceiptNumber,
            transactionDate: parsed.transactionDate,
            resultCode: parsed.resultCode,
            resultDesc: parsed.resultDesc,
            status: parsed.resultCode === 0 ? "SUCCESS" : "FAILED",
            // Default values for missing fields
            accountReference: "Unknown",
            description: "Created from callback",
            environment:
              process.env.MPESA_ENV === "production" ? "production" : "sandbox",
          },
        });
      } catch (dbError) {
        console.error("[MPESA_CALLBACK_DB_ERROR]", dbError);
      }

      storeCallback(parsed);
      console.log("[MPESA_CALLBACK_PARSED]", parsed);
    }

    // Always respond with 200 OK so Safaricom does not retry excessively.
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[MPESA_CALLBACK_ERROR]", error);
    // Still return 200 to avoid repeated callbacks; log for investigation.
    return NextResponse.json({ received: false });
  }
}
