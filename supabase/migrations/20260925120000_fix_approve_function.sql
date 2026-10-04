-- Re-apply the approve_membership_application function with correct new schema fields.
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
  select * into v_app from public.membership_applications where id = p_app_id for update;
  if not found then raise exception 'Application not found'; end if;
  if v_app.status = 'APPROVED' then raise exception 'Application is already approved'; end if;
  select membership_id_prefix, membership_id_year into v_prefix, v_year from public.site_settings where id = 1;
  if v_prefix is null then v_prefix := 'TASPU'; end if;
  if v_year is null then v_year := to_char(current_date, 'YYYY'); end if;
  v_seq_val := nextval('membership_id_seq');
  v_membership_id := v_prefix || '-' || v_year || '-' || lpad(v_seq_val::text, 5, '0');
  update public.membership_applications set status = 'APPROVED', reviewed_at = now(), reviewed_by = p_admin_id, updated_at = now() where id = p_app_id;
  insert into public.members (membership_id, application_id, full_name, service_center_name, district, city, phone, email, full_address, brands_worked_with, gst_no)
  values (v_membership_id, p_app_id, v_app.full_name, v_app.service_center_name, v_app.district, v_app.city, v_app.phone, v_app.email, v_app.full_address, v_app.brands_worked_with, v_app.gst_no)
  returning id into v_member_id;
  insert into public.audit_logs (admin_id, action, entity_type, entity_id, metadata)
  values (p_admin_id, 'APPROVE_APPLICATION', 'membership_applications', p_app_id::text, jsonb_build_object('membership_id', v_membership_id, 'member_id', v_member_id));
  return json_build_object('success', true, 'membership_id', v_membership_id, 'member_id', v_member_id);
end;
$$;
