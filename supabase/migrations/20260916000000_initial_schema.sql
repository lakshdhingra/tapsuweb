-- TASPU Initial Schema

-- Extensions
create extension if not exists "uuid-ossp";

-- ENUMS
create type application_status as enum ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');
create type member_status as enum ('ACTIVE', 'SUSPENDED', 'INACTIVE');
create type admin_role as enum ('ADMIN', 'SUPER_ADMIN');
create type content_status as enum ('DRAFT', 'PUBLISHED', 'ARCHIVED');
create type announcement_priority as enum ('NORMAL', 'IMPORTANT', 'URGENT');
create type resource_visibility as enum ('PUBLIC', 'ADMIN_ONLY');

-- 1. Site Settings (Singleton)
create table public.site_settings (
  id integer primary key default 1,
  membership_id_prefix text not null default 'TASPU',
  membership_id_year text not null default '2026',
  app_id_prefix text not null default 'TASPU-APP',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint one_row_only check (id = 1)
);

-- 2. Admins
create table public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role admin_role not null default 'ADMIN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sequences for IDs
create sequence application_number_seq start 1;
create sequence membership_id_seq start 1;

-- 3. Membership Applications
create table public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  application_number text not null unique,
  full_name text not null,
  email text not null,
  phone text not null,
  business_name text not null,
  designation text not null,
  years_experience integer not null,
  professional_category text not null,
  district text not null,
  city text not null,
  address text not null,
  reason_for_joining text,
  additional_info text,
  status application_status not null default 'PENDING',
  rejection_reason text,
  admin_notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.admins(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Unique index to prevent duplicate pending applications
create unique index idx_unique_pending_app_email on public.membership_applications (email) where status != 'REJECTED';
create unique index idx_unique_pending_app_phone on public.membership_applications (phone) where status != 'REJECTED';

-- 4. Members
create table public.members (
  id uuid primary key default gen_random_uuid(),
  membership_id text not null unique,
  application_id uuid unique references public.membership_applications(id),
  full_name text not null,
  business_name text not null,
  district text not null,
  city text not null,
  phone text not null,
  email text not null,
  category text not null,
  membership_date timestamptz not null default now(),
  status member_status not null default 'ACTIVE',
  public_visibility boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Audit Logs
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admins(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- 6. News Articles
create table public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  author text,
  content text not null,
  cover_image text,
  status content_status not null default 'DRAFT',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. Announcements
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  priority announcement_priority not null default 'NORMAL',
  status content_status not null default 'DRAFT',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. Resources
create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  description text,
  file_path text not null,
  file_type text not null,
  file_size text not null,
  year text,
  visibility resource_visibility not null default 'PUBLIC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. Media Albums
create table public.media_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_image text,
  status content_status not null default 'DRAFT',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. Media Items
create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.media_albums(id) on delete cascade,
  title text,
  type text not null check (type in ('image', 'video')),
  file_path text,
  url text,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

-- 11. Contact Messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 12. Leadership
create table public.leadership (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  image_path text,
  sort_order integer default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- FUNCTION: Approve Membership Application
create or replace function public.approve_membership_application(p_app_id uuid, p_admin_id uuid)
returns json language plpgsql security definer as $$
declare
  v_app public.membership_applications%ROWTYPE;
  v_prefix text;
  v_year text;
  v_seq_val bigint;
  v_membership_id text;
  v_member_id uuid;
begin
  -- Lock row and check status
  select * into v_app from public.membership_applications where id = p_app_id for update;
  if not found then
    raise exception 'Application not found';
  end if;
  if v_app.status = 'APPROVED' then
    raise exception 'Application is already approved';
  end if;

  -- Get settings
  select membership_id_prefix, membership_id_year into v_prefix, v_year from public.site_settings where id = 1;
  if v_prefix is null then v_prefix := 'TASPU'; end if;
  if v_year is null then v_year := to_char(current_date, 'YYYY'); end if;

  -- Generate membership ID
  v_seq_val := nextval('membership_id_seq');
  v_membership_id := v_prefix || '-' || v_year || '-' || lpad(v_seq_val::text, 5, '0');

  -- Update application
  update public.membership_applications 
  set status = 'APPROVED', reviewed_at = now(), reviewed_by = p_admin_id, updated_at = now()
  where id = p_app_id;

  -- Create member
  insert into public.members (
    membership_id, application_id, full_name, business_name, district, city, phone, email, category
  ) values (
    v_membership_id, p_app_id, v_app.full_name, v_app.business_name, v_app.district, v_app.city, v_app.phone, v_app.email, v_app.professional_category
  ) returning id into v_member_id;

  -- Audit log
  insert into public.audit_logs (admin_id, action, entity_type, entity_id, metadata)
  values (p_admin_id, 'APPROVE_APPLICATION', 'membership_applications', p_app_id::text, jsonb_build_object('membership_id', v_membership_id, 'member_id', v_member_id));

  return json_build_object('success', true, 'membership_id', v_membership_id, 'member_id', v_member_id);
end;
$$;


-- TRIGGER: auto-generate application_number before insert
create or replace function public.set_application_number()
returns trigger language plpgsql as $$
declare
  v_prefix text;
  v_seq_val bigint;
begin
  select app_id_prefix into v_prefix from public.site_settings where id = 1;
  if v_prefix is null then v_prefix := 'TASPU-APP'; end if;
  
  v_seq_val := nextval('application_number_seq');
  NEW.application_number := v_prefix || '-' || lpad(v_seq_val::text, 5, '0');
  
  return NEW;
end;
$$;

create trigger tr_set_application_number
  before insert on public.membership_applications
  for each row
  when (NEW.application_number is null)
  execute function public.set_application_number();


-- RLS Setup (Default Deny)
alter table public.site_settings enable row level security;
alter table public.admins enable row level security;
alter table public.membership_applications enable row level security;
alter table public.members enable row level security;
alter table public.audit_logs enable row level security;
alter table public.news_articles enable row level security;
alter table public.announcements enable row level security;
alter table public.resources enable row level security;
alter table public.media_albums enable row level security;
alter table public.media_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.leadership enable row level security;

-- RLS Helper
create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

create or replace function public.is_super_admin()
returns boolean language sql security definer as $$
  select exists (select 1 from public.admins where id = auth.uid() and role = 'SUPER_ADMIN');
$$;

-- RLS Policies - Admins (Full access to all tables)
create policy "Admins can do everything on site_settings" on public.site_settings to authenticated using (public.is_admin());
create policy "SuperAdmins can do everything on admins" on public.admins to authenticated using (public.is_super_admin());
create policy "Admins can read admins" on public.admins for select to authenticated using (public.is_admin());
create policy "Admins can do everything on applications" on public.membership_applications to authenticated using (public.is_admin());
create policy "Admins can do everything on members" on public.members to authenticated using (public.is_admin());
create policy "Admins can do everything on audit_logs" on public.audit_logs to authenticated using (public.is_admin());
create policy "Admins can do everything on news" on public.news_articles to authenticated using (public.is_admin());
create policy "Admins can do everything on announcements" on public.announcements to authenticated using (public.is_admin());
create policy "Admins can do everything on resources" on public.resources to authenticated using (public.is_admin());
create policy "Admins can do everything on media_albums" on public.media_albums to authenticated using (public.is_admin());
create policy "Admins can do everything on media_items" on public.media_items to authenticated using (public.is_admin());
create policy "Admins can do everything on contact_messages" on public.contact_messages to authenticated using (public.is_admin());
create policy "Admins can do everything on leadership" on public.leadership to authenticated using (public.is_admin());

-- RLS Policies - Public
create policy "Public can read site_settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Public can read published news" on public.news_articles for select to anon, authenticated using (status = 'PUBLISHED');
create policy "Public can read published announcements" on public.announcements for select to anon, authenticated using (status = 'PUBLISHED');
create policy "Public can read public resources" on public.resources for select to anon, authenticated using (visibility = 'PUBLIC');
create policy "Public can read published media albums" on public.media_albums for select to anon, authenticated using (status = 'PUBLISHED');
create policy "Public can read published media items" on public.media_items for select to anon, authenticated using (
  exists (select 1 from public.media_albums a where a.id = album_id and a.status = 'PUBLISHED')
);
create policy "Public can read active leadership" on public.leadership for select to anon, authenticated using (is_active = true);
create policy "Public can insert membership_applications" on public.membership_applications for insert to anon, authenticated with check (status = 'PENDING');
create policy "Public can insert contact_messages" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "Public can read public members" on public.members for select to anon, authenticated using (public_visibility = true);
