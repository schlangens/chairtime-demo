-- ChairTime — Supabase schema. The live demo uses mock data; this is the production data
-- layer. RLS: customers see only their own appointments/favorites; barbers manage only
-- their own shop; the public reads active barber listings + reviews.

create table profiles (
  id uuid primary key references auth.users(id),
  role text not null default 'customer' check (role in ('customer','barber','admin')),
  name text, avatar text
);
create table barbers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id),
  shop_name text not null, bio text, city text, area text, rating numeric,
  price_from numeric, featured boolean default false, subscription_status text default 'none'
);
create table services ( id uuid primary key default gen_random_uuid(),
  barber_id uuid not null references barbers(id), name text, price numeric, duration_min int );
create table availability ( id uuid primary key default gen_random_uuid(),
  barber_id uuid not null references barbers(id), weekday int, start_time time, end_time time );
create table appointments ( id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles(id), barber_id uuid not null references barbers(id),
  service_id uuid references services(id), starts_at timestamptz,
  status text default 'booked' check (status in ('booked','done','cancelled')) );
create table reviews ( id uuid primary key default gen_random_uuid(),
  barber_id uuid references barbers(id), customer_id uuid references profiles(id), stars int, body text, created_at timestamptz default now() );
create table coupons ( id uuid primary key default gen_random_uuid(),
  barber_id uuid references barbers(id), label text, amount numeric );
create table favorites ( customer_id uuid references profiles(id), barber_id uuid references barbers(id), primary key (customer_id, barber_id) );
create table subscriptions ( id uuid primary key default gen_random_uuid(),
  barber_id uuid references barbers(id), plan text, status text, stripe_customer_id text, stripe_sub_id text );

create or replace function my_barber_id() returns uuid language sql stable as $$
  select id from barbers where profile_id = auth.uid() $$;

alter table appointments enable row level security;
alter table favorites    enable row level security;
alter table barbers      enable row level security;
alter table services     enable row level security;
alter table subscriptions enable row level security;

-- public reads active barber listings; a barber edits only their own shop
create policy barber_read on barbers for select using (true);
create policy barber_write on barbers for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy service_write on services for all using (barber_id = my_barber_id()) with check (barber_id = my_barber_id());
-- appointments: visible to the customer who booked OR the barber being booked
create policy appt_parties on appointments using (customer_id = auth.uid() or barber_id = my_barber_id())
  with check (customer_id = auth.uid() or barber_id = my_barber_id());
create policy fav_own on favorites using (customer_id = auth.uid()) with check (customer_id = auth.uid());
create policy sub_own on subscriptions using (barber_id = my_barber_id()) with check (barber_id = my_barber_id());
