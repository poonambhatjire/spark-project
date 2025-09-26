# 🛡️ Database Migration Safety Guide

## Overview
This guide provides a comprehensive strategy for safely migrating your database to support datetime and timezone features while protecting your existing data.

## 🚨 CRITICAL: Follow This Order Exactly

### Phase 1: Pre-Migration Safety (DO THIS FIRST)

#### 1.1 Create Full Backup
```sql
-- Run this FIRST before any migration
-- File: database/backup-strategy.sql
```

#### 1.2 Verify Backup Integrity
- Check that backup tables were created successfully
- Verify row counts match between original and backup tables
- Review sample data in backup tables

#### 1.3 Test Restore Process (Optional but Recommended)
```sql
-- Test restore on a copy of your database first
-- File: database/restore-from-backup.sql
```

### Phase 2: Migration Execution

#### 2.1 Run the Migration
```sql
-- File: database/add-datetime-timezone-support.sql
```

#### 2.2 Verify Migration Success
- Check migration success messages
- Verify data integrity
- Test application functionality

### Phase 3: Post-Migration Cleanup

#### 3.1 Keep Backups for 30 Days
- Don't delete backup tables immediately
- Monitor application for issues
- Keep rollback options available

#### 3.2 Clean Up After 30 Days
```sql
-- Only after confirming everything works perfectly
DROP TABLE IF EXISTS profiles_backup;
DROP TABLE IF EXISTS time_entries_backup;
DROP TABLE IF EXISTS backup_metadata;
```

## 📋 Long-Term Backup Strategy

### 1. Automated Daily Backups
```sql
-- Create a scheduled backup job (run daily)
CREATE OR REPLACE FUNCTION create_daily_backup()
RETURNS void AS $$
BEGIN
    -- Create timestamped backup tables
    EXECUTE format('CREATE TABLE profiles_backup_%s AS SELECT * FROM profiles', 
                   to_char(now(), 'YYYY_MM_DD'));
    EXECUTE format('CREATE TABLE time_entries_backup_%s AS SELECT * FROM time_entries', 
                   to_char(now(), 'YYYY_MM_DD'));
    
    -- Log backup creation
    INSERT INTO backup_metadata (backup_type, table_name, backup_date, notes)
    VALUES ('DAILY_AUTO', 'all_tables', now(), 'Automated daily backup');
END;
$$ LANGUAGE plpgsql;
```

### 2. Weekly Full Database Export
```bash
# Export entire database weekly
pg_dump -h your-host -U your-user -d your-database > weekly_backup_$(date +%Y%m%d).sql
```

### 3. Point-in-Time Recovery Setup
- Enable WAL archiving in PostgreSQL
- Set up continuous archiving
- Test restore procedures monthly

### 4. Application-Level Backups
```typescript
// Create backup endpoints in your API
app.post('/admin/backup', async (req, res) => {
  // Create application-level backup
  // Export all data to JSON/CSV
});
```

## 🔄 Migration Rollback Procedures

### Immediate Rollback (if migration fails)
```sql
-- File: database/restore-from-backup.sql
-- Use this if migration fails immediately
```

### Partial Rollback (if issues discovered later)
```sql
-- File: database/rollback-datetime-timezone-support.sql
-- Use this to revert the schema changes
```

### Application Rollback
- Revert code changes to previous version
- Deploy previous application version
- Restore from backup if needed

## 🧪 Testing Strategy

### 1. Development Environment Testing
- Test migration on development database first
- Verify all functionality works with new schema
- Test edge cases and error scenarios

### 2. Staging Environment Testing
- Run migration on staging database
- Perform full application testing
- Load test with production-like data

### 3. Production Migration
- Schedule during low-usage period
- Have rollback plan ready
- Monitor application closely after migration

## 📊 Monitoring and Alerts

### 1. Data Integrity Monitoring
```sql
-- Create monitoring queries
SELECT 
    'Data Integrity Check' as check_type,
    COUNT(*) as total_entries,
    MIN(occurred_on) as earliest_entry,
    MAX(occurred_on) as latest_entry
FROM time_entries;
```

### 2. Application Monitoring
- Monitor error rates after migration
- Check response times
- Verify user functionality

### 3. Backup Monitoring
- Verify backups are created successfully
- Check backup file sizes
- Test restore procedures regularly

## 🚀 Best Practices

### 1. Always Backup Before Changes
- Never run migrations without backups
- Test restore procedures
- Keep multiple backup copies

### 2. Incremental Changes
- Make small, testable changes
- Verify each step before proceeding
- Have rollback plan for each step

### 3. Communication
- Notify users of maintenance windows
- Document all changes
- Keep stakeholders informed

### 4. Documentation
- Document all migration steps
- Record any issues encountered
- Update runbooks and procedures

## 🆘 Emergency Procedures

### If Migration Fails Immediately
1. Stop the migration process
2. Run restore-from-backup.sql
3. Verify data integrity
4. Investigate failure cause
5. Fix issues and retry

### If Issues Discovered Later
1. Assess impact and scope
2. Decide on rollback vs fix
3. Execute chosen strategy
4. Communicate with users
5. Document lessons learned

## 📞 Support Contacts

- Database Administrator: [Your DBA contact]
- Development Team Lead: [Your dev lead]
- Emergency Contact: [Your emergency contact]

---

**Remember: It's better to be overly cautious with data than to lose it. Always backup before making changes!**
