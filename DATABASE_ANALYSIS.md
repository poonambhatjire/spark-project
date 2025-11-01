# 📊 Database & Codebase Analysis Report

## Executive Summary

This document provides a comprehensive analysis of the SPARC Calculator codebase and its database architecture. The application is a **Next.js 15** time-tracking system for antimicrobial stewardship activities, built on **Supabase PostgreSQL** with row-level security (RLS) for data isolation.

---

## 🗄️ Database Architecture

### Database System
- **Platform:** Supabase (PostgreSQL)
- **Connection:** REST API via Supabase JS Client
- **Security:** Row-Level Security (RLS) enabled
- **Backup Strategy:** Comprehensive backup scripts available

### Core Tables

#### 1. **`profiles`** - User Profiles Table

**Purpose:** Stores user profile information and authentication data

**Columns (inferred from code):**
```sql
id                  UUID PRIMARY KEY (references auth.users)
email               VARCHAR
name                VARCHAR
role                VARCHAR (user|admin|super_admin)
phone_number        VARCHAR
professional_title  VARCHAR
organization        VARCHAR
department          VARCHAR
specialty           VARCHAR
years_of_experience VARCHAR
license_number      VARCHAR
work_location       VARCHAR
stewardship_role    VARCHAR
certification_status VARCHAR
time_zone           VARCHAR
timezone            VARCHAR(50) DEFAULT 'UTC'  -- Added via migration
date_format         VARCHAR(20) DEFAULT 'MM/DD/YYYY'
time_format         VARCHAR(10) DEFAULT '12h'
manager             VARCHAR
team                VARCHAR
notes               TEXT
is_active           BOOLEAN
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

**Key Features:**
- Linked to Supabase Auth via `id`
- Role-based access control (user/admin/super_admin)
- Timezone and formatting preferences
- Professional information tracking
- Soft delete capability via `is_active`

**Usage in Code:**
- `src/lib/actions/user-profile.ts` - Profile CRUD operations
- `src/lib/actions/admin.ts` - Admin profile management
- `src/app/api/keep-alive/route.ts` - Keep-alive queries

---

#### 2. **`time_entries`** - Time Tracking Entries

**Purpose:** Stores time-logged activities for antimicrobial stewardship

**Columns (inferred from code):**
```sql
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES profiles(id)
task                VARCHAR (Activity type enum)
other_task          VARCHAR (nullable)
minutes             INTEGER (1-480)
occurred_on         TIMESTAMP WITH TIME ZONE  -- Migrated from DATE
comment             TEXT (nullable)
created_at          TIMESTAMP
updated_at          TIMESTAMP
deleted_at          TIMESTAMP (nullable)  -- Soft delete
```

**Activity Types (from `client.ts`):**
```typescript
// Patient Care
- 'Patient Care - Prospective Audit & Feedback'
- 'Patient Care - Authorization of Restricted Antimicrobials'
- 'Patient Care - Participating in Clinical Rounds'

// Administrative
- 'Administrative - Guidelines/EHR'
- 'Administrative - Committee Work'
- 'Administrative - QI projects/research'
- 'Administrative - Emails'

// Tracking
- 'Tracking - AMU'
- 'Tracking - AMR'
- 'Tracking - Antibiotic Appropriateness'
- 'Tracking - Intervention Acceptance'

// Reporting
- 'Reporting - sharing data with prescribers/decision makers'

// Education
- 'Education - Providing Education'
- 'Education - Receiving Education (e.g. CE)'

// Other
- 'Other - specify in comments'
```

**Key Features:**
- User-specific data isolation via RLS
- Soft delete capability (`deleted_at`)
- Timezone-aware datetime support (migrated from date-only)
- Activity categorization system
- Minutes tracking (1-480 range)

**Indexes:**
- `idx_time_entries_occurred_on` - For date range queries
- `idx_time_entries_user_occurred_on` - Composite index for user-specific date queries

**Usage in Code:**
- `src/lib/actions/time-entries.ts` - Primary CRUD operations (server actions)
- `src/app/dashboard/data/supabase-client.ts` - Client-side operations
- `src/app/api/keep-alive/route.ts` - Keep-alive activity queries

---

#### 3. **`contact_submissions`** - Contact Form Data

**Purpose:** Stores contact form submissions from the public website

**Columns (estimated):**
```sql
id                  UUID PRIMARY KEY
name                VARCHAR
email               VARCHAR
message             TEXT
created_at          TIMESTAMP
```

**Usage in Code:**
- `src/app/api/keep-alive/route.ts` - Keep-alive queries (counts recent submissions)

---

#### 4. **`telemetry_events`** - Usage Analytics

**Purpose:** Tracks user interactions and application usage

**Columns (estimated):**
```sql
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES profiles(id)
event_type          VARCHAR
event_data          JSONB (nullable)
created_at          TIMESTAMP
```

**Usage in Code:**
- `src/lib/telemetry.ts` - Telemetry tracking
- Backed up in `database/backup-strategy.sql`

---

#### 5. **`admin_activities`** - Admin Activity Log

**Purpose:** Tracks administrative actions for audit purposes

**Columns (estimated):**
```sql
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES profiles(id)
activity_type       VARCHAR
activity_data       JSONB (nullable)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

**Usage:**
- Admin panel activity tracking
- Audit logging for administrative actions

---

### Database Views

#### 1. **`activity_summary`** (Referenced in backup scripts)
- Aggregated activity statistics
- Used for reporting and analytics

#### 2. **`user_stats`** (Referenced in backup scripts)
- Per-user statistics
- Performance metrics

---

## 🔐 Security Architecture

### Row-Level Security (RLS)

**Implementation:**
- RLS is enabled on all tables
- Users can only access their own data
- Admin access handled via role checks in application code

**Policy Pattern (inferred):**
```sql
-- Example for time_entries
CREATE POLICY "Users can only see their own entries"
ON time_entries FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own entries"
ON time_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own entries"
ON time_entries FOR UPDATE
USING (auth.uid() = user_id);
```

**Code-Level Security:**
- All queries include `.eq('user_id', user.id)` to enforce user isolation
- Admin functions use `checkAdminAccess()` before executing
- Server-side validation in all actions

---

## 🔄 Database Operations

### Primary Operations

#### **Create Time Entry**
```typescript
// Location: src/lib/actions/time-entries.ts
async function createTimeEntry(input: CreateEntryInput)
  - Inserts into time_entries table
  - Automatically sets user_id from authenticated session
  - Returns mapped TimeEntry object
```

#### **Update Time Entry**
```typescript
// Location: src/lib/actions/time-entries.ts
async function updateTimeEntry(id: string, patch: UpdateEntryInput)
  - Updates time_entries table
  - Enforces user_id match (prevents cross-user updates)
  - Updates updated_at timestamp
```

#### **Delete Time Entry**
```typescript
// Location: src/lib/actions/time-entries.ts
async function deleteTimeEntries(ids: string[])
  - Soft delete via deleted_at timestamp
  - Batch delete support
  - User isolation enforced
```

#### **List Time Entries**
```typescript
// Location: src/lib/actions/time-entries.ts
async function listTimeEntries(options)
  - Filtering: range (today|week|all), task, includeDeleted
  - Sorting: occurred_on descending (newest first)
  - User isolation enforced
```

---

### Keep-Alive System

**Purpose:** Prevents Supabase database from entering sleep mode

**Implementation:**
- **API Endpoint:** `/api/keep-alive` (GET)
- **Level:** Medium (Level 2) - 14 queries per run
- **Automation:** GitHub Actions cron (every 6 hours)

**Query Breakdown:**

1. **Basic Counts (3 queries):**
   - Profiles count
   - Time entries count
   - Contact submissions count

2. **Aggregation Queries (6 queries):**
   - Total minutes calculation
   - Active entries count
   - Recent entries (7 days)
   - Deleted entries count
   - Monthly entries (30 days)
   - Unique task types count

3. **Analytics Queries (5 queries):**
   - Task distribution (100 sample limit)
   - Recent profiles (10 limit)
   - Recent time entries (10 limit)
   - Recent contacts (5 limit)
   - Active users last 7 days

**Execution Time:** ~50-200ms typically

**Files:**
- `src/app/api/keep-alive/route.ts` - API implementation
- `.github/workflows/keep-alive.yml` - Automation

---

## 📁 Code Architecture

### Database Client Structure

#### **Server-Side Client**
```typescript
// Location: src/lib/supabase/server.ts
export async function createClient()
  - Uses @supabase/ssr for server-side rendering
  - Cookie-based session management
  - Automatic session refresh
```

#### **Client-Side Client**
```typescript
// Location: src/lib/supabase/client.ts
export function createClient()
  - Uses @supabase/ssr for browser
  - Public key authentication
  - RLS enforced by Supabase
```

---

### Data Layer Patterns

#### **Server Actions Pattern**
- All database operations use Next.js Server Actions
- Located in `src/lib/actions/`
- Type-safe with TypeScript interfaces
- Error handling and validation built-in

#### **Client Data Layer**
- `src/app/dashboard/data/supabase-client.ts` - Client-side data operations
- `src/app/dashboard/data/client.ts` - Legacy localStorage client (deprecated?)

---

## 🔄 Data Flow

### Time Entry Creation Flow

```
1. User submits form (Client Component)
   ↓
2. Calls server action: createTimeEntry()
   ↓
3. Server action creates Supabase client
   ↓
4. Gets authenticated user from session
   ↓
5. Inserts into time_entries table
   ↓
6. Returns mapped TimeEntry object
   ↓
7. Client updates UI state
```

### Data Query Flow

```
1. Component calls listTimeEntries()
   ↓
2. Server action creates Supabase client
   ↓
3. Authenticates user
   ↓
4. Builds query with filters (.eq('user_id', user.id))
   ↓
5. Executes query with RLS enforcement
   ↓
6. Maps Supabase rows to TimeEntry objects
   ↓
7. Returns filtered, sorted array
```

---

## 🗂️ Data Migration History

### Datetime & Timezone Support Migration

**File:** `database/add-datetime-timezone-support.sql`

**Changes:**
1. Added timezone fields to `profiles` table:
   - `timezone` (VARCHAR, default 'UTC')
   - `date_format` (VARCHAR, default 'MM/DD/YYYY')
   - `time_format` (VARCHAR, default '12h')

2. Migrated `time_entries.occurred_on`:
   - From: `DATE`
   - To: `TIMESTAMP WITH TIME ZONE`
   - Migration strategy: Set existing entries to `00:00:00 UTC`

3. Added performance indexes:
   - `idx_time_entries_occurred_on`
   - `idx_time_entries_user_occurred_on`

**Rollback:** Available via `database/rollback-datetime-timezone-support.sql`

---

## 📊 Backup & Recovery

### Backup Strategy

**Files:**
- `database/backup-strategy.sql` - Comprehensive backup script
- `database/restore-from-backup.sql` - Restore procedures
- `database/BACKUP_GUIDE.md` - Documentation

**Backup Coverage:**
- `profiles`
- `time_entries`
- `admin_activities`
- `contact_submissions`
- `telemetry_events`
- `activity_summary` (view as table)
- `user_stats` (view as table)

**Verification:** Backup scripts include integrity checks

---

## 🔍 Query Patterns

### Common Query Patterns

#### **User-Specific Queries**
```typescript
// Pattern: Always filter by user_id
const { data } = await supabase
  .from('time_entries')
  .select('*')
  .eq('user_id', user.id)
  .is('deleted_at', null);
```

#### **Date Range Queries**
```typescript
// Pattern: Use gte/lte for date ranges
const { data } = await supabase
  .from('time_entries')
  .select('*')
  .gte('occurred_on', startDate.toISOString())
  .lte('occurred_on', endDate.toISOString());
```

#### **Aggregation Queries**
```typescript
// Pattern: Select and calculate client-side
const { data } = await supabase
  .from('time_entries')
  .select('minutes')
  .is('deleted_at', null);
const total = data?.reduce((sum, e) => sum + e.minutes, 0);
```

#### **Soft Delete Queries**
```typescript
// Pattern: Filter by deleted_at IS NULL
const { data } = await supabase
  .from('time_entries')
  .select('*')
  .is('deleted_at', null);
```

---

## 🚨 Known Issues & Considerations

### 1. **Type Mismatch in Activity Types**
- `client.ts` uses full string names (e.g., 'Patient Care - Prospective Audit & Feedback')
- `supabase-client.ts` uses abbreviated codes (e.g., 'PAF')
- **Impact:** Potential inconsistency if both clients are used

### 2. **Timezone Handling**
- Migration adds timezone support but code primarily uses UTC
- Browser timezone used for display only
- **Recommendation:** Ensure consistent timezone handling

### 3. **Data Migration Status**
- Migration scripts exist but may not be applied
- **Recommendation:** Verify current schema matches migration scripts

### 4. **Backup Frequency**
- Manual backup scripts exist
- No automated backup schedule visible
- **Recommendation:** Set up automated daily backups

---

## 📈 Performance Considerations

### Indexes
- ✅ `idx_time_entries_occurred_on` - Fast date range queries
- ✅ `idx_time_entries_user_occurred_on` - Fast user-specific date queries
- ⚠️ Missing indexes on `task`, `deleted_at` - Consider if query patterns require

### Query Optimization
- Keep-alive queries use `LIMIT` clauses to prevent large result sets
- Date range queries use indexes efficiently
- Soft delete queries filter efficiently with `IS NULL`

### Potential Optimizations
1. Add composite indexes for common filter combinations
2. Consider materialized views for analytics
3. Cache frequently accessed data (profiles)

---

## 🎯 Recommendations

### Short-Term
1. **Verify Schema:** Run verification queries to confirm current schema matches code
2. **Consolidate Activity Types:** Unify activity type naming between clients
3. **Add Indexes:** Create indexes on frequently queried columns

### Medium-Term
1. **Automated Backups:** Set up scheduled daily backups
2. **Query Monitoring:** Add logging for slow queries
3. **Data Retention Policy:** Implement archival strategy for old entries

### Long-Term
1. **Analytics Dashboard:** Create materialized views for reporting
2. **Data Export API:** Enhance Excel/CSV export with filtering
3. **Audit Trail:** Expand admin_activities logging

---

## 📚 Related Files

### Database Scripts
- `database/add-datetime-timezone-support.sql` - Migration script
- `database/rollback-datetime-timezone-support.sql` - Rollback script
- `database/backup-strategy.sql` - Backup procedures
- `database/restore-from-backup.sql` - Restore procedures
- `database/keep-alive-*.sql` - Keep-alive query scripts

### Code Files
- `src/lib/actions/time-entries.ts` - Time entry CRUD
- `src/lib/actions/user-profile.ts` - Profile management
- `src/lib/actions/admin.ts` - Admin operations
- `src/app/dashboard/data/supabase-client.ts` - Client data layer
- `src/app/api/keep-alive/route.ts` - Keep-alive API

### Documentation
- `README.md` - Project overview
- `KEEP_ALIVE_SETUP.md` - Keep-alive documentation
- `database/BACKUP_GUIDE.md` - Backup procedures
- `database/MIGRATION_SAFETY_GUIDE.md` - Migration guide

---

## 📝 Summary

The SPARC Calculator database is well-structured with:
- ✅ Clear separation of concerns (profiles, time entries, analytics)
- ✅ Strong security via RLS and code-level validation
- ✅ Soft delete patterns for data retention
- ✅ Comprehensive backup and migration strategies
- ✅ Keep-alive system to prevent database sleep
- ✅ Timezone-aware datetime support

**Primary Concerns:**
- Activity type naming inconsistency between clients
- Manual backup process (not automated)
- Limited query performance monitoring

**Overall Assessment:** The database architecture is solid and well-designed for a time-tracking application with multi-user support and administrative capabilities.

---

*Generated: 2025-01-26*
*Database Platform: Supabase (PostgreSQL)*
*Application Framework: Next.js 15*

