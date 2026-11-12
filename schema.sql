-- Run in Supabase -> SQL Editor
create table products (
  id bigint generated always as identity primary key,
  name text not null, category text default 'General',
  price numeric not null, image_url text, stock int default 0,
  active boolean default true, created_at timestamptz default now());
create table orders (
  id bigint generated always as identity primary key,
  customer text not null, phone text not null, address text not null,
  items jsonb not null, total numeric not null,
  status text default 'new', created_at timestamptz default now());

alter table products enable row level security;
alter table orders enable row level security;
-- shop visitors: read active products, place orders (cannot read orders)
create policy "public read products" on products for select using (active = true or auth.role() = 'authenticated');
create policy "public place order" on orders for insert with check (true);
-- merchant (logged-in user): full control
create policy "merchant products" on products for all to authenticated using (true) with check (true);
create policy "merchant orders" on orders for all to authenticated using (true) with check (true);

-- image storage
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict do nothing;
create policy "public view images" on storage.objects for select using (bucket_id = 'products');
create policy "merchant upload images" on storage.objects for all to authenticated using (bucket_id = 'products') with check (bucket_id = 'products');
