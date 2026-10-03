-- STATE LEVEL ROBO RACE 2026 DATABASE SCHEMA

create extension if not exists pgcrypto;

create type public.payment_method_enum as enum ('ONLINE', 'EVENT_DAY');
create type public.payment_status_enum as enum ('PAID', 'PENDING', 'FAILED');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_settings (
  id bigint generated always as identity primary key,
  event_name text not null default 'STATE LEVEL ROBO RACE 2026',
  event_date date not null default '2026-11-21',
  registration_fee numeric(10,2) not null default 200.00,
  prize_1 numeric(10,2) not null default 10000.00,
  prize_2 numeric(10,2) not null default 5000.00,
  prize_3 numeric(10,2) not null default 3000.00,
  venue text not null default 'To be announced',
  contact_email text default 'info@roborace.example',
  contact_phone text default '+91 00000 00000',
  rules jsonb not null default '[]'::jsonb,
  registration_open boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  registration_id text not null unique,
  team_name text not null,
  leader_name text not null,
  leader_phone text not null,
  leader_email text not null,
  college text not null,
  city text not null,
  member2_name text,
  member2_phone text,
  member2_email text,
  robot_name text not null,
  robot_type text not null check (robot_type in ('AUTONOMOUS_WIRELESS')),
  payment_method public.payment_method_enum not null,
  payment_status public.payment_status_enum not null default 'PENDING',
  amount numeric(10,2) not null default 200.00,
  razorpay_payment_id text,
  registered_at timestamptz not null default now(),
  payment_received_at timestamptz,
  payment_received_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_registrations_registration_id on public.registrations(registration_id);
create index if not exists idx_registrations_team_name on public.registrations(team_name);
create index if not exists idx_registrations_leader_phone on public.registrations(leader_phone);
create index if not exists idx_registrations_payment_status on public.registrations(payment_status);
create index if not exists idx_registrations_college on public.registrations(college);

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.set_registration_id()
returns trigger as $$
declare
  next_num integer;
begin
  if new.registration_id is null or new.registration_id = '' then
    select coalesce(max(cast(substr(registration_id, 7)::int)), 0) + 1
    into next_num
    from public.registrations
    where registration_id ~ '^RBR26-[0-9]+$';

    new.registration_id := format('RBR26-%03s', next_num);
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at();

create trigger trg_event_settings_updated_at
before update on public.event_settings
for each row execute function public.update_updated_at();

create trigger trg_registrations_updated_at
before update on public.registrations
for each row execute function public.update_updated_at();

create trigger trg_set_registration_id
before insert on public.registrations
for each row execute function public.set_registration_id();

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select is_admin
    from public.profiles
    where id = auth.uid()
    limit 1
  ), false);
$$;

alter table public.profiles enable row level security;
alter table public.event_settings enable row level security;
alter table public.registrations enable row level security;

create policy "Users can read their own profile"
  on public.profiles
  for select
  using (id = auth.uid());

create policy "Admins can manage profiles"
  on public.profiles
  for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Public can read event settings"
  on public.event_settings
  for select
  using (true);

create policy "Admins can update event settings"
  on public.event_settings
  for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Anyone can insert registrations"
  on public.registrations
  for insert
  with check (true);

create policy "Admins can read all registrations"
  on public.registrations
  for select
  using (public.is_admin_user());

create policy "Admins can update registrations"
  on public.registrations
  for update
  using (public.is_admin_user())
  with check (public.is_admin_user());

create policy "Admins can delete registrations"
  on public.registrations
  for delete
  using (public.is_admin_user());

create table if not exists public.registration_audit (
  id bigint generated always as identity primary key,
  registration_id text not null,
  action text not null,
  performed_by text,
  action_data jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create trigger trg_registration_audit
after insert or update on public.registrations
for each row
execute function public.log_registration_event();

create or replace function public.log_registration_event()
returns trigger as $$
begin
  insert into public.registration_audit (registration_id, action, performed_by, action_data)
  values (
    new.registration_id,
    tg_op,
    coalesce(current_setting('request.jwt.claims', true), null),
    jsonb_build_object(
      'payment_status', new.payment_status,
      'payment_method', new.payment_method,
      'amount', new.amount,
      'razorpay_payment_id', new.razorpay_payment_id
    )
  );

  return new;
end;
$$ language plpgsql;

create policy "Admins can read audit logs"
  on public.registration_audit
  for select
  using (public.is_admin_user());

insert into public.event_settings (
  event_name,
  event_date,
  registration_fee,
  prize_1,
  prize_2,
  prize_3,
  venue,
  contact_email,
  contact_phone,
  rules,
  registration_open
) values (
  'STATE LEVEL ROBO RACE 2026',
  '2026-11-21',
  200.00,
  10000.00,
  5000.00,
  3000.00,
  'To be announced',
  'info@roborace.example',
  '+91 00000 00000',
  '[
    {"title": "Autonomous robots only", "detail": "Only autonomous robots are allowed."},
    {"title": "Wireless communication only", "detail": "Only wireless control and communication are allowed."},
    {"title": "No wired robots", "detail": "Wired or corded robots are strictly not allowed."},
    {"title": "Team size", "detail": "Each team must contain 1 to 2 participants."},
    {"title": "Fee", "detail": "The registration fee is ₹200 per team."},
    {"title": "Qualification", "detail": "Top 50% of teams qualify from Round 1."},
    {"title": "Final round", "detail": "Qualified teams compete in the final round as per judgment criteria."},
    {"title": "Instructions", "detail": "Participants must follow organizer instructions and decisions."}
  ]'::jsonb,
  true
) on conflict do nothing;
