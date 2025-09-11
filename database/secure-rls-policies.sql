-- =============================================
-- SECURE RLS POLICIES - FIXES SECURITY ISSUES
-- Ensures proper data isolation and admin access
-- =============================================

-- =============================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- =============================================

-- Drop all policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all profile access" ON profiles;

-- Drop all policies on time_entries table
DROP POLICY IF EXISTS "Users can view own time entries" ON time_entries;
DROP POLICY IF EXISTS "Users can insert own time entries" ON time_entries;
DROP POLICY IF EXISTS "Users can update own time entries" ON time_entries;
DROP POLICY IF EXISTS "Users can delete own time entries" ON time_entries;
DROP POLICY IF EXISTS "Admins can view all time entries" ON time_entries;
DROP POLICY IF EXISTS "Admins can update all time entries" ON time_entries;
DROP POLICY IF EXISTS "Admins can delete all time entries" ON time_entries;
DROP POLICY IF EXISTS "Allow all time entries access" ON time_entries;

-- Drop all policies on contact_submissions table
DROP POLICY IF EXISTS "Users can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Users can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow all contact submissions access" ON contact_submissions;

-- =============================================
-- STEP 2: CREATE SECURE USER POLICIES
-- =============================================

-- Basic user policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Basic user policies for time_entries table
CREATE POLICY "Users can view own time entries" ON time_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own time entries" ON time_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own time entries" ON time_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own time entries" ON time_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Basic policies for contact_submissions table
CREATE POLICY "Users can view all contact submissions" ON contact_submissions
    FOR SELECT
    USING (true);

CREATE POLICY "Users can insert contact submissions" ON contact_submissions
    FOR INSERT
    WITH CHECK (true);

-- =============================================
-- STEP 3: CREATE SECURE ADMIN POLICIES
-- =============================================

-- Admin policies for profiles table (using service role bypass)
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT
    USING (
        -- Check if current user is admin by looking up their role
        EXISTS (
            SELECT 1 FROM profiles admin_profile
            WHERE admin_profile.id = auth.uid() 
            AND admin_profile.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles admin_profile
            WHERE admin_profile.id = auth.uid() 
            AND admin_profile.role IN ('admin', 'super_admin')
        )
    );

-- Admin policies for time_entries table
CREATE POLICY "Admins can view all time entries" ON time_entries
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles admin_profile
            WHERE admin_profile.id = auth.uid() 
            AND admin_profile.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update all time entries" ON time_entries
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles admin_profile
            WHERE admin_profile.id = auth.uid() 
            AND admin_profile.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can delete all time entries" ON time_entries
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles admin_profile
            WHERE admin_profile.id = auth.uid() 
            AND admin_profile.role IN ('admin', 'super_admin')
        )
    );

-- =============================================
-- STEP 4: CREATE ADMIN HELPER FUNCTIONS
-- =============================================

-- Function to check if current user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all users for admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_all_users_for_admin()
RETURNS TABLE (
  id uuid,
  email text,
  name text,
  role text,
  is_active boolean,
  created_at timestamptz
) AS $$
BEGIN
  -- Only allow if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.name,
    p.role,
    p.is_active,
    p.created_at
  FROM profiles p
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user activity for admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_user_activity_for_admin(target_user_id uuid)
RETURNS TABLE (
  id uuid,
  task text,
  other_task text,
  minutes integer,
  occurred_on date,
  comment text,
  created_at timestamptz
) AS $$
BEGIN
  -- Only allow if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    te.id,
    te.task,
    te.other_task,
    te.minutes,
    te.occurred_on,
    te.comment,
    te.created_at
  FROM time_entries te
  WHERE te.user_id = target_user_id
    AND te.deleted_at IS NULL
  ORDER BY te.occurred_on DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get activity statistics for admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_activity_stats_for_admin()
RETURNS TABLE (
  id uuid,
  task text,
  minutes integer,
  occurred_on date,
  created_at timestamptz,
  user_name text,
  user_email text
) AS $$
BEGIN
  -- Only allow if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    te.id,
    te.task,
    te.minutes,
    te.occurred_on,
    te.created_at,
    p.name as user_name,
    p.email as user_email
  FROM time_entries te
  INNER JOIN profiles p ON te.user_id = p.id
  WHERE te.deleted_at IS NULL
  ORDER BY te.created_at DESC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- STEP 5: VERIFICATION
-- =============================================

-- Check current policies
SELECT 
    'CURRENT_POLICIES' as info,
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
    AND tablename IN ('profiles', 'time_entries', 'contact_submissions')
ORDER BY tablename, policyname;

-- Test admin function
SELECT 
    'ADMIN_FUNCTION_TEST' as info,
    public.is_admin() as is_current_user_admin;

-- =============================================
-- STEP 6: SUCCESS MESSAGE
-- =============================================

SELECT 
    'SECURE_POLICIES_COMPLETE' as status,
    'RLS policies updated with proper security and admin functions created' as message;
