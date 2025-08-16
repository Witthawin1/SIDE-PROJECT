-- Fix policy creation: PostgreSQL doesn't support "CREATE POLICY IF NOT EXISTS".
-- This script safely re-creates policies by dropping existing ones first.

-- Ensure gen_random_uuid exists for any future scripts.
create extension if not exists pgcrypto;

-- Ensure RLS is enabled (safe to run repeatedly).
alter table if exists public.accounts enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.transactions enable row level security;
alter table if exists public.budgets enable row level security;
alter table if exists public.profiles enable row level security;

-- PROFILES
drop policy if exists "Profiles are viewable by owner" on public.profiles;
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Insert profile for self" on public.profiles;
create policy "Insert profile for self"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Update profile for self" on public.profiles;
create policy "Update profile for self"
  on public.profiles for update
  using (auth.uid() = id);

-- ACCOUNTS
drop policy if exists "Accounts are viewable by owner" on public.accounts;
create policy "Accounts are viewable by owner"
  on public.accounts for select
  using (auth.uid() = user_id);

drop policy if exists "Accounts insert by owner" on public.accounts;
create policy "Accounts insert by owner"
  on public.accounts for insert
  with check (auth.uid() = user_id);

drop policy if exists "Accounts update by owner" on public.accounts;
create policy "Accounts update by owner"
  on public.accounts for update
  using (auth.uid() = user_id);

drop policy if exists "Accounts delete by owner" on public.accounts;
create policy "Accounts delete by owner"
  on public.accounts for delete
  using (auth.uid() = user_id);

-- CATEGORIES
drop policy if exists "Categories are viewable by owner" on public.categories;
create policy "Categories are viewable by owner"
  on public.categories for select
  using (auth.uid() = user_id);

drop policy if exists "Categories insert by owner" on public.categories;
create policy "Categories insert by owner"
  on public.categories for insert
  with check (auth.uid() = user_id);

drop policy if exists "Categories update by owner" on public.categories;
create policy "Categories update by owner"
  on public.categories for update
  using (auth.uid() = user_id);

drop policy if exists "Categories delete by owner" on public.categories;
create policy "Categories delete by owner"
  on public.categories for delete
  using (auth.uid() = user_id);

-- TRANSACTIONS
drop policy if exists "Transactions are viewable by owner" on public.transactions;
create policy "Transactions are viewable by owner"
  on public.transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Transactions insert by owner" on public.transactions;
create policy "Transactions insert by owner"
  on public.transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Transactions update by owner" on public.transactions;
create policy "Transactions update by owner"
  on public.transactions for update
  using (auth.uid() = user_id);

drop policy if exists "Transactions delete by owner" on public.transactions;
create policy "Transactions delete by owner"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- BUDGETS
drop policy if exists "Budgets are viewable by owner" on public.budgets;
create policy "Budgets are viewable by owner"
  on public.budgets for select
  using (auth.uid() = user_id);

drop policy if exists "Budgets insert by owner" on public.budgets;
create policy "Budgets insert by owner"
  on public.budgets for insert
  with check (auth.uid() = user_id);

drop policy if exists "Budgets update by owner" on public.budgets;
create policy "Budgets update by owner"
  on public.budgets for update
  using (auth.uid() = user_id);

drop policy if exists "Budgets delete by owner" on public.budgets;
create policy "Budgets delete by owner"
  on public.budgets for delete
  using (auth.uid() = user_id);
