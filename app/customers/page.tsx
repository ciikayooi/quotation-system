import { createServerClient } from "@/lib/supabase-server";
import CustomersClient from "./CustomersClient";

export const revalidate = 0;

export default async function CustomersPage() {
  const db = createServerClient();
  const { data } = await db
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <CustomersClient initial={data ?? []} />
    </div>
  );
}
