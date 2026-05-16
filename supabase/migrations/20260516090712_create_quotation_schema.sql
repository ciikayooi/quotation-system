-- Customers
create table public.customers (
  id          uuid primary key default gen_random_uuid(),
  company     text not null,
  contact     text not null,
  email       text not null,
  phone       text not null,
  created_at  timestamptz not null default now()
);

-- Quotes
create table public.quotes (
  id           uuid primary key default gen_random_uuid(),
  quote_no     text not null unique,
  customer_id  uuid not null references public.customers(id) on delete restrict,
  salesperson  text not null,
  status       text not null default 'Draft' check (status in ('Draft','Sent','Accepted','Rejected')),
  total        numeric(12,2) not null default 0,
  notes        text,
  created_at   timestamptz not null default now()
);

-- Quote line items
create table public.quote_items (
  id           uuid primary key default gen_random_uuid(),
  quote_id     uuid not null references public.quotes(id) on delete cascade,
  description  text not null,
  quantity     integer not null check (quantity > 0),
  unit_price   numeric(12,2) not null check (unit_price >= 0),
  sort_order   integer not null default 0
);

-- Auto-update quotes.total whenever items change
create or replace function public.recalc_quote_total()
returns trigger language plpgsql as $$
begin
  update public.quotes
  set total = (
    select coalesce(sum(quantity * unit_price), 0)
    from public.quote_items
    where quote_id = coalesce(new.quote_id, old.quote_id)
  )
  where id = coalesce(new.quote_id, old.quote_id);
  return new;
end;
$$;

create trigger trg_recalc_total
after insert or update or delete on public.quote_items
for each row execute function public.recalc_quote_total();

-- Auto-generate quote numbers: QT-YYYY-NNN
create sequence public.quote_seq start 1;

create or replace function public.generate_quote_no()
returns trigger language plpgsql as $$
begin
  new.quote_no := 'QT-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.quote_seq')::text, 3, '0');
  return new;
end;
$$;

create trigger trg_quote_no
before insert on public.quotes
for each row when (new.quote_no = '')
execute function public.generate_quote_no();

-- Enable Row Level Security (open policy for now — lock down per user later)
alter table public.customers enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;

create policy "allow all customers" on public.customers for all using (true) with check (true);
create policy "allow all quotes"    on public.quotes    for all using (true) with check (true);
create policy "allow all items"     on public.quote_items for all using (true) with check (true);

-- Seed data
insert into public.customers (company, contact, email, phone) values
  ('Bright Spark Electrical Sdn Bhd', 'Lim Wei Jian',  'weijian@brightspark.com.my',  '+60 12-345 6789'),
  ('PowerLine Solutions',             'Siti Norsham',  'siti@powerline.com.my',        '+60 11-222 3344'),
  ('Mega Build Construction',         'Raj Kumar',     'raj@megabuild.com.my',         '+60 16-788 9900'),
  ('Sunway Facilities Management',    'Tan Pei Ling',  'pelling@sunwayfm.com.my',      '+60 17-654 3210'),
  ('Eco Green Contractors',           'Ahmad Firdaus', 'firdaus@ecogreen.com.my',      '+60 13-998 7766'),
  ('Star Industries Bhd',             'Jenny Wong',    'jenny@starindustries.com.my',  '+60 19-112 4455'),
  ('KL Metro Engineering',            'Hassan Ibrahim','hassan@klmetro.com.my',        '+60 14-567 8901'),
  ('Nexus Tech Park Sdn Bhd',         'Chloe Tan',     'chloe@nexustechpark.com.my',   '+60 18-234 5678');
