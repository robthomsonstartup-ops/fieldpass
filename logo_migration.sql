-- Org logo support
alter table organizations
  add column if not exists logo_url text;

-- Supabase Storage: run these in the SQL editor too
insert into storage.buckets (id, name, public)
values ('org-logos', 'org-logos', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload to their own folder
create policy if not exists "Org members can upload logos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'org-logos');

-- Allow anyone to read logos (public bucket)
create policy if not exists "Logos are publicly readable"
on storage.objects for select
to public
using (bucket_id = 'org-logos');

-- Allow authenticated users to update/delete their own logos
create policy if not exists "Org members can update logos"
on storage.objects for update
to authenticated
using (bucket_id = 'org-logos');

create policy if not exists "Org members can delete logos"
on storage.objects for delete
to authenticated
using (bucket_id = 'org-logos');
