-- Create a table for Invoices
create table invoices (
  id uuid default gen_random_uuid() primary key,
  bill_no integer not null,
  bill_date date not null,
  customer_name text not null,
  customer_address text,
  customer_phone text,
  items jsonb not null default '[]'::jsonb,
  gst_enabled boolean default false,
  gst_percent numeric default 18,
  has_customer_gst boolean default false,
  customer_gst_no text,
  notes text,
  grand_total numeric default 0,
  saved_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: In a production app, you should enable Row Level Security (RLS)
-- and configure policies. For right now, to allow the app to work easily without login:
alter table invoices enable row level security;

-- Policy to allow anyone to insert an invoice (since no login is implemented)
create policy "Allow anonymous inserts" on invoices
  for insert with check (true);

-- Policy to allow anyone to read invoices
create policy "Allow anonymous reads" on invoices
  for select using (true);

-- Policy to allow anyone to delete invoices
create policy "Allow anonymous deletes" on invoices
  for delete using (true);
