import type { QuoteItem } from "./database.types";

type Props = {
  quoteNo: string;
  customerCompany: string;
  customerContact: string;
  salesperson: string;
  date: string;
  items: QuoteItem[];
  total: number;
  notes?: string | null;
};

export function QuoteEmailHtml({
  quoteNo,
  customerCompany,
  customerContact,
  salesperson,
  date,
  items,
  total,
  notes,
}: Props): string {
  const itemRows = items
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #2a2a2a;color:#e2e8f0;font-size:14px;">${item.description}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #2a2a2a;color:#94a3b8;font-size:14px;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #2a2a2a;color:#94a3b8;font-size:14px;text-align:right;">RM ${Number(item.unit_price).toLocaleString("en-MY", { minimumFractionDigits: 2 })}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #2a2a2a;color:#e2e8f0;font-size:14px;text-align:right;font-weight:500;">RM ${(item.quantity * Number(item.unit_price)).toLocaleString("en-MY", { minimumFractionDigits: 2 })}</td>
      </tr>`
    )
    .join("");

  const notesSection = notes
    ? `<tr><td colspan="4" style="padding:16px 12px 0;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">Notes</p>
        <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.6;">${notes}</p>
       </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Quotation ${quoteNo}</title></head>
<body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1a1f2e;border-radius:12px 12px 0 0;padding:32px 40px;border-bottom:1px solid #1e293b;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="display:inline-block;background:#f59e0b;border-radius:8px;width:36px;height:36px;line-height:36px;text-align:center;font-size:18px;margin-bottom:12px;">⚡</div>
                  <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;">Quotation</p>
                  <h1 style="margin:4px 0 0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">${quoteNo}</h1>
                </td>
                <td align="right" valign="top">
                  <p style="margin:0;font-size:12px;color:#64748b;">${date}</p>
                  <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">Prepared by <strong style="color:#e2e8f0;">${salesperson}</strong></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="background:#1a1f2e;padding:28px 40px 20px;border-bottom:1px solid #1e293b;">
            <p style="margin:0 0 6px;font-size:13px;color:#64748b;">Prepared for</p>
            <h2 style="margin:0 0 4px;font-size:20px;font-weight:600;color:#ffffff;">${customerCompany}</h2>
            <p style="margin:0;font-size:14px;color:#94a3b8;">Attn: ${customerContact}</p>
            <p style="margin:16px 0 0;font-size:14px;color:#94a3b8;line-height:1.6;">
              Please find below our quotation for your review. We appreciate your interest and look forward to working with you.
            </p>
          </td>
        </tr>

        <!-- Items table -->
        <tr>
          <td style="background:#1a1f2e;padding:0 40px 8px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <thead>
                <tr style="background:#0f1117;">
                  <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">Description</th>
                  <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">Unit Price</th>
                  <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;">Subtotal</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
              ${notesSection}
            </table>
          </td>
        </tr>

        <!-- Total -->
        <tr>
          <td style="background:#1a1f2e;padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="right">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 12px;font-size:13px;color:#64748b;text-align:right;">Subtotal</td>
                      <td style="padding:6px 12px;font-size:13px;color:#94a3b8;text-align:right;min-width:120px;">RM ${Number(total).toLocaleString("en-MY", { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 12px;font-size:13px;color:#64748b;text-align:right;">Tax (0%)</td>
                      <td style="padding:6px 12px;font-size:13px;color:#94a3b8;text-align:right;">RM 0.00</td>
                    </tr>
                    <tr>
                      <td colspan="2"><div style="height:1px;background:#1e293b;margin:8px 0;"></div></td>
                    </tr>
                    <tr>
                      <td style="padding:8px 12px;font-size:16px;font-weight:700;color:#ffffff;text-align:right;">Grand Total</td>
                      <td style="padding:8px 12px;font-size:20px;font-weight:700;color:#f59e0b;text-align:right;">RM ${Number(total).toLocaleString("en-MY", { minimumFractionDigits: 2 })}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#111827;border-radius:0 0 12px 12px;padding:24px 40px;border-top:1px solid #1e293b;">
            <p style="margin:0;font-size:13px;color:#475569;text-align:center;line-height:1.6;">
              This quotation is valid for 30 days from the date issued.<br>
              To accept, simply reply to this email or contact your salesperson.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function quoteEmailSubject(quoteNo: string, company: string): string {
  return `Quotation ${quoteNo} from QuoteFlow — ${company}`;
}
