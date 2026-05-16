import { createServerClient } from "@/lib/supabase-server";
import { STATUS_COLORS, type QuoteStatus } from "@/lib/database.types";
import Link from "next/link";

export const revalidate = 0;

export default async function Dashboard() {
  const db = createServerClient();

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const [{ data: thisMonth }, { data: recent }] = await Promise.all([
    db
      .from("quotes")
      .select("status, total")
      .gte("created_at", monthStart),
    db
      .from("quotes")
      .select("id, quote_no, salesperson, total, status, created_at, customers(company)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const quotes = thisMonth ?? [];
  const totalThisMonth = quotes.length;
  const closed = quotes.filter((q) => q.status === "Accepted" || q.status === "Rejected").length;
  const pending = quotes.filter((q) => q.status === "Draft" || q.status === "Sent").length;
  const totalValue = quotes.reduce((sum, q) => sum + Number(q.total), 0);

  const monthLabel = now.toLocaleString("en-MY", { month: "long", year: "numeric" });

  const stats = [
    {
      label: "Quotes This Month",
      value: totalThisMonth,
      sub: monthLabel,
      color: "text-amber-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      label: "Closed Quotes",
      value: closed,
      sub: "Accepted + Rejected",
      color: "text-emerald-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Pending Quotes",
      value: pending,
      sub: "Draft + Sent",
      color: "text-blue-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Total Quote Value",
      value: `RM ${totalValue.toLocaleString()}`,
      sub: "This month",
      color: "text-purple-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview for {monthLabel}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{s.label}</p>
              <span className={`${s.color} opacity-70`}>{s.icon}</span>
            </div>
            <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-200">Recent Quotes</h2>
          <Link href="/quotes" className="text-xs text-amber-400 hover:text-amber-300 font-medium">
            View all →
          </Link>
        </div>
        {!recent?.length ? (
          <p className="px-6 py-8 text-sm text-gray-500 text-center">No quotes yet. <Link href="/quotes/create" className="text-amber-400 hover:underline">Create one →</Link></p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                {["Quote No.", "Customer", "Salesperson", "Total", "Status", "Date"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recent.map((q) => (
                <tr key={q.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <Link href={`/quotes/${q.id}`} className="text-sm font-mono text-amber-400 hover:text-amber-300 hover:underline">
                      {q.quote_no}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-200">
                    {(q.customers as { company: string } | null)?.company ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{q.salesperson}</td>
                  <td className="px-6 py-4 text-sm text-gray-200 font-medium">RM {Number(q.total).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[q.status as QuoteStatus]}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{q.created_at.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
