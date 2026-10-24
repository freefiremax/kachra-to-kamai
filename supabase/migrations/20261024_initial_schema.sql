-- ====================================================================
-- KACHRA TO KAMAI (K2K) - INITIAL DATABASE SCHEMA
-- Pilot Region: Kopargaon, Maharashtra
-- ====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  phone text,
  primary_role text default 'buyer' check (primary_role in ('buyer', 'seller', 'agent', 'admin')),
  location text default 'Kopargaon, Maharashtra',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Material Listings Table
create table if not exists public.listings (
  id text primary key,
  title text not null,
  category text not null,
  quantity numeric not null check (quantity >= 0),
  unit text not null,
  price numeric not null check (price >= 0),
  condition text default 'Sorted & Dry',
  area text default 'Kopargaon',
  distance_km numeric default 3.5,
  seller text not null,
  description text,
  image text default '♻️',
  availability text default 'In Stock',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Orders & Consignments Table
create table if not exists public.orders (
  id text primary key,
  listing_id text references public.listings(id) on delete set null,
  listing_title text not null,
  buyer text not null,
  seller text not null,
  quantity numeric not null,
  unit text not null,
  item_total numeric not null,
  delivery_fee numeric default 40,
  commission numeric default 0,
  destination text not null,
  distance_km numeric default 3.5,
  status text not null default 'requested' check (
    status in ('requested', 'seller_accepted', 'payment_simulated', 'agent_assigned', 'picked_up', 'delivered', 'completed')
  ),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Order Audit & Timeline Events
create table if not exists public.order_events (
  id uuid default uuid_generate_v4() primary key,
  order_id text references public.orders(id) on delete cascade not null,
  status text not null,
  actor text not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Row Level Security (RLS) Setup
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.orders enable row level security;
alter table public.order_events enable row level security;

-- Public read policies for market participants
create policy "Allow public read on listings"
  on public.listings for select
  using (true);

create policy "Allow public insert on listings"
  on public.listings for insert
  with check (true);

create policy "Allow public update on listings"
  on public.listings for update
  using (true);

create policy "Allow public read on orders"
  on public.orders for select
  using (true);

create policy "Allow public insert on orders"
  on public.orders for insert
  with check (true);

create policy "Allow public update on orders"
  on public.orders for update
  using (true);

create policy "Allow public read on order_events"
  on public.order_events for select
  using (true);

create policy "Allow public insert on order_events"
  on public.order_events for insert
  with check (true);

-- Enable Realtime replication
alter publication supabase_realtime add table public.listings;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_events;
