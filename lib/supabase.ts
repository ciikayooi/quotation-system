import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Browser / client-component singleton
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(url, anon);
