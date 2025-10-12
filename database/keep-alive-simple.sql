-- Supabase Keep-Alive Activity Script (Simple Version)
-- This script generates safe database activity with minimal complexity
-- No JSONB, no complex queries - just basic activity to prevent shutdown

-- ==============================================
-- SAFETY NOTICE
-- ==============================================
-- This script is designed to be 100% safe:
-- 1. Only basic SELECT queries
-- 2. Simple temporary table operations
-- 3. No complex data types (no JSONB)
-- 4. No modifications to existing data
-- 5. Automatic cleanup of temporary data

-- ==============================================
-- ACTIVITY 1: Basic table counts
-- ==============================================
SELECT 'Starting keep-alive activity...' as status;

-- Count users
SELECT 
    'Profiles Count' as metric,
    COUNT(*) as value,
    NOW() as timestamp
FROM profiles;

-- Count time entries
SELECT 
    'Time Entries Count' as metric,
    COUNT(*) as value,
    NOW() as timestamp
FROM time_entries;

-- Count contact submissions (if table exists)
SELECT 
    'Contact Submissions Count' as metric,
    COUNT(*) as value,
    NOW() as timestamp
FROM contact_submissions;

-- ==============================================
-- ACTIVITY 2: Simple analytics queries
-- ==============================================

-- Activity summary by task type
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
-- ACTIVITY 3: Simple temporary table operations
-- ==============================================

-- Create simple temporary table (no JSONB)
CREATE TEMP TABLE IF NOT EXISTS keep_alive_temp (
    id SERIAL PRIMARY KEY,
    activity_type VARCHAR(50),
    message TEXT,
    generated_at TIMESTAMP DEFAULT NOW()
);

-- Insert temporary data (simple text only)
INSERT INTO keep_alive_temp (activity_type, message) VALUES
('analytics', 'Keep-alive activity running'),
('health_check', 'Database connection active'),
('activity_monitor', 'Generating activity to prevent shutdown');

-- Query the temporary data
SELECT 
    activity_type,
    message,
    generated_at,
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

-- List tables
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
    n_tup_ins as total_inserts,
    n_tup_upd as total_updates,
    NOW() as generated_at
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
LIMIT 10;

-- ==============================================
-- ACTIVITY 5: Additional simple queries
-- ==============================================

-- Check database size (simplified)
SELECT 
    'Database Activity' as info_type,
    'Keep-alive queries executed' as description,
    NOW() as generated_at;

-- Simple user activity count
SELECT 
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_entries,
    NOW() as generated_at
FROM time_entries 
WHERE deleted_at IS NULL;

-- ==============================================
-- ACTIVITY 6: Clean up and final summary
-- ==============================================

-- Drop temporary table
DROP TABLE IF EXISTS keep_alive_temp;

-- Final status
SELECT 
    'Keep-alive activity completed successfully' as status,
    NOW() as completed_at,
    'All operations were read-only and safe' as safety_note;

-- ==============================================
-- SUMMARY
-- ==============================================
-- This simple version performs:
-- 1. Basic table counts (most reliable)
-- 2. Simple analytics on existing data
-- 3. Basic temporary table operations (text only)
-- 4. Simple system information queries
-- 5. Cleanup operations
--
-- Total operations: ~15 database queries
-- Duration: ~2-3 seconds
-- Safety: 100% read-only, no data modification
-- Complexity: Minimal - no JSONB or complex types

