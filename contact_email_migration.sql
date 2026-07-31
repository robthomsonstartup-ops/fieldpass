-- Add contact_email to organizations
alter table organizations
  add column if not exists contact_email text;

-- Make city and state nullable (in case they were set not null)
alter table organizations
  alter column city drop not null;

alter table organizations
  alter column state drop not null;
