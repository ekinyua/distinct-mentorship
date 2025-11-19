"use client";

import { generateReceipt } from "@/lib/receipt";

interface TransactionDetails {
    checkoutRequestId: string;
    resultCode: number;
    resultDesc: string;
    amount?: number;
    mpesaReceiptNumber?: string;
    phoneNumber?: string;
    transactionDate?: string;
    description?: string;
    payerName?: string;
}

interface ReceiptActionsProps {
    transaction: TransactionDetails;
}

export function ReceiptActions({ transaction }: ReceiptActionsProps) {
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() =>
                    generateReceipt(
                        transaction,
                        undefined,
                        transaction.payerName,
                        "view"
                    )
                }
                className="cursor-pointer group relative text-slate-400 hover:text-primary transition-colors"
                aria-label="View Receipt"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                </svg>
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    View Receipt
                </span>
            </button>

            <button
                onClick={() =>
                    generateReceipt(
                        transaction,
                        undefined,
                        transaction.payerName,
                        "download"
                    )
                }
                className="cursor-pointer group relative text-slate-400 hover:text-primary transition-colors"
                aria-label="Download Receipt"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                </svg>
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Download Receipt
                </span>
            </button>
        </div>
    );
}
