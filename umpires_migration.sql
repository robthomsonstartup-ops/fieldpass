-- Umpire marketplace
create table if not exists umpires (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade,
  name                text not null,
  email               text,
  phone               text,
  city                text,
  state               text,
  bio                 text,
  certifications      text[],          -- e.g. ['BBO', 'OHSAA', 'NASO']
  experience_years    integer default 0,
  rate_per_game       integer not null, -- cents  e.g. 5000 = $50.00
  game_types          text[],          -- ['baseball','softball']
  age_groups          text[],          -- ['10U','12U','14U','16U','18U']
  travel_radius_miles integer default 30,
  stripe_account_id   text,            -- Stripe Connect Express account
  stripe_onboarded    boolean default false,
  available           boolean default true,
  created_at          timestamptz default now()
);

-- RLS
alter table umpires enable row level security;

create policy if not exists "Umpires are publicly readable"
  on umpires for select to public using (true);

create policy if not exists "Umpire can manage own profile"
  on umpires for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Umpire booking requests
create table if not exists umpire_requests (
  id                  uuid primary key default gen_random_uuid(),
  umpire_id           uuid references umpires(id) on delete cascade,
  org_id              uuid references organizations(id) on delete cascade,
  game_date           date not null,
  game_format         text,
  age_group           text,
  location            text,
  message             text,
  status              text default 'pending',  -- pending | accepted | declined | completed
  rate_agreed         integer,                 -- cents, locked at booking
  payment_status      text default 'unpaid',   -- unpaid | paid | refunded
  payment_intent_id   text,
  created_at          timestamptz default now()
);

alter table umpire_requests enable row level security;

create policy if not exists "Org can create requests"
  on umpire_requests for insert to authenticated
  with check (
    org_id in (select id from organizations where user_id = auth.uid())
  );

create policy if not exists "Parties can read own requests"
  on umpire_requests for select to authenticated
  using (
    org_id in (select id from organizations where user_id = auth.uid())
    or umpire_id in (select id from umpires where user_id = auth.uid())
  );

create policy if not exists "Umpire can update request status"
  on umpire_requests for update to authenticated
  using (umpire_id in (select id from umpires where user_id = auth.uid()));
