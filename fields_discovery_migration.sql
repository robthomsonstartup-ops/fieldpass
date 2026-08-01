-- Field discovery: make fields browsable/rentable
alter table fields
  add column if not exists available_for_rent boolean default false,
  add column if not exists surface_type text,        -- turf | grass | dirt | artificial
  add column if not exists field_type text,          -- baseball | softball | multipurpose
  add column if not exists capacity integer,
  add column if not exists rental_rate_per_day integer,  -- cents, null = contact for pricing
  add column if not exists rental_contact_email text,
  add column if not exists rental_contact_phone text,
  add column if not exists rental_notes text;
