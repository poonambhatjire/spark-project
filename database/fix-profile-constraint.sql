-- =============================================
-- FIX PROFILE CHECK CONSTRAINT
-- Drops and updates the old professional_title check constraint
-- =============================================
-- 
-- This fixes the error: "new row for relation 'profiles' violates 
-- check constraint 'profiles_professional_title_check'"
--
-- The constraint was created for the old column name and values.
-- After renaming the column to 'title', the constraint still exists
-- but may be checking for incompatible values.
-- =============================================

-- =============================================
-- STEP 1: DROP OLD CONSTRAINT (if exists)
-- =============================================

-- Drop the old constraint that references professional_title
DO $$ 
BEGIN
    -- Try to drop if it exists
    IF EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'profiles_professional_title_check'
    ) THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_professional_title_check;
        RAISE NOTICE 'Dropped old constraint: profiles_professional_title_check';
    ELSE
        RAISE NOTICE 'Constraint profiles_professional_title_check does not exist';
    END IF;
END $$;

-- Also check for any other constraints that might reference the old column name
DO $$ 
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find any remaining check constraints on the title column
    FOR constraint_name IN
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'profiles'::regclass
        AND contype = 'c'
        AND conname LIKE '%professional_title%'
    LOOP
        EXECUTE format('ALTER TABLE profiles DROP CONSTRAINT %I', constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- =============================================
-- STEP 2: OPTIONAL - CREATE NEW CONSTRAINT
-- =============================================
-- Since we now allow "Other, please specify" with custom text,
-- we don't need a strict CHECK constraint. However, if you want
-- to enforce the standard options, uncomment the following:

-- CREATE CONSTRAINT profiles_title_check ON profiles (
--     title IN (
--         'Infectious Disease Physician',
--         'Clinical Pharmacist',
--         'Microbiologist',
--         'Infection Prevention Specialist',
--         'Hospital administrator'
--     )
--     OR (title = 'Other, please specify' AND title_other IS NOT NULL)
-- );

-- Note: We're NOT creating a strict constraint because:
-- 1. Users can select "Other, please specify" and enter custom text
-- 2. The application handles validation
-- 3. This provides more flexibility

-- =============================================
-- STEP 3: VERIFICATION
-- =============================================

-- Check if the old constraint still exists
SELECT 
    'Constraint Check' as status,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM pg_constraint 
            WHERE conname = 'profiles_professional_title_check'
        )
        THEN '❌ Old constraint still exists'
        ELSE '✅ Old constraint removed'
    END as constraint_status;

-- List all constraints on the profiles table
SELECT 
    'All Constraints on Profiles Table' as status,
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass
ORDER BY conname;

-- =============================================
-- FIX COMPLETE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'PROFILE CONSTRAINT FIX COMPLETED';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '1. Dropped old profiles_professional_title_check constraint';
    RAISE NOTICE '2. Removed any remaining constraints referencing professional_title';
    RAISE NOTICE '';
    RAISE NOTICE 'The title column is now free-form to allow:';
    RAISE NOTICE '- Standard options from the form';
    RAISE NOTICE '- Custom text via "Other, please specify"';
    RAISE NOTICE '';
    RAISE NOTICE 'Application-level validation handles the restrictions.';
    RAISE NOTICE '=============================================';
END $$;

