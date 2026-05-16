import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Server-side client — uses service role so RLS doesn't block server reads
export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
