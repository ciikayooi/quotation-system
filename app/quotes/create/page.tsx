import { createServerClient } from "@/lib/supabase-server";
import CreateQuoteForm from "./CreateQuoteForm";

export const revalidate = 0;

export default async function CreateQuotePage() {
  const db = createServerClient();
  const { data: customers } = await db
    .from("customers")
    .select("id, company")
    .order("company");

  return <CreateQuoteForm customers={customers ?? []} />;
}
