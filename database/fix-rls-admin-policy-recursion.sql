-- Fix infinite recursion in RLS policies that query profiles from inside
-- profiles/time_entries/etc policies. Use SECURITY DEFINER is_admin() instead.

BEGIN;

-- Ensure helper exists and is locked down
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin());

-- time_entries
DROP POLICY IF EXISTS "Admins can view all time entries" ON public.time_entries;
CREATE POLICY "Admins can view all time entries"
  ON public.time_entries
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all time entries" ON public.time_entries;
CREATE POLICY "Admins can update all time entries"
  ON public.time_entries
  FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete all time entries" ON public.time_entries;
CREATE POLICY "Admins can delete all time entries"
  ON public.time_entries
  FOR DELETE
  USING (public.is_admin());

-- contact_submissions
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  USING (public.is_admin());

-- admin_activities
DROP POLICY IF EXISTS "Admins can view admin activities" ON public.admin_activities;
CREATE POLICY "Admins can view admin activities"
  ON public.admin_activities
  FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert admin activities" ON public.admin_activities;
CREATE POLICY "Admins can insert admin activities"
  ON public.admin_activities
  FOR INSERT
  WITH CHECK (public.is_admin());

-- telemetry_events
DROP POLICY IF EXISTS "Admins can view all telemetry" ON public.telemetry_events;
CREATE POLICY "Admins can view all telemetry"
  ON public.telemetry_events
  FOR SELECT
  USING (public.is_admin());

COMMIT;
