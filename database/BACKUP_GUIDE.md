# 🔒 Database Backup Guide

This guide provides comprehensive instructions for backing up your Supabase database before making any changes.

## 📋 Prerequisites

- **Node.js and npm** installed
- **Supabase Project** with active database
- **Database Password** or **Service Role Key** from Supabase Dashboard

## 🔑 Method 1: API Key Export (Recommended)

### Step 1: Get Your Service Role Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings → API**
4. Copy the **`service_role`** key (NOT the `anon` key)
5. This key starts with `eyJ...` and provides full database access

### Step 2: Run Export Script

```bash
# Replace [YOUR_SERVICE_KEY] with your actual service role key
SUPABASE_SERVICE_KEY='your_service_role_key_here' ./database/export-with-api-keys.sh
```

### Step 3: Verify Export

Check that the export files were created:

```bash
ls -lh database/*_export_*.json
```

## 🗄️ Method 2: Direct Database Export

### Step 1: Get Your Database Password

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Settings → Database**
3. Find the **"Connection string"** section
4. Copy the password from the connection string

### Step 2: Run Export Command

```bash
# Replace [YOUR_PASSWORD] with your actual database password
DB_PASSWORD='your_password_here' ./database/export-database.sh
```

### Step 3: Verify Export

Check that the backup file was created:

```bash
ls -lh database/complete_backup_*.sql
```

## 🛡️ Safety Features

- **Automatic verification** of backup files
- **Timestamped filenames** for organization
- **Multiple export formats** (JSON and SQL)
- **Error handling** with clear messages

## 📁 Backup File Locations

- **API Export**: `database/*_export_*.json` files
- **SQL Export**: `database/complete_backup_*.sql` files
- **Summary**: `database/export_summary_*.txt` files

## ⚠️ Important Notes

- **Keep backup files secure** - they contain sensitive data
- **Store backups off-site** (cloud storage, external drive)
- **Test restore procedures** before relying on backups
- **Regular backups** are recommended before major changes

## 🔄 Restore Instructions

To restore from backup, use the `restore-from-backup.sql` script:

```bash
# Run in Supabase SQL Editor
psql -h your-db-host -U postgres -d postgres < database/complete_backup_*.sql
```

## 🆘 Emergency Procedures

If you need to restore immediately:

1. **Stop the application** to prevent data conflicts
2. **Run the restore script** from the backup
3. **Verify data integrity** by checking record counts
4. **Restart the application** and test functionality

---

**Last Updated**: 2025-09-26  
**Version**: 1.0  
**Status**: Production Ready
