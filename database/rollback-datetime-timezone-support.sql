-- =============================================
-- ROLLBACK: DATETIME & TIMEZONE SUPPORT
-- Reverts the datetime and timezone changes
-- =============================================

-- =============================================
-- STEP 1: ROLLBACK TIME_ENTRIES TO DATE ONLY
-- =============================================

-- Add a temporary column for the rollback
ALTER TABLE time_entries 
ADD COLUMN IF NOT EXISTS occurred_on_date_backup date;

-- Convert datetime back to date (extract date part only)
UPDATE time_entries 
SET occurred_on_date_backup = occurred_on::date
WHERE occurred_on_date_backup IS NULL;

-- Verify the rollback conversion
DO $$
DECLARE
    datetime_count INTEGER;
    date_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO datetime_count FROM time_entries WHERE occurred_on IS NOT NULL;
    SELECT COUNT(*) INTO date_count FROM time_entries WHERE occurred_on_date_backup IS NOT NULL;
    
    IF datetime_count != date_count THEN
        RAISE EXCEPTION 'Rollback failed: Count mismatch. Datetime: %, Date: %', datetime_count, date_count;
    END IF;
    
    RAISE NOTICE 'Rollback conversion successful: % entries converted', date_count;
END $$;

-- Drop the datetime column
ALTER TABLE time_entries DROP COLUMN occurred_on;

-- Rename the date column back
ALTER TABLE time_entries RENAME COLUMN occurred_on_date_backup TO occurred_on;

-- Make occurred_on NOT NULL
ALTER TABLE time_entries ALTER COLUMN occurred_on SET NOT NULL;

-- =============================================
-- STEP 2: REMOVE TIMEZONE FIELDS FROM PROFILES
-- =============================================

-- Remove timezone and format fields from profiles
ALTER TABLE profiles 
DROP COLUMN IF EXISTS timezone,
DROP COLUMN IF EXISTS date_format,
DROP COLUMN IF EXISTS time_format;

-- =============================================
-- STEP 3: REMOVE ADDED INDEXES
-- =============================================

-- Remove the indexes we added
DROP INDEX IF EXISTS idx_time_entries_occurred_on;
DROP INDEX IF EXISTS idx_time_entries_user_occurred_on;

-- =============================================
-- STEP 4: VERIFICATION
-- =============================================

-- Verify rollback worked correctly
SELECT 
    'Rollback Verification' as status,
    COUNT(*) as total_entries,
    MIN(occurred_on) as earliest_entry,
    MAX(occurred_on) as latest_entry,
    COUNT(DISTINCT occurred_on) as unique_dates
FROM time_entries;

-- Verify timezone fields were removed from profiles
SELECT 
    'Profile Fields Removed' as status,
    COUNT(*) as total_profiles
FROM profiles;

-- Show sample of rolled back data
SELECT 
    'Sample Rolled Back Data' as status,
    id,
    task,
    occurred_on,
    created_at
FROM time_entries 
ORDER BY occurred_on DESC 
LIMIT 5;

-- =============================================
-- ROLLBACK COMPLETE
-- =============================================

-- Success message
DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'DATETIME & TIMEZONE ROLLBACK COMPLETED';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Changes reverted:';
    RAISE NOTICE '1. Removed timezone fields from profiles';
    RAISE NOTICE '2. Rolled back occurred_on to date type';
    RAISE NOTICE '3. Removed performance indexes';
    RAISE NOTICE '4. Data preserved (time portion lost)';
    RAISE NOTICE '=============================================';
END $$;
