-- =============================================
-- COMPLETE CLEANUP SCRIPT
-- Removes all sample data and resets RLS policies
-- =============================================

-- WARNING: This script will permanently delete all sample data
-- and reset RLS policies to a clean state

-- =============================================
-- STEP 1: DROP ALL RLS POLICIES
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
DROP POLICY IF EXISTS "Users can view own contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Users can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can insert contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow all contact submissions access" ON contact_submissions;

-- =============================================
-- STEP 2: REMOVE SAMPLE DATA
-- =============================================

-- Remove sample time entries
DELETE FROM time_entries 
WHERE user_id IN (
    SELECT id FROM profiles WHERE email LIKE '%@sample-test.com'
);

-- Remove sample contact submissions
DELETE FROM contact_submissions 
WHERE email LIKE '%@sample-test.com';

-- Remove sample profiles
DELETE FROM profiles 
WHERE email LIKE '%@sample-test.com';

-- Remove sample auth.users entries
DELETE FROM auth.users 
WHERE email LIKE '%@sample-test.com';

-- =============================================
-- STEP 3: CREATE CLEAN RLS POLICIES
-- =============================================

-- Basic policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Basic policies for time_entries table
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
-- STEP 4: VERIFICATION
-- =============================================

-- Check remaining profiles
SELECT 
    'REMAINING_PROFILES' as info,
    COUNT(*) as count
FROM profiles;

-- Check remaining time entries
SELECT 
    'REMAINING_TIME_ENTRIES' as info,
    COUNT(*) as count
FROM time_entries;

-- Check remaining contact submissions
SELECT 
    'REMAINING_CONTACT_SUBMISSIONS' as info,
    COUNT(*) as count
FROM contact_submissions;

-- Check remaining auth users
SELECT 
    'REMAINING_AUTH_USERS' as info,
    COUNT(*) as count
FROM auth.users;

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

-- =============================================
-- STEP 5: DISPLAY CLEANUP SUMMARY
-- =============================================

SELECT 
    'CLEANUP_COMPLETE' as status,
    'All sample data removed and RLS policies reset to clean state' as message;
