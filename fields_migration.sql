-- ============================================================
-- FieldPass — Fields / Diamonds migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create fields table
create table if not exists fields (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  address         text,
  city            text,
  state           text not null default 'IN',
  notes           text,
  created_at      timestamptz not null default now()
);

-- 2. RLS
alter table fields enable row level security;

-- Org owners can manage their own fields
create policy "Org owners manage fields"
  on fields for all
  using (
    organization_id in (
      select id from organizations where user_id = auth.uid()
    )
  )
  with check (
    organization_id in (
      select id from organizations where user_id = auth.uid()
    )
  );

-- Anyone can read fields (for discover cards)
create policy "Public read fields"
  on fields for select
  using (true);

-- 3. Add field_id to availability_posts
alter table availability_posts
  add column if not exists field_id uuid references fields(id) on delete set null;
