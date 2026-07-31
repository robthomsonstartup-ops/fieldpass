-- FieldPass — Verified orgs migration
-- Run in Supabase SQL Editor

alter table organizations add column if not exists verified boolean not null default false;
