-- =============================================
-- PROFILE SIMPLIFICATION MIGRATION
-- Simplifies user profile by keeping only essential fields
-- =============================================
-- 
-- IMPORTANT: BACKUP YOUR DATABASE BEFORE RUNNING THIS!
-- 
-- This migration:
-- 1. Renames columns: professional_title → title, organization → institution, years_of_experience → experience_level
-- 2. Makes deprecated columns nullable (soft deprecation for safety)
-- 3. Does NOT drop columns initially (allows rollback)
--
-- After monitoring period (2-4 weeks), you can safely drop the deprecated columns.
-- =============================================

-- =============================================
-- STEP 1: BACKUP VERIFICATION
-- =============================================
-- Make sure you have backed up your database before proceeding!
-- Use Supabase dashboard backup feature or pg_dump

-- =============================================
-- STEP 2: RENAME COLUMNS TO NEW NAMES
-- =============================================

-- Rename professional_title to title
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'professional_title'
        AND column_name != 'title'
    ) THEN
        ALTER TABLE profiles RENAME COLUMN professional_title TO title;
        RAISE NOTICE 'Renamed professional_title to title';
    ELSE
        RAISE NOTICE 'Column professional_title does not exist or already renamed';
    END IF;
END $$;

-- Rename organization to institution
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'organization'
        AND column_name != 'institution'
    ) THEN
        ALTER TABLE profiles RENAME COLUMN organization TO institution;
        RAISE NOTICE 'Renamed organization to institution';
    ELSE
        RAISE NOTICE 'Column organization does not exist or already renamed';
    END IF;
END $$;

-- Rename years_of_experience to experience_level
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'years_of_experience'
        AND column_name != 'experience_level'
    ) THEN
        ALTER TABLE profiles RENAME COLUMN years_of_experience TO experience_level;
        RAISE NOTICE 'Renamed years_of_experience to experience_level';
    ELSE
        RAISE NOTICE 'Column years_of_experience does not exist or already renamed';
    END IF;
END $$;

-- =============================================
-- STEP 3: SOFT DEPRECATION - MAKE COLUMNS NULLABLE
-- =============================================
-- This allows old code to still work during transition
-- We'll drop columns after monitoring period

-- Make deprecated columns nullable
ALTER TABLE profiles 
    ALTER COLUMN phone_number DROP NOT NULL,
    ALTER COLUMN department DROP NOT NULL,
    ALTER COLUMN specialty DROP NOT NULL,
    ALTER COLUMN work_location DROP NOT NULL,
    ALTER COLUMN stewardship_role DROP NOT NULL,
    ALTER COLUMN manager DROP NOT NULL,
    ALTER COLUMN team DROP NOT NULL,
    ALTER COLUMN license_number DROP NOT NULL,
    ALTER COLUMN certification_status DROP NOT NULL,
    ALTER COLUMN time_zone DROP NOT NULL,
    ALTER COLUMN notes DROP NOT NULL;

-- =============================================
-- STEP 4: VERIFICATION
-- =============================================

-- Verify column renames
SELECT 
    'Column Rename Verification' as status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'title')
        THEN '✅ title column exists'
        ELSE '❌ title column missing'
    END as title_column,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'institution')
        THEN '✅ institution column exists'
        ELSE '❌ institution column missing'
    END as institution_column,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'experience_level')
        THEN '✅ experience_level column exists'
        ELSE '❌ experience_level column missing'
    END as experience_level_column;

-- Show sample data after migration
SELECT 
    'Sample Profile Data' as status,
    id,
    name,
    email,
    title,
    institution,
    experience_level,
    created_at
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- =============================================
-- STEP 5: FUTURE CLEANUP (AFTER MONITORING PERIOD)
-- =============================================
-- Run this after 2-4 weeks of monitoring to remove deprecated columns
-- 
-- ALTER TABLE profiles 
--     DROP COLUMN IF EXISTS phone_number,
--     DROP COLUMN IF EXISTS department,
--     DROP COLUMN IF EXISTS specialty,
--     DROP COLUMN IF EXISTS work_location,
--     DROP COLUMN IF EXISTS stewardship_role,
--     DROP COLUMN IF EXISTS manager,
--     DROP COLUMN IF EXISTS team,
--     DROP COLUMN IF EXISTS license_number,
--     DROP COLUMN IF EXISTS certification_status,
--     DROP COLUMN IF EXISTS time_zone,
--     DROP COLUMN IF EXISTS notes;
--
-- =============================================
-- MIGRATION COMPLETE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'PROFILE SIMPLIFICATION MIGRATION COMPLETED';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '1. Renamed professional_title to title';
    RAISE NOTICE '2. Renamed organization to institution';
    RAISE NOTICE '3. Renamed years_of_experience to experience_level';
    RAISE NOTICE '4. Made deprecated columns nullable';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '- Update application code to use new column names';
    RAISE NOTICE '- Test profile creation and updates';
    RAISE NOTICE '- Monitor for 2-4 weeks';
    RAISE NOTICE '- Then drop deprecated columns';
    RAISE NOTICE '=============================================';
END $$;

