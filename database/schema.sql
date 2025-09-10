-- SPARC Database Schema
-- This file contains all the necessary tables and configurations for the SPARC application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (Enhanced for Admin Panel)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  institution TEXT,
  department TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TIME ENTRIES TABLE (Main Data Storage)
-- =============================================
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task TEXT NOT NULL CHECK (task IN (
    'Patient Care - Prospective Audit & Feedback',
    'Patient Care - Authorization of Restricted Antimicrobials', 
    'Patient Care - Participating in Clinical Rounds',
    'Administrative - Guidelines/EHR', 
    'Tracking - AMU',
    'Tracking - AMR', 
    'Tracking - Antibiotic Appropriateness',
    'Tracking - Intervention Acceptance', 
    'Reporting - sharing data with prescribers/decision makers',
    'Education - Providing Education',
    'Education - Receiving Education (e.g. CE)', 
    'Administrative - Committee Work',
    'Administrative - QI projects/research',
    'Administrative - Emails', 
    'Other - specify in comments'
  )),
  other_task TEXT,
  minutes INTEGER NOT NULL CHECK (minutes >= 1 AND minutes <= 480),
  occurred_on DATE NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- TELEMETRY EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS telemetry_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'entry_created',
    'entry_updated', 
    'entry_deleted',
    'entry_duplicated',
    'bulk_delete',
    'bulk_duplicate',
    'export_csv',
    'filter_changed',
    'sort_changed',
    'search_used'
  )),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CONTACT SUBMISSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ADMIN ACTIVITIES TABLE (For Admin Panel)
-- =============================================
CREATE TABLE IF NOT EXISTS admin_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'user_role_changed',
    'user_deleted',
    'entry_deleted',
    'bulk_entry_deleted',
    'data_exported',
    'system_config_changed'
  )),
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_entry_id UUID REFERENCES time_entries(id) ON DELETE CASCADE,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Time entries indexes
CREATE INDEX IF NOT EXISTS idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_occurred_on ON time_entries(occurred_on);
CREATE INDEX IF NOT EXISTS idx_time_entries_task ON time_entries(task);
CREATE INDEX IF NOT EXISTS idx_time_entries_created_at ON time_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_time_entries_deleted_at ON time_entries(deleted_at);

-- Telemetry events indexes
CREATE INDEX IF NOT EXISTS idx_telemetry_events_user_id ON telemetry_events(user_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_event_type ON telemetry_events(event_type);
CREATE INDEX IF NOT EXISTS idx_telemetry_events_created_at ON telemetry_events(created_at);

-- Admin activities indexes
CREATE INDEX IF NOT EXISTS idx_admin_activities_admin_id ON admin_activities(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activities_target_user_id ON admin_activities(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activities_created_at ON admin_activities(created_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activities ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES POLICIES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- TIME ENTRIES POLICIES
-- =============================================

-- Users can view their own entries
CREATE POLICY "Users can view own entries" ON time_entries
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own entries
CREATE POLICY "Users can insert own entries" ON time_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own entries
CREATE POLICY "Users can update own entries" ON time_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own entries (soft delete)
CREATE POLICY "Users can delete own entries" ON time_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all entries
CREATE POLICY "Admins can view all entries" ON time_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Admins can delete any entry
CREATE POLICY "Admins can delete any entry" ON time_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- TELEMETRY EVENTS POLICIES
-- =============================================

-- Users can insert their own telemetry events
CREATE POLICY "Users can insert own telemetry" ON telemetry_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Admins can view all telemetry events
CREATE POLICY "Admins can view all telemetry" ON telemetry_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- CONTACT SUBMISSIONS POLICIES
-- =============================================

-- Anyone can insert contact submissions
CREATE POLICY "Anyone can insert contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Admins can view all contact submissions
CREATE POLICY "Admins can view contact submissions" ON contact_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Admins can update contact submissions
CREATE POLICY "Admins can update contact submissions" ON contact_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- ADMIN ACTIVITIES POLICIES
-- =============================================

-- Only admins can insert admin activities
CREATE POLICY "Admins can insert admin activities" ON admin_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Only admins can view admin activities
CREATE POLICY "Admins can view admin activities" ON admin_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- VIEWS FOR ADMIN PANEL
-- =============================================

-- View for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.institution,
  p.department,
  p.created_at,
  COUNT(te.id) as total_entries,
  COUNT(te.id) FILTER (WHERE te.deleted_at IS NULL) as active_entries,
  COALESCE(SUM(te.minutes) FILTER (WHERE te.deleted_at IS NULL), 0) as total_minutes,
  MAX(te.created_at) as last_activity
FROM profiles p
LEFT JOIN time_entries te ON p.id = te.user_id
GROUP BY p.id, p.email, p.full_name, p.role, p.institution, p.department, p.created_at;

-- View for activity summary
CREATE OR REPLACE VIEW activity_summary AS
SELECT 
  te.task,
  COUNT(*) as entry_count,
  COUNT(*) FILTER (WHERE te.deleted_at IS NULL) as active_count,
  COALESCE(SUM(te.minutes) FILTER (WHERE te.deleted_at IS NULL), 0) as total_minutes,
  COALESCE(AVG(te.minutes) FILTER (WHERE te.deleted_at IS NULL), 0) as avg_minutes,
  COUNT(DISTINCT te.user_id) as unique_users
FROM time_entries te
GROUP BY te.task;

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Uncomment the following lines to insert sample data for testing
/*
-- Insert sample admin user (replace with your actual user ID)
INSERT INTO profiles (id, email, full_name, role, institution, department)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with actual UUID
  'admin@example.com',
  'System Administrator',
  'super_admin',
  'SPARC Research',
  'IT Department'
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  institution = EXCLUDED.institution,
  department = EXCLUDED.department;
*/
