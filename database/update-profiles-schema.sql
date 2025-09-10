-- Update the profiles table to include comprehensive user information
-- This script adds new columns to the existing profiles table

-- Add new columns to the profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS professional_title TEXT,
ADD COLUMN IF NOT EXISTS specialty TEXT,
ADD COLUMN IF NOT EXISTS years_of_experience TEXT,
ADD COLUMN IF NOT EXISTS license_number TEXT,
ADD COLUMN IF NOT EXISTS work_location TEXT,
ADD COLUMN IF NOT EXISTS stewardship_role TEXT,
ADD COLUMN IF NOT EXISTS certification_status TEXT,
ADD COLUMN IF NOT EXISTS time_zone TEXT,
ADD COLUMN IF NOT EXISTS manager TEXT,
ADD COLUMN IF NOT EXISTS team TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add constraints for the new fields (drop existing ones first to avoid conflicts)
DO $$ 
BEGIN
    -- Drop existing constraints if they exist
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_professional_title_check') THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_professional_title_check;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_specialty_check') THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_specialty_check;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_stewardship_role_check') THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_stewardship_role_check;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_work_location_check') THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_work_location_check;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_years_of_experience_check') THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_years_of_experience_check;
    END IF;
END $$;

-- Add the constraints
ALTER TABLE profiles 
ADD CONSTRAINT profiles_professional_title_check 
CHECK (professional_title IN (
  'Physician',
  'Pharmacist', 
  'Nurse',
  'Microbiologist',
  'Infection Preventionist',
  'Quality Improvement Specialist',
  'Administrator',
  'Researcher',
  'Other'
));

ALTER TABLE profiles 
ADD CONSTRAINT profiles_specialty_check 
CHECK (specialty IN (
  'Infectious Diseases',
  'Pharmacy',
  'Microbiology',
  'Internal Medicine',
  'Critical Care',
  'Emergency Medicine',
  'Surgery',
  'Pediatrics',
  'Infection Prevention',
  'Quality Improvement',
  'Administration',
  'Research',
  'Other'
));

ALTER TABLE profiles 
ADD CONSTRAINT profiles_stewardship_role_check 
CHECK (stewardship_role IN (
  'Antimicrobial Stewardship Program Director',
  'Antimicrobial Stewardship Pharmacist',
  'Infectious Diseases Physician',
  'Microbiology Lab Director',
  'Infection Preventionist',
  'Quality Improvement Coordinator',
  'Clinical Pharmacist',
  'Resident/Fellow',
  'Student/Trainee',
  'Administrator',
  'Other'
));

ALTER TABLE profiles 
ADD CONSTRAINT profiles_work_location_check 
CHECK (work_location IN (
  'Hospital',
  'Clinic',
  'Long-term Care Facility',
  'Outpatient Center',
  'Research Institution',
  'Government Agency',
  'Pharmaceutical Company',
  'Consulting Firm',
  'Other'
));

ALTER TABLE profiles 
ADD CONSTRAINT profiles_years_of_experience_check 
CHECK (years_of_experience IN (
  '0-1 years',
  '2-5 years',
  '6-10 years',
  '11-15 years',
  '16-20 years',
  '20+ years'
));

-- Drop the existing view first
DROP VIEW IF EXISTS user_stats;

-- Create a new user_stats view that works with the current table structure
CREATE VIEW user_stats AS
SELECT 
  p.id,
  p.email,
  p.name as full_name,
  p.role,
  p.organization as institution,
  p.department,
  p.phone_number,
  p.professional_title,
  p.specialty,
  p.years_of_experience,
  p.work_location,
  p.stewardship_role,
  p.created_at,
  COUNT(te.id) as total_entries,
  COUNT(te.id) FILTER (WHERE te.deleted_at IS NULL) as active_entries,
  COALESCE(SUM(te.minutes) FILTER (WHERE te.deleted_at IS NULL), 0) as total_minutes,
  MAX(te.created_at) as last_activity
FROM profiles p
LEFT JOIN time_entries te ON p.id = te.user_id
GROUP BY p.id, p.email, p.name, p.role, p.organization, p.department, 
         p.phone_number, p.professional_title, p.specialty, p.years_of_experience, 
         p.work_location, p.stewardship_role, p.created_at;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
