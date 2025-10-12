# 🚀 Quick Keep-Alive Instructions

## Option 1: Run Shell Script (Recommended)

```bash
# From your project root directory
./database/run-keep-alive.sh
```

## Option 2: Manual SQL Execution

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database/keep-alive-activity.sql`
4. Click **Run**

## Option 3: Automated Daily Execution

Set up a cron job to run daily:

```bash
# Add to your crontab (runs daily at 9 AM)
0 9 * * * cd /path/to/spark-project && ./database/run-keep-alive.sh
```

## What This Script Does

✅ **100% Safe Operations:**
- Only reads existing data
- Creates temporary tables (auto-cleaned)
- No modifications to user data
- No deletions of important data

📊 **Generated Activity:**
- ~15-20 database queries
- User statistics and analytics
- System information queries
- Temporary data operations

⏱️ **Duration:** 2-5 seconds
🔄 **Frequency:** Can run multiple times daily safely

## Safety Guarantee

This script is designed to generate sufficient database activity to keep your Supabase project active without any risk to your data. All operations are read-only or use temporary storage that gets automatically cleaned up.
