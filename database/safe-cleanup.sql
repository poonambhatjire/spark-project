-- =============================================
-- SAFE CLEANUP SCRIPT - SAMPLE DATA ONLY
-- This script ONLY removes data with @sample-test.com emails
-- =============================================

-- WARNING: This script is designed to be safe and only removes sample data
-- It specifically targets emails ending with @sample-test.com

-- =============================================
-- STEP 1: PREVIEW WHAT WILL BE DELETED
-- =============================================

-- Show sample users that will be deleted
SELECT 
    'SAMPLE_USERS_TO_DELETE' as info,
    id,
    email,
    name,
    role
FROM profiles 
WHERE email LIKE '%@sample-test.com'
ORDER BY email;

-- Show sample time entries that will be deleted
SELECT 
    'SAMPLE_TIME_ENTRIES_TO_DELETE' as info,
    COUNT(*) as count
FROM time_entries te
JOIN profiles p ON te.user_id = p.id
WHERE p.email LIKE '%@sample-test.com';

-- Show sample contact submissions that will be deleted
SELECT 
    'SAMPLE_CONTACT_SUBMISSIONS_TO_DELETE' as info,
    COUNT(*) as count
FROM contact_submissions
WHERE email LIKE '%@sample-test.com';

-- Show sample auth users that will be deleted
SELECT 
    'SAMPLE_AUTH_USERS_TO_DELETE' as info,
    id,
    email,
    created_at
FROM auth.users
WHERE email LIKE '%@sample-test.com'
ORDER BY email;

-- =============================================
-- STEP 2: SAFE DELETION (ONLY SAMPLE DATA)
-- =============================================

-- Remove sample time entries (ONLY those belonging to sample users)
DELETE FROM time_entries 
WHERE user_id IN (
    SELECT id FROM profiles WHERE email LIKE '%@sample-test.com'
);

-- Remove sample contact submissions (ONLY those with sample emails)
DELETE FROM contact_submissions 
WHERE email LIKE '%@sample-test.com';

-- Remove sample profiles (ONLY those with sample emails)
DELETE FROM profiles 
WHERE email LIKE '%@sample-test.com';

-- Remove sample auth.users entries (ONLY those with sample emails)
DELETE FROM auth.users 
WHERE email LIKE '%@sample-test.com';

-- =============================================
-- STEP 3: VERIFICATION
-- =============================================

-- Verify no sample data remains
SELECT 
    'REMAINING_SAMPLE_PROFILES' as info,
    COUNT(*) as count
FROM profiles 
WHERE email LIKE '%@sample-test.com';

SELECT 
    'REMAINING_SAMPLE_TIME_ENTRIES' as info,
    COUNT(*) as count
FROM time_entries te
JOIN profiles p ON te.user_id = p.id
WHERE p.email LIKE '%@sample-test.com';

SELECT 
    'REMAINING_SAMPLE_CONTACT_SUBMISSIONS' as info,
    COUNT(*) as count
FROM contact_submissions
WHERE email LIKE '%@sample-test.com';

SELECT 
    'REMAINING_SAMPLE_AUTH_USERS' as info,
    COUNT(*) as count
FROM auth.users
WHERE email LIKE '%@sample-test.com';

-- Show remaining real users (should be preserved)
SELECT 
    'REMAINING_REAL_USERS' as info,
    COUNT(*) as count
FROM profiles 
WHERE email NOT LIKE '%@sample-test.com';

SELECT 
    'REMAINING_REAL_TIME_ENTRIES' as info,
    COUNT(*) as count
FROM time_entries te
JOIN profiles p ON te.user_id = p.id
WHERE p.email NOT LIKE '%@sample-test.com';

SELECT 
    'REMAINING_REAL_CONTACT_SUBMISSIONS' as info,
    COUNT(*) as count
FROM contact_submissions
WHERE email NOT LIKE '%@sample-test.com';

-- =============================================
-- STEP 4: SUCCESS MESSAGE
-- =============================================

SELECT 
    'CLEANUP_COMPLETE' as status,
    'Only sample data (@sample-test.com) has been removed. Real user data preserved.' as message;
