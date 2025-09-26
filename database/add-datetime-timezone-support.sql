-- =============================================
-- DATETIME & TIMEZONE SUPPORT MIGRATION
-- Adds time support and timezone management to time entries
-- =============================================

-- =============================================
-- STEP 1: ADD TIMEZONE FIELDS TO USER PROFILES
-- =============================================

-- Add timezone and format preferences to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
ADD COLUMN IF NOT EXISTS time_format VARCHAR(10) DEFAULT '12h';

-- Update existing profiles with default timezone (UTC)
UPDATE profiles 
SET timezone = 'UTC' 
WHERE timezone IS NULL;

-- =============================================
-- STEP 2: MIGRATE TIME_ENTRIES TO SUPPORT DATETIME
-- =============================================

-- First, add a new column for the migration
ALTER TABLE time_entries 
ADD COLUMN IF NOT EXISTS occurred_on_new timestamp with time zone;

-- Migrate existing date-only data to datetime (set to 00:00:00 UTC)
-- This preserves the original date while adding time support
UPDATE time_entries 
SET occurred_on_new = (occurred_on::date || ' 00:00:00 UTC')::timestamp with time zone
WHERE occurred_on_new IS NULL;

-- Verify the migration worked correctly
DO $$
DECLARE
    original_count INTEGER;
    migrated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO original_count FROM time_entries WHERE occurred_on IS NOT NULL;
    SELECT COUNT(*) INTO migrated_count FROM time_entries WHERE occurred_on_new IS NOT NULL;
    
    IF original_count != migrated_count THEN
        RAISE EXCEPTION 'Migration failed: Count mismatch. Original: %, Migrated: %', original_count, migrated_count;
    END IF;
    
    RAISE NOTICE 'Migration successful: % entries migrated', migrated_count;
END $$;

-- =============================================
-- STEP 3: REPLACE OLD COLUMN WITH NEW ONE
-- =============================================

-- Drop the old date column
ALTER TABLE time_entries DROP COLUMN occurred_on;

-- Rename the new column to the original name
ALTER TABLE time_entries RENAME COLUMN occurred_on_new TO occurred_on;

-- Make occurred_on NOT NULL (it should already be, but let's be explicit)
ALTER TABLE time_entries ALTER COLUMN occurred_on SET NOT NULL;

-- =============================================
-- STEP 4: ADD INDEXES FOR PERFORMANCE
-- =============================================

-- Add index on occurred_on for faster date range queries
CREATE INDEX IF NOT EXISTS idx_time_entries_occurred_on 
ON time_entries (occurred_on);

-- Add composite index for user-specific date queries
CREATE INDEX IF NOT EXISTS idx_time_entries_user_occurred_on 
ON time_entries (user_id, occurred_on);

-- =============================================
-- STEP 5: UPDATE RLS POLICIES (if needed)
-- =============================================

-- The existing RLS policies should still work since we're just changing the data type
-- But let's verify the policies are still in place
DO $$
BEGIN
    -- Check if RLS is enabled
    IF NOT EXISTS (
        SELECT 1 FROM pg_class 
        WHERE relname = 'time_entries' AND relrowsecurity = true
    ) THEN
        RAISE NOTICE 'RLS is not enabled on time_entries table';
    ELSE
        RAISE NOTICE 'RLS is enabled on time_entries table';
    END IF;
END $$;

-- =============================================
-- STEP 6: VERIFICATION QUERIES
-- =============================================

-- Verify the migration worked correctly
SELECT 
    'Migration Verification' as status,
    COUNT(*) as total_entries,
    MIN(occurred_on) as earliest_entry,
    MAX(occurred_on) as latest_entry,
    COUNT(DISTINCT DATE(occurred_on)) as unique_dates
FROM time_entries;

-- Verify timezone fields were added to profiles
SELECT 
    'Profile Timezone Fields' as status,
    COUNT(*) as total_profiles,
    COUNT(timezone) as profiles_with_timezone,
    COUNT(date_format) as profiles_with_date_format,
    COUNT(time_format) as profiles_with_time_format
FROM profiles;

-- Show sample of migrated data
SELECT 
    'Sample Migrated Data' as status,
    id,
    task,
    occurred_on,
    created_at
FROM time_entries 
ORDER BY occurred_on DESC 
LIMIT 5;

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- Migration logging (commented out to avoid schema_migrations dependency)
-- Note: This migration adds datetime and timezone support to time_entries and profiles tables
-- Date: 2025-09-25
-- Status: Completed successfully

-- Success message
DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'DATETIME & TIMEZONE MIGRATION COMPLETED';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '1. Added timezone, date_format, time_format to profiles';
    RAISE NOTICE '2. Migrated occurred_on from date to timestamp with time zone';
    RAISE NOTICE '3. Existing entries set to 00:00:00 UTC';
    RAISE NOTICE '4. Added performance indexes';
    RAISE NOTICE '=============================================';
END $$;
