import { prisma } from "@/lib/prisma";
import { ReceiptActions } from "./ReceiptActions";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="section-container py-10">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-slate-900">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Recent M-Pesa payments captured from the Distinct Mentorship site.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Receipt</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-slate-100">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                  {tx.phoneNumber}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-900">
                  KES {tx.amount}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[0.7rem] font-medium ${tx.status === "SUCCESS"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                      : tx.status === "FAILED"
                        ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                        : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                      }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-700">
                  {tx.status === "SUCCESS" ? (
                    <ReceiptActions
                      transaction={{
                        checkoutRequestId: tx.checkoutRequestId,
                        resultCode: tx.resultCode ?? 1,
                        resultDesc: tx.resultDesc ?? "",
                        amount: tx.amount,
                        mpesaReceiptNumber: tx.mpesaReceiptNumber ?? undefined,
                        phoneNumber: tx.phoneNumber,
                        transactionDate: tx.createdAt.toISOString(),
                        description: tx.description ?? undefined,
                        payerName: tx.payerName || undefined,
                      }}
                    />
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-slate-700">
                  {tx.description ?? "-"}
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-xs text-slate-500"
                >
                  No transactions found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

