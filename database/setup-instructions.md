# SPARC Database Setup

## Quick Setup

1. **Go to your Supabase Dashboard** → SQL Editor
2. **Copy and paste** the contents of `database/schema.sql`
3. **Click "Run"** to execute the schema

## Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Database Schema

### Tables Created:
- **`profiles`**: User information with role-based access
- **`time_entries`**: Main time tracking data  
- **`telemetry_events`**: Usage analytics
- **`contact_submissions`**: Contact form data
- **`admin_activities`**: Admin audit logging

### Views Created:
- **`user_stats`**: User statistics for admin panel
- **`activity_summary`**: Activity analytics for admin panel

### Key Features:
- ✅ **Row Level Security (RLS)** - Users only see their own data
- ✅ **Role-based access** - Admin users can see all data
- ✅ **Automatic triggers** - Profile creation and timestamp updates
- ✅ **Performance indexes** - Optimized for common queries
- ✅ **Admin views** - Pre-built views for admin panel

## Setting Up Your First Admin User

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE profiles 
SET role = 'super_admin' 
WHERE email = 'your-email@example.com';
```

## Verification

After setup, verify in Supabase Dashboard → Table Editor that you see all 5 tables listed above.

## Next Steps

1. **Start building the admin panel** using the database views
2. **Migrate from localStorage** to Supabase tables
3. **Test the application** with real data
