export type Customer = {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type QuoteItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type QuoteStatus = "Draft" | "Sent" | "Accepted" | "Rejected";

export type Quote = {
  id: string;
  quoteNo: string;
  customerId: string;
  customerName: string;
  items: QuoteItem[];
  total: number;
  status: QuoteStatus;
  createdAt: string;
  salesperson: string;
};

export const customers: Customer[] = [
  {
    id: "c1",
    company: "Bright Spark Electrical Sdn Bhd",
    contact: "Lim Wei Jian",
    email: "weijian@brightspark.com.my",
    phone: "+60 12-345 6789",
    createdAt: "2026-01-10",
  },
  {
    id: "c2",
    company: "PowerLine Solutions",
    contact: "Siti Norsham",
    email: "siti@powerline.com.my",
    phone: "+60 11-222 3344",
    createdAt: "2026-02-03",
  },
  {
    id: "c3",
    company: "Mega Build Construction",
    contact: "Raj Kumar",
    email: "raj@megabuild.com.my",
    phone: "+60 16-788 9900",
    createdAt: "2026-02-18",
  },
  {
    id: "c4",
    company: "Sunway Facilities Management",
    contact: "Tan Pei Ling",
    email: "pelling@sunwayfm.com.my",
    phone: "+60 17-654 3210",
    createdAt: "2026-03-05",
  },
  {
    id: "c5",
    company: "Eco Green Contractors",
    contact: "Ahmad Firdaus",
    email: "firdaus@ecogreen.com.my",
    phone: "+60 13-998 7766",
    createdAt: "2026-03-22",
  },
  {
    id: "c6",
    company: "Star Industries Bhd",
    contact: "Jenny Wong",
    email: "jenny@starindustries.com.my",
    phone: "+60 19-112 4455",
    createdAt: "2026-04-01",
  },
  {
    id: "c7",
    company: "KL Metro Engineering",
    contact: "Hassan Ibrahim",
    email: "hassan@klmetro.com.my",
    phone: "+60 14-567 8901",
    createdAt: "2026-04-14",
  },
  {
    id: "c8",
    company: "Nexus Tech Park Sdn Bhd",
    contact: "Chloe Tan",
    email: "chloe@nexustechpark.com.my",
    phone: "+60 18-234 5678",
    createdAt: "2026-05-02",
  },
];

export const quotes: Quote[] = [
  {
    id: "q1",
    quoteNo: "QT-2026-001",
    customerId: "c1",
    customerName: "Bright Spark Electrical Sdn Bhd",
    items: [
      { description: "MCB 63A 3-Phase", quantity: 20, unitPrice: 85 },
      { description: "Cable Tray 100mm x 50mm", quantity: 10, unitPrice: 120 },
    ],
    total: 2900,
    status: "Accepted",
    createdAt: "2026-05-02",
    salesperson: "Ahmad Faris",
  },
  {
    id: "q2",
    quoteNo: "QT-2026-002",
    customerId: "c3",
    customerName: "Mega Build Construction",
    items: [
      { description: "Switchgear Panel 400A", quantity: 2, unitPrice: 4500 },
      { description: "Earth Leakage Circuit Breaker", quantity: 15, unitPrice: 220 },
    ],
    total: 12300,
    status: "Sent",
    createdAt: "2026-05-05",
    salesperson: "Nurul Ain",
  },
  {
    id: "q3",
    quoteNo: "QT-2026-003",
    customerId: "c2",
    customerName: "PowerLine Solutions",
    items: [
      { description: "PVC Conduit 20mm (100m roll)", quantity: 5, unitPrice: 180 },
      { description: "Junction Box IP65", quantity: 30, unitPrice: 45 },
    ],
    total: 2250,
    status: "Draft",
    createdAt: "2026-05-08",
    salesperson: "Ahmad Faris",
  },
  {
    id: "q4",
    quoteNo: "QT-2026-004",
    customerId: "c4",
    customerName: "Sunway Facilities Management",
    items: [
      { description: "LED Batten Light 36W", quantity: 100, unitPrice: 55 },
      { description: "Emergency Exit Light", quantity: 20, unitPrice: 130 },
    ],
    total: 8100,
    status: "Accepted",
    createdAt: "2026-05-10",
    salesperson: "Nurul Ain",
  },
  {
    id: "q5",
    quoteNo: "QT-2026-005",
    customerId: "c6",
    customerName: "Star Industries Bhd",
    items: [
      { description: "Industrial Motor Starter 15kW", quantity: 4, unitPrice: 980 },
    ],
    total: 3920,
    status: "Rejected",
    createdAt: "2026-05-11",
    salesperson: "Ahmad Faris",
  },
  {
    id: "q6",
    quoteNo: "QT-2026-006",
    customerId: "c7",
    customerName: "KL Metro Engineering",
    items: [
      { description: "Transformer 100kVA", quantity: 1, unitPrice: 12500 },
      { description: "HV Cable 3-Core 95mm²", quantity: 50, unitPrice: 210 },
    ],
    total: 23000,
    status: "Sent",
    createdAt: "2026-05-13",
    salesperson: "Nurul Ain",
  },
  {
    id: "q7",
    quoteNo: "QT-2026-007",
    customerId: "c5",
    customerName: "Eco Green Contractors",
    items: [
      { description: "Solar PV Inverter 5kW", quantity: 3, unitPrice: 2200 },
      { description: "DC Cable 6mm² (100m)", quantity: 6, unitPrice: 350 },
    ],
    total: 8700,
    status: "Draft",
    createdAt: "2026-05-14",
    salesperson: "Ahmad Faris",
  },
  {
    id: "q8",
    quoteNo: "QT-2026-008",
    customerId: "c8",
    customerName: "Nexus Tech Park Sdn Bhd",
    items: [
      { description: "UPS 10kVA Online", quantity: 2, unitPrice: 8800 },
      { description: "PDU Rack Mount 16A", quantity: 10, unitPrice: 420 },
    ],
    total: 21800,
    status: "Sent",
    createdAt: "2026-05-15",
    salesperson: "Nurul Ain",
  },
];

export const STATUS_COLORS: Record<QuoteStatus, string> = {
  Draft: "bg-slate-700 text-slate-300",
  Sent: "bg-blue-900 text-blue-300",
  Accepted: "bg-emerald-900 text-emerald-300",
  Rejected: "bg-red-900 text-red-400",
};
