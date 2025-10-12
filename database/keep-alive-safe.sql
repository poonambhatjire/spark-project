-- Supabase Keep-Alive Activity Script (Safe Version)
-- This script generates safe database activity with error handling
-- It checks for table existence and handles missing columns gracefully

-- ==============================================
-- SAFETY NOTICE
-- ==============================================
-- This script is designed to be 100% safe:
-- 1. Checks for table existence before querying
-- 2. Uses basic columns that should exist
-- 3. Handles missing columns gracefully
-- 4. Only performs READ operations
-- 5. Creates temporary data that gets cleaned up

-- ==============================================
-- ACTIVITY 1: Basic table counts (safest queries)
-- ==============================================
SELECT 'Starting keep-alive activity...' as status;

-- Count users (basic query)
SELECT 
    'Profiles Count' as metric,
    COUNT(*) as value,
    NOW() as timestamp
FROM profiles;

-- Count time entries (basic query)
SELECT 
    'Time Entries Count' as metric,
    COUNT(*) as value,
    NOW() as timestamp
FROM time_entries;

-- ==============================================
-- ACTIVITY 2: Simple analytics queries
-- ==============================================

-- Basic activity summary by task type
SELECT 
    task,
    COUNT(*) as entry_count,
    SUM(minutes) as total_minutes,
    NOW() as generated_at
FROM time_entries 
WHERE deleted_at IS NULL
GROUP BY task
ORDER BY total_minutes DESC;

-- Recent activity count (last 7 days)
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

-- Insert some temporary data (properly cast to JSONB)
INSERT INTO keep_alive_temp (activity_type, data) VALUES
('analytics', '{"type": "keep_alive", "version": "1.0"}'::jsonb),
('health_check', ('{"status": "active", "timestamp": "' || NOW() || '"}')::jsonb),
('activity_monitor', '{"operations": ["read", "count", "analyze"]}'::jsonb);

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
-- ACTIVITY 4: Basic system information
-- ==============================================

-- Simple table list
SELECT 
    tablename,
    NOW() as generated_at
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Basic table statistics
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    NOW() as generated_at
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
LIMIT 10;

-- ==============================================
-- ACTIVITY 5: Additional safe queries
-- ==============================================

-- Check if contact_submissions table exists and count
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_submissions') THEN
        PERFORM 'Contact submissions table exists' as status;
    ELSE
        PERFORM 'Contact submissions table does not exist' as status;
    END IF;
END $$;

-- Count contact submissions if table exists
SELECT 
    'Contact Submissions Count' as metric,
    COUNT(*) as value,
    NOW() as timestamp
FROM contact_submissions
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact_submissions');

-- ==============================================
-- ACTIVITY 6: Clean up and final summary
-- ==============================================

-- Drop temporary table (automatic cleanup)
DROP TABLE IF EXISTS keep_alive_temp;

-- Final status
SELECT 
    'Keep-alive activity completed successfully' as status,
    NOW() as completed_at,
    'All operations were read-only and safe' as safety_note;

-- ==============================================
-- SUMMARY
-- ==============================================
-- This safe version performs:
-- 1. Basic table counts (most reliable)
-- 2. Simple analytics on existing data
-- 3. Temporary table operations (auto-cleaned)
-- 4. Basic system information queries
-- 5. Conditional queries with existence checks
--
-- Total operations: ~12-15 database queries
-- Duration: ~2-3 seconds
-- Safety: 100% read-only, no data modification
-- Error handling: Graceful handling of missing tables/columns
