-- Paste ALL of this into Supabase > SQL Editor > Run
create extension if not exists pgcrypto;
create sequence if not exists reg_seq;
create table public.registrations(
 id uuid primary key default gen_random_uuid(),
 registration_id text unique not null default ('RBR26-'||lpad(nextval('reg_seq')::text,3,'0')),
 team_name text not null check(length(trim(team_name)) between 2 and 80),
 leader_name text not null, leader_phone text not null check(leader_phone ~ '^[6-9][0-9]{9}$'),
 leader_email text not null check(leader_email ~* '^\S+@\S+\.\S+$'),
 college text not null, city text not null,
 member2_name text, member2_phone text check(member2_phone is null or member2_phone ~ '^[6-9][0-9]{9}$'),
 member2_email text check(member2_email is null or member2_email ~* '^\S+@\S+\.\S+$'),
 robot_name text not null,
 robot_type text not null default 'AUTONOMOUS_WIRELESS' check(robot_type='AUTONOMOUS_WIRELESS'),
 payment_method text not null check(payment_method in('ONLINE','EVENT_DAY')),
 payment_status text not null default 'PENDING' check(payment_status in('PAID','PENDING','FAILED')),
 amount int not null default 200 check(amount=200),
 amount_collected int, razorpay_order_id text, razorpay_payment_id text unique,
 registered_at timestamptz not null default now(),
 payment_received_at timestamptz, payment_received_by text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check((member2_name is null)=(member2_phone is null) and (member2_phone is null)=(member2_email is null)));
create unique index on public.registrations(lower(team_name));
create unique index on public.registrations(leader_phone);
create index on public.registrations(registration_id);create index on public.registrations(team_name);
create index on public.registrations(payment_status);create index on public.registrations(college);
create or replace function touch() returns trigger language plpgsql as $$begin new.updated_at=now();return new;end$$;
create trigger t_touch before update on public.registrations for each row execute function touch();

create table public.settings(key text primary key,value text not null);
insert into public.settings values('registration_open','true');
create table public.admins(user_id uuid primary key references auth.users on delete cascade);

alter table public.registrations enable row level security;
alter table public.settings enable row level security;
alter table public.admins enable row level security;
create policy "admin read" on public.registrations for select to authenticated using(exists(select 1 from public.admins where user_id=auth.uid()));
create policy "admin update" on public.registrations for update to authenticated using(exists(select 1 from public.admins where user_id=auth.uid()));
create policy "public read settings" on public.settings for select using(true);
create policy "admin write settings" on public.settings for update to authenticated using(exists(select 1 from public.admins where user_id=auth.uid()));
create policy "own admin row" on public.admins for select to authenticated using(user_id=auth.uid());
-- No anon insert policy: public sign-ups go only through the function below (event-day) or the server API (online).

create or replace function public.register_event_day(p jsonb) returns text
language plpgsql security definer set search_path=public as $$
declare rid text;
begin
 if coalesce((select value from settings where key='registration_open'),'false')<>'true' then raise exception 'REGISTRATION_CLOSED'; end if;
 insert into registrations(team_name,leader_name,leader_phone,leader_email,college,city,member2_name,member2_phone,member2_email,robot_name,payment_method,payment_status)
 values(trim(p->>'team_name'),p->>'leader_name',p->>'leader_phone',p->>'leader_email',p->>'college',p->>'city',p->>'member2_name',p->>'member2_phone',p->>'member2_email',p->>'robot_name','EVENT_DAY','PENDING')
 returning registration_id into rid;
 return rid;
end$$;
grant execute on function public.register_event_day(jsonb) to anon,authenticated;
-- After creating your admin user (Auth > Users), run:
-- insert into public.admins select id from auth.users where email='YOUR_ADMIN_EMAIL';
