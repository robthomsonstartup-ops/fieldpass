-- Org brand color customization
alter table organizations
  add column if not exists primary_color text,
  add column if not exists secondary_color text;
