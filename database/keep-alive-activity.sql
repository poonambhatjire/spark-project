-- Supabase Keep-Alive Activity Script
-- This script generates safe database activity to prevent project shutdown
-- It only performs READ operations and creates temporary data that gets cleaned up

-- ==============================================
-- SAFETY NOTICE
-- ==============================================
-- This script is designed to be 100% safe:
-- 1. Only performs SELECT operations on existing data
-- 2. Creates temporary tables that are automatically cleaned up
-- 3. No modifications to existing user data
-- 4. No deletions of important data
-- 5. All operations are read-only or use temporary storage

-- ==============================================
-- ACTIVITY 1: Read existing data counts
-- ==============================================
SELECT 'Starting keep-alive activity...' as status;

-- Count users and activities
SELECT 
    'User Count' as metric,
    COUNT(*) as value,
    NOW() as timestamp
FROM profiles;

SELECT 
    'Time Entries Count' as metric,
    COUNT(*) as value,
    NOW() as timestamp
FROM time_entries;

SELECT 
    'Contact Submissions Count' as metric,
    COUNT(*) as value,
    NOW() as timestamp
FROM contact_submissions;

-- ==============================================
-- ACTIVITY 2: Generate analytics queries
-- ==============================================

-- Activity summary by task type (read-only)
SELECT 
    task,
    COUNT(*) as entry_count,
    SUM(minutes) as total_minutes,
    AVG(minutes) as avg_minutes,
    NOW() as generated_at
FROM time_entries 
WHERE deleted_at IS NULL
GROUP BY task
ORDER BY total_minutes DESC;

-- Recent activity summary (last 7 days)
SELECT 
    DATE(occurred_on) as activity_date,
    COUNT(*) as daily_entries,
    SUM(minutes) as daily_minutes,
    NOW() as generated_at
FROM time_entries 
WHERE occurred_on >= CURRENT_DATE - INTERVAL '7 days'
    AND deleted_at IS NULL
GROUP BY DATE(occurred_on)
ORDER BY activity_date DESC;

-- User activity summary (using available columns)
SELECT 
    p.id as user_id,
    COUNT(t.id) as total_entries,
    SUM(t.minutes) as total_minutes,
    MAX(t.created_at) as last_activity,
    NOW() as generated_at
FROM profiles p
LEFT JOIN time_entries t ON p.id = t.user_id AND t.deleted_at IS NULL
GROUP BY p.id
ORDER BY total_minutes DESC;

-- ==============================================
-- ACTIVITY 3: Create and query temporary tables
-- ==============================================

-- Create temporary table for activity simulation
CREATE TEMP TABLE IF NOT EXISTS keep_alive_temp (
    id SERIAL PRIMARY KEY,
    activity_type VARCHAR(50),
    generated_at TIMESTAMP DEFAULT NOW(),
    data JSONB
);

-- Insert some temporary data
INSERT INTO keep_alive_temp (activity_type, data) VALUES
('analytics', '{"type": "keep_alive", "version": "1.0"}'),
('health_check', '{"status": "active", "timestamp": "' || NOW() || '"}'),
('activity_monitor', '{"operations": ["read", "count", "analyze"]}');

-- Query the temporary data
SELECT 
    activity_type,
    generated_at,
    data,
    NOW() as current_time
FROM keep_alive_temp
ORDER BY generated_at DESC;

-- Count temporary records
SELECT 
    'Temporary Records' as metric,
    COUNT(*) as value,
    NOW() as timestamp
FROM keep_alive_temp;

-- ==============================================
-- ACTIVITY 4: System information queries
-- ==============================================

-- Database size information (read-only)
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    NOW() as generated_at
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Table statistics
SELECT 
    'Table Statistics' as info_type,
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    NOW() as generated_at
FROM pg_stat_user_tables 
WHERE schemaname = 'public';

-- ==============================================
-- ACTIVITY 5: Clean up and final summary
-- ==============================================

-- Drop temporary table (automatic cleanup)
DROP TABLE IF EXISTS keep_alive_temp;

-- Final status
SELECT 
    'Keep-alive activity completed successfully' as status,
    NOW() as completed_at,
    'No data was modified or deleted' as safety_note;

-- ==============================================
-- SUMMARY
-- ==============================================
-- This script performs the following safe activities:
-- 1. Reads user counts and statistics
-- 2. Generates analytics queries on existing data
-- 3. Creates and queries temporary tables (auto-cleaned)
-- 4. Retrieves system information (read-only)
-- 5. Provides activity summary
--
-- Total operations: ~15-20 database queries
-- Duration: ~2-5 seconds
-- Safety: 100% read-only, no data modification
-- Frequency: Can be run multiple times daily safely
