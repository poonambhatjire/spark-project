-- =============================================
-- RESTORE FROM BACKUP
-- Use this script to restore data if migration fails
-- =============================================

-- =============================================
-- STEP 1: VERIFY BACKUP EXISTS
-- =============================================

DO $$
BEGIN
    -- Check all backup tables exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles_backup') THEN
        RAISE EXCEPTION 'profiles_backup table does not exist! Cannot restore.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'time_entries_backup') THEN
        RAISE EXCEPTION 'time_entries_backup table does not exist! Cannot restore.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activities_backup') THEN
        RAISE EXCEPTION 'admin_activities_backup table does not exist! Cannot restore.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_submissions_backup') THEN
        RAISE EXCEPTION 'contact_submissions_backup table does not exist! Cannot restore.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'telemetry_events_backup') THEN
        RAISE EXCEPTION 'telemetry_events_backup table does not exist! Cannot restore.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activity_summary_backup') THEN
        RAISE EXCEPTION 'activity_summary_backup table does not exist! Cannot restore.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_stats_backup') THEN
        RAISE EXCEPTION 'user_stats_backup table does not exist! Cannot restore.';
    END IF;
    
    RAISE NOTICE 'All backup tables found. Proceeding with restore...';
END $$;

-- =============================================
-- STEP 2: RESTORE PROFILES TABLE
-- =============================================

-- Clear existing profiles data
TRUNCATE TABLE profiles CASCADE;

-- Restore from backup (excluding backup metadata columns)
INSERT INTO profiles (
    id, created_at, updated_at, full_name, phone_number, 
    professional_title, institution, department, specialty, 
    years_of_experience, license_number, work_location, 
    stewardship_role, certification_status, time_zone, 
    manager, team, notes
    -- Add timezone fields if they exist
)
SELECT 
    id, created_at, updated_at, full_name, phone_number,
    professional_title, institution, department, specialty,
    years_of_experience, license_number, work_location,
    stewardship_role, certification_status, time_zone,
    manager, team, notes
    -- Exclude timezone fields if they don't exist in backup
FROM profiles_backup
WHERE backup_created_at IS NOT NULL;

-- =============================================
-- STEP 3: RESTORE TIME_ENTRIES TABLE
-- =============================================

-- Clear existing time_entries data
TRUNCATE TABLE time_entries CASCADE;

-- Restore from backup (excluding backup metadata columns)
INSERT INTO time_entries (
    id, user_id, task, other_task, minutes, 
    occurred_on, comment, created_at, updated_at, deleted_at
)
SELECT 
    id, user_id, task, other_task, minutes,
    occurred_on, comment, created_at, updated_at, deleted_at
FROM time_entries_backup
WHERE backup_created_at IS NOT NULL;

-- =============================================
-- STEP 4: RESTORE ADMIN_ACTIVITIES TABLE
-- =============================================

-- Clear existing admin_activities data
TRUNCATE TABLE admin_activities CASCADE;

-- Restore from backup (excluding backup metadata columns)
INSERT INTO admin_activities (
    id, user_id, activity_type, activity_data, created_at, updated_at
)
SELECT 
    id, user_id, activity_type, activity_data, created_at, updated_at
FROM admin_activities_backup
WHERE backup_created_at IS NOT NULL;

-- =============================================
-- STEP 5: RESTORE CONTACT_SUBMISSIONS TABLE
-- =============================================

-- Clear existing contact_submissions data
TRUNCATE TABLE contact_submissions CASCADE;

-- Restore from backup (excluding backup metadata columns)
INSERT INTO contact_submissions (
    id, name, email, subject, message, created_at, updated_at
)
SELECT 
    id, name, email, subject, message, created_at, updated_at
FROM contact_submissions_backup
WHERE backup_created_at IS NOT NULL;

-- =============================================
-- STEP 6: RESTORE TELEMETRY_EVENTS TABLE
-- =============================================

-- Clear existing telemetry_events data
TRUNCATE TABLE telemetry_events CASCADE;

-- Restore from backup (excluding backup metadata columns)
INSERT INTO telemetry_events (
    id, user_id, event_type, event_data, created_at, updated_at
)
SELECT 
    id, user_id, event_type, event_data, created_at, updated_at
FROM telemetry_events_backup
WHERE backup_created_at IS NOT NULL;

-- =============================================
-- STEP 7: VERIFY RESTORE
-- =============================================

-- Verify profiles restore
SELECT 
    'Profiles Restore Verification' as status,
    (SELECT COUNT(*) FROM profiles_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    (SELECT COUNT(*) FROM profiles) as restored_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM profiles_backup WHERE backup_created_at IS NOT NULL) = (SELECT COUNT(*) FROM profiles)
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- Verify time_entries restore
SELECT 
    'Time Entries Restore Verification' as status,
    (SELECT COUNT(*) FROM time_entries_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    (SELECT COUNT(*) FROM time_entries) as restored_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM time_entries_backup WHERE backup_created_at IS NOT NULL) = (SELECT COUNT(*) FROM time_entries)
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- Verify admin_activities restore
SELECT 
    'Admin Activities Restore Verification' as status,
    (SELECT COUNT(*) FROM admin_activities_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    (SELECT COUNT(*) FROM admin_activities) as restored_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM admin_activities_backup WHERE backup_created_at IS NOT NULL) = (SELECT COUNT(*) FROM admin_activities)
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- Verify contact_submissions restore
SELECT 
    'Contact Submissions Restore Verification' as status,
    (SELECT COUNT(*) FROM contact_submissions_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    (SELECT COUNT(*) FROM contact_submissions) as restored_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM contact_submissions_backup WHERE backup_created_at IS NOT NULL) = (SELECT COUNT(*) FROM contact_submissions)
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- Verify telemetry_events restore
SELECT 
    'Telemetry Events Restore Verification' as status,
    (SELECT COUNT(*) FROM telemetry_events_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    (SELECT COUNT(*) FROM telemetry_events) as restored_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM telemetry_events_backup WHERE backup_created_at IS NOT NULL) = (SELECT COUNT(*) FROM telemetry_events)
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- =============================================
-- STEP 5: SAMPLE DATA VERIFICATION
-- =============================================

-- Show sample of restored data
SELECT 'Sample Restored Profiles' as table_name, * FROM profiles LIMIT 3;
SELECT 'Sample Restored Time Entries' as table_name, * FROM time_entries LIMIT 3;
SELECT 'Sample Restored Admin Activities' as table_name, * FROM admin_activities LIMIT 3;
SELECT 'Sample Restored Contact Submissions' as table_name, * FROM contact_submissions LIMIT 3;
SELECT 'Sample Restored Telemetry Events' as table_name, * FROM telemetry_events LIMIT 3;

-- =============================================
-- RESTORE COMPLETE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'RESTORE FROM BACKUP COMPLETED';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Data has been restored from backup tables.';
    RAISE NOTICE 'Verify the data integrity above.';
    RAISE NOTICE '=============================================';
END $$;
