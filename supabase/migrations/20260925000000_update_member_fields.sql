-- Migration: Update member fields
-- Renaming business_name -> service_center_name
-- Dropping category
-- Adding full_address, brands_worked_with, gst_no

ALTER TABLE public.membership_applications
RENAME COLUMN business_name TO service_center_name;

ALTER TABLE public.membership_applications
DROP COLUMN professional_category;

ALTER TABLE public.membership_applications
ADD COLUMN full_address text NOT NULL DEFAULT '',
ADD COLUMN brands_worked_with text[] NOT NULL DEFAULT '{}',
ADD COLUMN gst_no text NOT NULL DEFAULT '';

ALTER TABLE public.members
RENAME COLUMN business_name TO service_center_name;

ALTER TABLE public.members
DROP COLUMN category;

ALTER TABLE public.members
ADD COLUMN full_address text NOT NULL DEFAULT '',
ADD COLUMN brands_worked_with text[] NOT NULL DEFAULT '{}',
ADD COLUMN gst_no text NOT NULL DEFAULT '';

-- Update the approve_membership_application function
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
    membership_id, application_id, full_name, service_center_name, district, city, phone, email, full_address, brands_worked_with, gst_no
  ) values (
    v_membership_id, p_app_id, v_app.full_name, v_app.service_center_name, v_app.district, v_app.city, v_app.phone, v_app.email, v_app.full_address, v_app.brands_worked_with, v_app.gst_no
  ) returning id into v_member_id;

  -- Audit log
  insert into public.audit_logs (admin_id, action, entity_type, entity_id, metadata)
  values (p_admin_id, 'APPROVE_APPLICATION', 'membership_applications', p_app_id::text, jsonb_build_object('membership_id', v_membership_id, 'member_id', v_member_id));

  return json_build_object('success', true, 'membership_id', v_membership_id, 'member_id', v_member_id);
end;
$$;
