"use server";

import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase-server";
import { QuoteEmailHtml, quoteEmailSubject } from "@/lib/email-template";
import { revalidatePath } from "next/cache";

export async function sendQuoteEmail(quoteId: string): Promise<{ error?: string }> {
  const db = createServerClient();

  // Fetch full quote with customer + items
  const { data: quote, error: fetchErr } = await db
    .from("quotes")
    .select("*, customers(*), quote_items(*)")
    .eq("id", quoteId)
    .single();

  if (fetchErr || !quote) return { error: "Quote not found" };

  const customer = quote.customers as {
    company: string;
    contact: string;
    email: string;
  } | null;

  if (!customer?.email) return { error: "Customer has no email address" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_YOUR_KEY_HERE") {
    return { error: "Resend API key not configured — add RESEND_API_KEY to .env.local" };
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  const { error: sendErr } = await resend.emails.send({
    from: fromEmail,
    to: customer.email,
    subject: quoteEmailSubject(quote.quote_no, customer.company),
    html: QuoteEmailHtml({
      quoteNo: quote.quote_no,
      customerCompany: customer.company,
      customerContact: customer.contact,
      salesperson: quote.salesperson,
      date: quote.created_at.slice(0, 10),
      items: quote.quote_items ?? [],
      total: Number(quote.total),
      notes: quote.notes,
    }),
  });

  if (sendErr) return { error: sendErr.message };

  // Mark as Sent
  await db.from("quotes").update({ status: "Sent" }).eq("id", quoteId);

  revalidatePath(`/quotes/${quoteId}`);
  revalidatePath("/quotes");
  revalidatePath("/");

  return {};
}
