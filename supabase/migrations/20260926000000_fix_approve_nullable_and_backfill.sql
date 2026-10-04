-- Fix approve_membership_application to accept nullable p_admin_id
CREATE OR REPLACE FUNCTION public.approve_membership_application(p_app_id uuid, p_admin_id uuid DEFAULT NULL)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_app public.membership_applications%ROWTYPE;
  v_prefix text;
  v_year text;
  v_seq_val bigint;
  v_membership_id text;
  v_member_id uuid;
BEGIN
  SELECT * INTO v_app FROM public.membership_applications WHERE id = p_app_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Application not found'; END IF;
  IF v_app.status = 'APPROVED' THEN RAISE EXCEPTION 'Application is already approved'; END IF;

  SELECT membership_id_prefix, membership_id_year INTO v_prefix, v_year FROM public.site_settings WHERE id = 1;
  IF v_prefix IS NULL THEN v_prefix := 'TASPU'; END IF;
  IF v_year IS NULL THEN v_year := to_char(current_date, 'YYYY'); END IF;

  v_seq_val := nextval('membership_id_seq');
  v_membership_id := v_prefix || '-' || v_year || '-' || lpad(v_seq_val::text, 5, '0');

  UPDATE public.membership_applications
  SET status = 'APPROVED', reviewed_at = now(), reviewed_by = p_admin_id, updated_at = now()
  WHERE id = p_app_id;

  INSERT INTO public.members (
    membership_id, application_id, full_name, service_center_name,
    district, city, phone, email, full_address, brands_worked_with, gst_no
  ) VALUES (
    v_membership_id, p_app_id, v_app.full_name, v_app.service_center_name,
    v_app.district, v_app.city, v_app.phone, v_app.email,
    v_app.full_address, v_app.brands_worked_with, v_app.gst_no
  ) RETURNING id INTO v_member_id;

  INSERT INTO public.audit_logs (admin_id, action, entity_type, entity_id, metadata)
  VALUES (p_admin_id, 'APPROVE_APPLICATION', 'membership_applications', p_app_id::text,
    jsonb_build_object('membership_id', v_membership_id, 'member_id', v_member_id));

  RETURN json_build_object('success', true, 'membership_id', v_membership_id, 'member_id', v_member_id);
END;
$$;

-- Backfill missing member rows for applications that were APPROVED but have no member record
DO $$
DECLARE
  v_app public.membership_applications%ROWTYPE;
  v_prefix text;
  v_year text;
  v_seq_val bigint;
  v_membership_id text;
  v_member_id uuid;
BEGIN
  SELECT membership_id_prefix, membership_id_year INTO v_prefix, v_year FROM public.site_settings WHERE id = 1;
  IF v_prefix IS NULL THEN v_prefix := 'TASPU'; END IF;
  IF v_year IS NULL THEN v_year := to_char(current_date, 'YYYY'); END IF;

  FOR v_app IN
    SELECT a.* FROM public.membership_applications a
    LEFT JOIN public.members m ON m.application_id = a.id
    WHERE a.status = 'APPROVED' AND m.id IS NULL
  LOOP
    v_seq_val := nextval('membership_id_seq');
    v_membership_id := v_prefix || '-' || v_year || '-' || lpad(v_seq_val::text, 5, '0');

    INSERT INTO public.members (
      membership_id, application_id, full_name, service_center_name,
      district, city, phone, email, full_address, brands_worked_with, gst_no
    ) VALUES (
      v_membership_id, v_app.id, v_app.full_name, v_app.service_center_name,
      v_app.district, v_app.city, v_app.phone, v_app.email,
      v_app.full_address, v_app.brands_worked_with, v_app.gst_no
    ) RETURNING id INTO v_member_id;

    RAISE NOTICE 'Backfilled member % for application %', v_membership_id, v_app.application_number;
  END LOOP;
END;
$$;