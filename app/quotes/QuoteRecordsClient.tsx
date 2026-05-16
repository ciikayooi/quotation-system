"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { STATUS_COLORS, type QuoteStatus } from "@/lib/database.types";

type QuoteRow = {
  id: string;
  quote_no: string;
  salesperson: string;
  total: number;
  status: string;
  created_at: string;
  customers: { company: string } | null;
  quote_items: { description: string; quantity: number; unit_price: number; sort_order: number }[];
};

const ALL_STATUSES: QuoteStatus[] = ["Draft", "Sent", "Accepted", "Rejected"];

export default function QuoteRecordsClient({ quotes }: { quotes: QuoteRow[] }) {
  const [activeFilter, setActiveFilter] = useState<QuoteStatus | "All">("All");

  const filtered = useMemo(
    () => activeFilter === "All" ? quotes : quotes.filter((q) => q.status === activeFilter),
    [quotes, activeFilter]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: quotes.length };
    ALL_STATUSES.forEach((s) => { map[s] = quotes.filter((q) => q.status === s).length; });
    return map;
  }, [quotes]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Quote Records</h1>
          <p className="text-gray-400 text-sm mt-1">{quotes.length} quotes total</p>
        </div>
        <Link
          href="/quotes/create"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Quote
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6">
        {(["All", ...ALL_STATUSES] as const).map((s) => {
          const active = activeFilter === s;
          return (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "text-gray-400 border-gray-700 hover:text-gray-200 hover:border-gray-600"
              }`}
            >
              {s} ({counts[s]})
            </button>
          );
        })}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {!filtered.length ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-500">
              {activeFilter === "All"
                ? <>No quotes yet. <Link href="/quotes/create" className="text-amber-400 hover:underline">Create one →</Link></>
                : `No ${activeFilter} quotes.`}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/40">
                {["Quote No.", "Customer", "Items", "Total (RM)", "Salesperson", "Status", "Date"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((q) => {
                const items = [...(q.quote_items ?? [])].sort((a, b) => a.sort_order - b.sort_order);
                return (
                  <tr key={q.id} className="hover:bg-gray-800/40">
                    <td className="px-6 py-4">
                      <Link href={`/quotes/${q.id}`} className="text-sm font-mono text-amber-400 hover:text-amber-300 hover:underline font-medium">
                        {q.quote_no}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">{q.customers?.company ?? "—"}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        {items.length ? items.map((item, i) => (
                          <p key={i} className="text-xs text-gray-500">{item.quantity}× {item.description}</p>
                        )) : <span className="text-xs text-gray-600">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-100">
                      {Number(q.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{q.salesperson}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[q.status as QuoteStatus]}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{q.created_at.slice(0, 10)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
