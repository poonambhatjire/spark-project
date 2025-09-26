-- =============================================
-- DATABASE BACKUP STRATEGY
-- Comprehensive backup and restore procedures
-- =============================================

-- =============================================
-- STEP 1: CREATE BACKUP TABLES
-- =============================================

-- Backup profiles table
CREATE TABLE IF NOT EXISTS profiles_backup AS 
SELECT *, NOW() as backup_created_at FROM profiles;

-- Backup time_entries table  
CREATE TABLE IF NOT EXISTS time_entries_backup AS 
SELECT *, NOW() as backup_created_at FROM time_entries;

-- Backup admin_activities table
CREATE TABLE IF NOT EXISTS admin_activities_backup AS 
SELECT *, NOW() as backup_created_at FROM admin_activities;

-- Backup contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions_backup AS 
SELECT *, NOW() as backup_created_at FROM contact_submissions;

-- Backup telemetry_events table
CREATE TABLE IF NOT EXISTS telemetry_events_backup AS 
SELECT *, NOW() as backup_created_at FROM telemetry_events;

-- Backup activity_summary view (as table)
CREATE TABLE IF NOT EXISTS activity_summary_backup AS 
SELECT *, NOW() as backup_created_at FROM activity_summary;

-- Backup user_stats view (as table)
CREATE TABLE IF NOT EXISTS user_stats_backup AS 
SELECT *, NOW() as backup_created_at FROM user_stats;

-- =============================================
-- STEP 2: VERIFY BACKUP INTEGRITY
-- =============================================

-- Verify profiles backup
SELECT 
    'Profiles Backup Verification' as status,
    (SELECT COUNT(*) FROM profiles) as original_count,
    (SELECT COUNT(*) FROM profiles_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM profiles) = (SELECT COUNT(*) FROM profiles_backup WHERE backup_created_at IS NOT NULL) 
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- Verify time_entries backup
SELECT 
    'Time Entries Backup Verification' as status,
    (SELECT COUNT(*) FROM time_entries) as original_count,
    (SELECT COUNT(*) FROM time_entries_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM time_entries) = (SELECT COUNT(*) FROM time_entries_backup WHERE backup_created_at IS NOT NULL) 
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- Verify admin_activities backup
SELECT 
    'Admin Activities Backup Verification' as status,
    (SELECT COUNT(*) FROM admin_activities) as original_count,
    (SELECT COUNT(*) FROM admin_activities_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM admin_activities) = (SELECT COUNT(*) FROM admin_activities_backup WHERE backup_created_at IS NOT NULL) 
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- Verify contact_submissions backup
SELECT 
    'Contact Submissions Backup Verification' as status,
    (SELECT COUNT(*) FROM contact_submissions) as original_count,
    (SELECT COUNT(*) FROM contact_submissions_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM contact_submissions) = (SELECT COUNT(*) FROM contact_submissions_backup WHERE backup_created_at IS NOT NULL) 
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- Verify telemetry_events backup
SELECT 
    'Telemetry Events Backup Verification' as status,
    (SELECT COUNT(*) FROM telemetry_events) as original_count,
    (SELECT COUNT(*) FROM telemetry_events_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM telemetry_events) = (SELECT COUNT(*) FROM telemetry_events_backup WHERE backup_created_at IS NOT NULL) 
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- Verify activity_summary backup
SELECT 
    'Activity Summary Backup Verification' as status,
    (SELECT COUNT(*) FROM activity_summary) as original_count,
    (SELECT COUNT(*) FROM activity_summary_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM activity_summary) = (SELECT COUNT(*) FROM activity_summary_backup WHERE backup_created_at IS NOT NULL) 
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- Verify user_stats backup
SELECT 
    'User Stats Backup Verification' as status,
    (SELECT COUNT(*) FROM user_stats) as original_count,
    (SELECT COUNT(*) FROM user_stats_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM user_stats) = (SELECT COUNT(*) FROM user_stats_backup WHERE backup_created_at IS NOT NULL) 
        THEN 'SUCCESS' 
        ELSE 'FAILED' 
    END as verification_status;

-- =============================================
-- STEP 3: SAMPLE DATA VERIFICATION
-- =============================================

-- Show sample of backed up data
SELECT 'Sample Profiles Backup' as table_name, * FROM profiles_backup LIMIT 3;
SELECT 'Sample Time Entries Backup' as table_name, * FROM time_entries_backup LIMIT 3;
SELECT 'Sample Admin Activities Backup' as table_name, * FROM admin_activities_backup LIMIT 3;
SELECT 'Sample Contact Submissions Backup' as table_name, * FROM contact_submissions_backup LIMIT 3;
SELECT 'Sample Telemetry Events Backup' as table_name, * FROM telemetry_events_backup LIMIT 3;
SELECT 'Sample Activity Summary Backup' as table_name, * FROM activity_summary_backup LIMIT 3;
SELECT 'Sample User Stats Backup' as table_name, * FROM user_stats_backup LIMIT 3;

-- =============================================
-- STEP 4: BACKUP METADATA
-- =============================================

-- Create backup metadata table
CREATE TABLE IF NOT EXISTS backup_metadata (
    backup_id SERIAL PRIMARY KEY,
    backup_type VARCHAR(50) NOT NULL,
    backup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    table_name VARCHAR(100) NOT NULL,
    original_count INTEGER NOT NULL,
    backup_count INTEGER NOT NULL,
    backup_status VARCHAR(20) NOT NULL,
    notes TEXT
);

-- Insert backup metadata for all tables
INSERT INTO backup_metadata (backup_type, table_name, original_count, backup_count, backup_status, notes)
VALUES 
    ('FULL_BACKUP', 'profiles', 
     (SELECT COUNT(*) FROM profiles), 
     (SELECT COUNT(*) FROM profiles_backup), 
     'COMPLETED',
     'Full table backup before datetime migration'),
    ('FULL_BACKUP', 'time_entries', 
     (SELECT COUNT(*) FROM time_entries), 
     (SELECT COUNT(*) FROM time_entries_backup), 
     'COMPLETED',
     'Full table backup before datetime migration'),
    ('FULL_BACKUP', 'admin_activities', 
     (SELECT COUNT(*) FROM admin_activities), 
     (SELECT COUNT(*) FROM admin_activities_backup), 
     'COMPLETED',
     'Full table backup before datetime migration'),
    ('FULL_BACKUP', 'contact_submissions', 
     (SELECT COUNT(*) FROM contact_submissions), 
     (SELECT COUNT(*) FROM contact_submissions_backup), 
     'COMPLETED',
     'Full table backup before datetime migration'),
    ('FULL_BACKUP', 'telemetry_events', 
     (SELECT COUNT(*) FROM telemetry_events), 
     (SELECT COUNT(*) FROM telemetry_events_backup), 
     'COMPLETED',
     'Full table backup before datetime migration'),
    ('FULL_BACKUP', 'activity_summary', 
     (SELECT COUNT(*) FROM activity_summary), 
     (SELECT COUNT(*) FROM activity_summary_backup), 
     'COMPLETED',
     'Full view backup before datetime migration'),
    ('FULL_BACKUP', 'user_stats', 
     (SELECT COUNT(*) FROM user_stats), 
     (SELECT COUNT(*) FROM user_stats_backup), 
     'COMPLETED',
     'Full view backup before datetime migration');

-- =============================================
-- BACKUP COMPLETE
-- =============================================

SELECT 
    'BACKUP COMPLETED' as status,
    backup_date,
    table_name,
    original_count,
    backup_count,
    backup_status
FROM backup_metadata 
WHERE backup_type = 'FULL_BACKUP'
ORDER BY backup_date DESC;
