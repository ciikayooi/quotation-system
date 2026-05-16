"use server";

import { createServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

type CustomerFields = {
  company: string;
  contact: string;
  email: string;
  phone: string;
};

export async function addCustomer(fields: CustomerFields): Promise<{ error?: string }> {
  const db = createServerClient();
  const { error } = await db.from("customers").insert(fields);
  if (error) return { error: error.message };
  revalidatePath("/customers");
  return {};
}

export async function updateCustomer(id: string, fields: CustomerFields): Promise<{ error?: string }> {
  const db = createServerClient();
  const { error } = await db.from("customers").update(fields).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/customers");
  return {};
}

export async function deleteCustomer(id: string): Promise<{ error?: string }> {
  const db = createServerClient();
  const { error } = await db.from("customers").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/customers");
  return {};
}
