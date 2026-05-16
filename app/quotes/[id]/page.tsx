import { createServerClient } from "@/lib/supabase-server";
import { STATUS_COLORS, type QuoteStatus, type QuoteItem } from "@/lib/database.types";
import SendQuoteButton from "./SendQuoteButton";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createServerClient();

  const { data: quote } = await db
    .from("quotes")
    .select("*, customers(*), quote_items(*)")
    .eq("id", id)
    .single();

  if (!quote) notFound();

  const customer = quote.customers as {
    company: string;
    contact: string;
    email: string;
    phone: string;
  } | null;

  const items: QuoteItem[] = (quote.quote_items ?? []).sort(
    (a: QuoteItem, b: QuoteItem) => a.sort_order - b.sort_order
  );

  const status = quote.status as QuoteStatus;

  return (
    <div className="p-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/quotes" className="hover:text-gray-300 transition-colors">Quote Records</Link>
        <span>›</span>
        <span className="text-gray-300 font-mono">{quote.quote_no}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-white font-mono">{quote.quote_no}</h1>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
              {status}
            </span>
          </div>
          <p className="text-gray-400 text-sm">Created {quote.created_at.slice(0, 10)} · {quote.salesperson}</p>
        </div>
        {customer && (
          <SendQuoteButton
            quoteId={quote.id}
            customerEmail={customer.email}
            currentStatus={quote.status}
          />
        )}
      </div>

      <div className="space-y-6">
        {/* Customer */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Bill To</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-base font-semibold text-white">{customer?.company}</p>
              <p className="text-sm text-gray-400 mt-0.5">{customer?.contact}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">{customer?.email}</p>
              <p className="text-sm text-gray-400 font-mono mt-0.5">{customer?.phone}</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-300">Line Items</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/40">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/30">
                  <td className="px-6 py-4 text-sm text-gray-200">{item.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 text-center">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 text-right">
                    RM {Number(item.unit_price).toLocaleString("en-MY", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-200 text-right">
                    RM {(item.quantity * Number(item.unit_price)).toLocaleString("en-MY", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="px-6 py-4 border-t border-gray-800 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>RM {Number(quote.total).toLocaleString("en-MY", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Tax (0%)</span>
                <span>RM 0.00</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-white border-t border-gray-700 pt-2">
                <span>Grand Total</span>
                <span className="text-amber-400">
                  RM {Number(quote.total).toLocaleString("en-MY", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {quote.notes && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Notes</h2>
            <p className="text-sm text-gray-400 leading-relaxed">{quote.notes}</p>
          </div>
        )}

        {/* Email status notice */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start gap-3">
          <svg className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-300">
              {status === "Sent" || status === "Accepted"
                ? "Quote email was sent to " + customer?.email
                : "Click 'Send Quote' to email this quote to " + customer?.email}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {status === "Sent" || status === "Accepted"
                ? "Status updated to Sent automatically after sending."
                : "Status will update to Sent automatically after the email is delivered."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
