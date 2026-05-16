export type QuoteStatus = "Draft" | "Sent" | "Accepted" | "Rejected";

export type Customer = {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  created_at: string;
};

export type QuoteItem = {
  id: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  sort_order: number;
};

export type Quote = {
  id: string;
  quote_no: string;
  customer_id: string;
  salesperson: string;
  status: QuoteStatus;
  total: number;
  notes: string | null;
  created_at: string;
  // joined relations
  customers?: { company: string } | null;
  quote_items?: QuoteItem[];
};

export type Database = {
  public: {
    Tables: {
      customers: { Row: Customer; Insert: Omit<Customer, "id" | "created_at">; Update: Partial<Omit<Customer, "id">> };
      quotes: {
        Row: Quote;
        Insert: Omit<Quote, "id" | "created_at" | "total" | "customers" | "quote_items">;
        Update: Partial<Omit<Quote, "id" | "customers" | "quote_items">>;
      };
      quote_items: {
        Row: QuoteItem;
        Insert: Omit<QuoteItem, "id">;
        Update: Partial<Omit<QuoteItem, "id">>;
      };
    };
  };
};

export const STATUS_COLORS: Record<QuoteStatus, string> = {
  Draft: "bg-slate-700 text-slate-300",
  Sent: "bg-blue-900 text-blue-300",
  Accepted: "bg-emerald-900 text-emerald-300",
  Rejected: "bg-red-900 text-red-400",
};
