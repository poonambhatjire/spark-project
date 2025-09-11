-- =============================================
-- FIX USER PROFILE CREATION ISSUES
-- Creates automatic profile creation trigger and fixes admin access
-- =============================================

-- =============================================
-- STEP 1: CREATE AUTOMATIC PROFILE CREATION TRIGGER
-- =============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, is_active, created_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'user',
    true,
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================
-- STEP 2: CREATE PROFILES FOR EXISTING USERS WITHOUT PROFILES
-- =============================================

-- Insert profiles for existing auth.users who don't have profiles
INSERT INTO public.profiles (id, email, name, role, is_active, created_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
  'user' as role,
  true as is_active,
  au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
  AND au.email IS NOT NULL
  AND au.email NOT LIKE '%@sample-test.com'; -- Exclude sample users

-- =============================================
-- STEP 3: UPDATE ADMIN ACCESS POLICIES
-- =============================================

-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all time entries" ON time_entries;
DROP POLICY IF EXISTS "Admins can update all time entries" ON time_entries;
DROP POLICY IF EXISTS "Admins can delete all time entries" ON time_entries;

-- Create admin policies for profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Create admin policies for time_entries
CREATE POLICY "Admins can view all time entries" ON time_entries
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update all time entries" ON time_entries
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can delete all time entries" ON time_entries
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- =============================================
-- STEP 4: VERIFICATION QUERIES
-- =============================================

-- Check users without profiles
SELECT 
    'USERS_WITHOUT_PROFILES' as info,
    COUNT(*) as count
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
  AND au.email IS NOT NULL
  AND au.email NOT LIKE '%@sample-test.com';

-- Check total profiles
SELECT 
    'TOTAL_PROFILES' as info,
    COUNT(*) as count
FROM public.profiles;

-- Check admin users
SELECT 
    'ADMIN_USERS' as info,
    COUNT(*) as count
FROM public.profiles
WHERE role IN ('admin', 'super_admin');

-- Check regular users
SELECT 
    'REGULAR_USERS' as info,
    COUNT(*) as count
FROM public.profiles
WHERE role = 'user';

-- =============================================
-- STEP 5: SUCCESS MESSAGE
-- =============================================

SELECT 
    'FIX_COMPLETE' as status,
    'Automatic profile creation trigger created and existing users fixed' as message;
