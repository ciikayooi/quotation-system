import { createServerClient } from "@/lib/supabase-server";
import QuoteRecordsClient from "./QuoteRecordsClient";

export const revalidate = 0;

export default async function QuoteRecordsPage() {
  const db = createServerClient();
  const { data } = await db
    .from("quotes")
    .select("id, quote_no, salesperson, total, status, created_at, customers(company), quote_items(description, quantity, unit_price, sort_order)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <QuoteRecordsClient quotes={(data ?? []) as Parameters<typeof QuoteRecordsClient>[0]["quotes"]} />
    </div>
  );
}
