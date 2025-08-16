-- Create schema for Personal Finance Manager on Supabase.
-- Run this in Supabase SQL editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamp with time zone default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('bank','credit_card','cash','other')),
  balance numeric not null default 0,
  created_at timestamp with time zone default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income','expense')),
  created_at timestamp with time zone default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric not null,
  currency text not null default 'THB',
  note text,
  date date not null,
  created_at timestamp with time zone default now()
);

create index if not exists idx_tx_user_date on public.transactions(user_id, date desc);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  month text not null, -- YYYY-MM
  amount numeric not null,
  created_at timestamp with time zone default now(),
  unique(user_id, category_id, month)
);

-- RLS
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.profiles enable row level security;

create policy if not exists "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);
create policy if not exists "Insert profile for self"
  on public.profiles for insert
  with check (auth.uid() = id);
create policy if not exists "Update profile for self"
  on public.profiles for update
  using (auth.uid() = id);

create policy if not exists "Accounts are viewable by owner"
  on public.accounts for select
  using (auth.uid() = user_id);
create policy if not exists "Accounts insert by owner"
  on public.accounts for insert
  with check (auth.uid() = user_id);
create policy if not exists "Accounts update by owner"
  on public.accounts for update
  using (auth.uid() = user_id);
create policy if not exists "Accounts delete by owner"
  on public.accounts for delete
  using (auth.uid() = user_id);

create policy if not exists "Categories are viewable by owner"
  on public.categories for select
  using (auth.uid() = user_id);
create policy if not exists "Categories insert by owner"
  on public.categories for insert
  with check (auth.uid() = user_id);
create policy if not exists "Categories update by owner"
  on public.categories for update
  using (auth.uid() = user_id);
create policy if not exists "Categories delete by owner"
  on public.categories for delete
  using (auth.uid() = user_id);

create policy if not exists "Transactions are viewable by owner"
  on public.transactions for select
  using (auth.uid() = user_id);
create policy if not exists "Transactions insert by owner"
  on public.transactions for insert
  with check (auth.uid() = user_id);
create policy if not exists "Transactions update by owner"
  on public.transactions for update
  using (auth.uid() = user_id);
create policy if not exists "Transactions delete by owner"
  on public.transactions for delete
  using (auth.uid() = user_id);

create policy if not exists "Budgets are viewable by owner"
  on public.budgets for select
  using (auth.uid() = user_id);
create policy if not exists "Budgets insert by owner"
  on public.budgets for insert
  with check (auth.uid() = user_id);
create policy if not exists "Budgets update by owner"
  on public.budgets for update
  using (auth.uid() = user_id);
create policy if not exists "Budgets delete by owner"
  on public.budgets for delete
  using (auth.uid() = user_id);
