-- =============================================
-- UPDATED SAMPLE DATA GENERATION SCRIPT
-- Creates 20 diverse users with realistic activities for testing
-- Based on actual database schema analysis
-- =============================================

-- Note: This script creates sample data for testing purposes
-- All sample users have email addresses ending with @sample-test.com
-- This makes them easy to identify and remove later

-- =============================================
-- STEP 1: CREATE USERS IN AUTH.USERS TABLE
-- =============================================

-- Insert sample users into auth.users table with proper schema
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  is_sso_user,
  is_anonymous,
  phone,
  phone_change,
  phone_change_token,
  email_change_token_current,
  email_change_confirm_status,
  reauthentication_token
) VALUES 
-- Admin Users
(
  '627082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin.sample@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '6 months',
  NOW() - INTERVAL '6 months',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  '727082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'pharmacist.admin@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '5 months',
  NOW() - INTERVAL '5 months',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  '827082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'nurse.admin@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '4 months',
  NOW() - INTERVAL '4 months',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),

-- Regular Users - Physicians
(
  '927082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'dr.williams@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '3 months',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  'a27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'dr.brown@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '3 months',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  'b27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'dr.davis@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '2 months',
  NOW() - INTERVAL '2 months',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),

-- Regular Users - Pharmacists
(
  'c27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'pharm.garcia@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '2 months',
  NOW() - INTERVAL '2 months',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  'd27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'pharm.wilson@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '2 months',
  NOW() - INTERVAL '2 months',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  'e27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'pharm.anderson@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '1 month',
  NOW() - INTERVAL '1 month',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),

-- Regular Users - Nurses
(
  'f27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'nurse.taylor@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '1 month',
  NOW() - INTERVAL '1 month',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  '127082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'nurse.thomas@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '1 month',
  NOW() - INTERVAL '1 month',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  '227082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'nurse.jackson@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '3 weeks',
  NOW() - INTERVAL '3 weeks',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),

-- Regular Users - Other Healthcare Professionals
(
  '327082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'micro.white@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '3 weeks',
  NOW() - INTERVAL '3 weeks',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  '427082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'epidem.harris@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '2 weeks',
  NOW() - INTERVAL '2 weeks',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  '527082d3-b9c5-48c3-b7b7-36ccf65bd423',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'pharm.martin@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '2 weeks',
  NOW() - INTERVAL '2 weeks',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  '627082d3-b9c5-48c3-b7b7-36ccf65bd424',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'nurse.garcia@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '1 week',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  '727082d3-b9c5-48c3-b7b7-36ccf65bd424',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'pharm.rodriguez@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '1 week',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  '827082d3-b9c5-48c3-b7b7-36ccf65bd424',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'nurse.lee@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  '927082d3-b9c5-48c3-b7b7-36ccf65bd424',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'dr.clark@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
),
(
  'a27082d3-b9c5-48c3-b7b7-36ccf65bd424',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'pharm.lewis@sample-test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day',
  false,
  false,
  NULL,
  '',
  '',
  '',
  0,
  ''
);

-- =============================================
-- STEP 2: CREATE PROFILES IN PUBLIC SCHEMA
-- =============================================

-- Insert corresponding profiles with all required fields
INSERT INTO profiles (
  id,
  email,
  name,
  role,
  organization,
  department,
  phone_number,
  professional_title,
  specialty,
  years_of_experience,
  license_number,
  work_location,
  stewardship_role,
  certification_status,
  time_zone,
  manager,
  team,
  notes,
  is_active,
  created_at
) VALUES 
-- Admin Users
(
  '627082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'admin.sample@sample-test.com',
  'Dr. Sarah Johnson',
  'admin',
  'Metro General Hospital',
  'Infectious Diseases',
  '+1-555-0101',
  'Physician',
  'Infectious Diseases',
  '20+ years',
  'MD123456',
  'Hospital',
  'Antimicrobial Stewardship Program Director',
  'Board Certified',
  'EST',
  NULL,
  'Stewardship Leadership',
  'Sample admin for testing',
  true,
  NOW() - INTERVAL '6 months'
),
(
  '727082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'pharmacist.admin@sample-test.com',
  'Dr. Michael Chen',
  'admin',
  'City Medical Center',
  'Pharmacy',
  '+1-555-0102',
  'Pharmacist',
  'Pharmacy',
  '11-15 years',
  'RPh789012',
  'Hospital',
  'Antimicrobial Stewardship Pharmacist',
  'BCPS',
  'PST',
  'Dr. Sarah Johnson',
  'Pharmacy Team',
  'Sample admin pharmacist',
  true,
  NOW() - INTERVAL '5 months'
),
(
  '827082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'nurse.admin@sample-test.com',
  'Jennifer Martinez',
  'admin',
  'Regional Health System',
  'Infection Prevention',
  '+1-555-0103',
  'Infection Preventionist',
  'Infection Prevention',
  '11-15 years',
  'RN345678',
  'Hospital',
  'Infection Preventionist',
  'CIC',
  'CST',
  'Dr. Sarah Johnson',
  'Infection Prevention',
  'Sample admin nurse',
  true,
  NOW() - INTERVAL '4 months'
),

-- Regular Users - Physicians
(
  '927082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'dr.williams@sample-test.com',
  'Dr. Robert Williams',
  'user',
  'Metro General Hospital',
  'Internal Medicine',
  '+1-555-0104',
  'Physician',
  'Internal Medicine',
  '6-10 years',
  'MD901234',
  'Hospital',
  'Infectious Diseases Physician',
  'Board Certified',
  'EST',
  'Dr. Sarah Johnson',
  'Internal Medicine',
  'Sample physician user',
  true,
  NOW() - INTERVAL '3 months'
),
(
  'a27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'dr.brown@sample-test.com',
  'Dr. Emily Brown',
  'user',
  'City Medical Center',
  'Emergency Medicine',
  '+1-555-0105',
  'Physician',
  'Emergency Medicine',
  '2-5 years',
  'MD567890',
  'Hospital',
  'Infectious Diseases Physician',
  'Board Certified',
  'PST',
  'Dr. Michael Chen',
  'Emergency Department',
  'Sample emergency physician',
  true,
  NOW() - INTERVAL '3 months'
),
(
  'b27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'dr.davis@sample-test.com',
  'Dr. James Davis',
  'user',
  'Regional Health System',
  'Surgery',
  '+1-555-0106',
  'Physician',
  'Surgery',
  '11-15 years',
  'MD234567',
  'Hospital',
  'Infectious Diseases Physician',
  'Board Certified',
  'CST',
  'Dr. Sarah Johnson',
  'Surgical Team',
  'Sample surgeon',
  true,
  NOW() - INTERVAL '2 months'
),

-- Regular Users - Pharmacists
(
  'c27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'pharm.garcia@sample-test.com',
  'Dr. Maria Garcia',
  'user',
  'Metro General Hospital',
  'Pharmacy',
  '+1-555-0107',
  'Pharmacist',
  'Pharmacy',
  '6-10 years',
  'RPh890123',
  'Hospital',
  'Clinical Pharmacist',
  'BCPS',
  'EST',
  'Dr. Michael Chen',
  'Pharmacy Team',
  'Sample clinical pharmacist',
  true,
  NOW() - INTERVAL '2 months'
),
(
  'd27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'pharm.wilson@sample-test.com',
  'Dr. David Wilson',
  'user',
  'City Medical Center',
  'Pharmacy',
  '+1-555-0108',
  'Pharmacist',
  'Pharmacy',
  '2-5 years',
  'RPh456789',
  'Hospital',
  'Clinical Pharmacist',
  'BCPS',
  'PST',
  'Dr. Michael Chen',
  'Pharmacy Team',
  'Sample staff pharmacist',
  true,
  NOW() - INTERVAL '2 months'
),
(
  'e27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'pharm.anderson@sample-test.com',
  'Dr. Lisa Anderson',
  'user',
  'Regional Health System',
  'Pharmacy',
  '+1-555-0109',
  'Pharmacist',
  'Pharmacy',
  '11-15 years',
  'RPh012345',
  'Hospital',
  'Clinical Pharmacist',
  'BCPS',
  'CST',
  'Dr. Michael Chen',
  'Pharmacy Team',
  'Sample senior pharmacist',
  true,
  NOW() - INTERVAL '1 month'
),

-- Regular Users - Nurses
(
  'f27082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'nurse.taylor@sample-test.com',
  'Patricia Taylor',
  'user',
  'Metro General Hospital',
  'ICU',
  '+1-555-0110',
  'Nurse',
  'Critical Care',
  '6-10 years',
  'RN678901',
  'Hospital',
  'Infection Preventionist',
  'CCRN',
  'EST',
  'Jennifer Martinez',
  'ICU Team',
  'Sample ICU nurse',
  true,
  NOW() - INTERVAL '1 month'
),
(
  '127082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'nurse.thomas@sample-test.com',
  'Christopher Thomas',
  'user',
  'City Medical Center',
  'Medical-Surgical',
  '+1-555-0111',
  'Nurse',
  'Critical Care',
  '2-5 years',
  'RN234567',
  'Hospital',
  'Infection Preventionist',
  'RN',
  'PST',
  'Jennifer Martinez',
  'Med-Surg Team',
  'Sample med-surg nurse',
  true,
  NOW() - INTERVAL '1 month'
),
(
  '227082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'nurse.jackson@sample-test.com',
  'Amanda Jackson',
  'user',
  'Regional Health System',
  'Infection Prevention',
  '+1-555-0112',
  'Infection Preventionist',
  'Infection Prevention',
  '11-15 years',
  'RN890123',
  'Hospital',
  'Infection Preventionist',
  'CIC',
  'CST',
  'Jennifer Martinez',
  'Infection Prevention',
  'Sample infection prevention nurse',
  true,
  NOW() - INTERVAL '3 weeks'
),

-- Regular Users - Other Healthcare Professionals
(
  '327082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'micro.white@sample-test.com',
  'Dr. Kevin White',
  'user',
  'Metro General Hospital',
  'Microbiology',
  '+1-555-0113',
  'Microbiologist',
  'Microbiology',
  '11-15 years',
  'MD456789',
  'Hospital',
  'Microbiology Lab Director',
  'Board Certified',
  'EST',
  'Dr. Sarah Johnson',
  'Laboratory',
  'Sample microbiologist',
  true,
  NOW() - INTERVAL '3 weeks'
),
(
  '427082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'epidem.harris@sample-test.com',
  'Dr. Rachel Harris',
  'user',
  'City Medical Center',
  'Epidemiology',
  '+1-555-0114',
  'Researcher',
  'Research',
  '6-10 years',
  'MD012345',
  'Research Institution',
  'Quality Improvement Coordinator',
  'Board Certified',
  'PST',
  'Dr. Sarah Johnson',
  'Public Health',
  'Sample epidemiologist',
  true,
  NOW() - INTERVAL '2 weeks'
),
(
  '527082d3-b9c5-48c3-b7b7-36ccf65bd423',
  'pharm.martin@sample-test.com',
  'Dr. Steven Martin',
  'user',
  'Regional Health System',
  'Pharmacy',
  '+1-555-0115',
  'Pharmacist',
  'Pharmacy',
  '2-5 years',
  'RPh567890',
  'Hospital',
  'Resident/Fellow',
  'In Training',
  'CST',
  'Dr. Michael Chen',
  'Pharmacy Team',
  'Sample resident pharmacist',
  true,
  NOW() - INTERVAL '2 weeks'
),
(
  '627082d3-b9c5-48c3-b7b7-36ccf65bd424',
  'nurse.garcia@sample-test.com',
  'Sofia Garcia',
  'user',
  'Metro General Hospital',
  'Emergency Department',
  '+1-555-0116',
  'Nurse',
  'Emergency Medicine',
  '6-10 years',
  'RN345678',
  'Hospital',
  'Infection Preventionist',
  'CEN',
  'EST',
  'Jennifer Martinez',
  'Emergency Department',
  'Sample ED nurse',
  true,
  NOW() - INTERVAL '1 week'
),
(
  '727082d3-b9c5-48c3-b7b7-36ccf65bd424',
  'pharm.rodriguez@sample-test.com',
  'Dr. Carlos Rodriguez',
  'user',
  'City Medical Center',
  'Pharmacy',
  '+1-555-0117',
  'Pharmacist',
  'Pharmacy',
  '11-15 years',
  'RPh901234',
  'Hospital',
  'Clinical Pharmacist',
  'BCPS',
  'PST',
  'Dr. Michael Chen',
  'Pharmacy Team',
  'Sample clinical pharmacist',
  true,
  NOW() - INTERVAL '1 week'
),
(
  '827082d3-b9c5-48c3-b7b7-36ccf65bd424',
  'nurse.lee@sample-test.com',
  'Michelle Lee',
  'user',
  'Regional Health System',
  'Surgery',
  '+1-555-0118',
  'Nurse',
  'Surgery',
  '2-5 years',
  'RN789012',
  'Hospital',
  'Infection Preventionist',
  'CNOR',
  'CST',
  'Jennifer Martinez',
  'Surgical Team',
  'Sample OR nurse',
  true,
  NOW() - INTERVAL '5 days'
),
(
  '927082d3-b9c5-48c3-b7b7-36ccf65bd424',
  'dr.clark@sample-test.com',
  'Dr. Jennifer Clark',
  'user',
  'Metro General Hospital',
  'Pediatrics',
  '+1-555-0119',
  'Physician',
  'Pediatrics',
  '6-10 years',
  'MD345678',
  'Hospital',
  'Infectious Diseases Physician',
  'Board Certified',
  'EST',
  'Dr. Sarah Johnson',
  'Pediatrics Team',
  'Sample pediatrician',
  true,
  NOW() - INTERVAL '3 days'
),
(
  'a27082d3-b9c5-48c3-b7b7-36ccf65bd424',
  'pharm.lewis@sample-test.com',
  'Dr. Thomas Lewis',
  'user',
  'City Medical Center',
  'Pharmacy',
  '+1-555-0120',
  'Pharmacist',
  'Pharmacy',
  '16-20 years',
  'RPh678901',
  'Hospital',
  'Clinical Pharmacist',
  'BCPS',
  'PST',
  'Dr. Michael Chen',
  'Pharmacy Team',
  'Sample senior clinical pharmacist',
  true,
  NOW() - INTERVAL '1 day'
);

-- =============================================
-- STEP 3: CREATE SAMPLE TIME ENTRIES
-- =============================================

-- Function to generate random time entries for a user
DO $$
DECLARE
    user_record RECORD;
    entry_date DATE;
    task_options TEXT[] := ARRAY[
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
    ];
    comment_options TEXT[] := ARRAY[
        'Routine audit of antibiotic prescriptions',
        'Reviewed patient chart for appropriate antibiotic use',
        'Provided feedback to prescriber',
        'Authorized restricted antibiotic for patient',
        'Participated in multidisciplinary rounds',
        'Updated clinical guidelines',
        'Tracked antimicrobial usage data',
        'Monitored resistance patterns',
        'Assessed intervention effectiveness',
        'Prepared monthly report',
        'Conducted staff education session',
        'Attended continuing education webinar',
        'Stewardship committee meeting',
        'Quality improvement project work',
        'Responded to stewardship emails',
        'Custom intervention for specific case'
    ];
    random_task TEXT;
    random_comment TEXT;
    random_minutes INTEGER;
    days_back INTEGER;
    entries_per_day INTEGER;
    i INTEGER;
BEGIN
    -- Loop through each user
    FOR user_record IN SELECT id, email, name, role, professional_title FROM profiles WHERE email LIKE '%@sample-test.com' LOOP
        -- Generate entries for the last 90 days
        FOR days_back IN 0..89 LOOP
            entry_date := CURRENT_DATE - INTERVAL '1 day' * days_back;
            
            -- Skip weekends for most users (some healthcare workers work weekends)
            IF EXTRACT(DOW FROM entry_date) IN (0, 6) AND user_record.role = 'user' THEN
                -- 30% chance of weekend work for regular users
                IF random() > 0.3 THEN
                    CONTINUE;
                END IF;
            END IF;
            
            -- Determine number of entries per day based on role and profession
            entries_per_day := 0;
            
            IF user_record.role = 'admin' THEN
                entries_per_day := CASE WHEN random() < 0.7 THEN 2 + floor(random() * 3) ELSE 0 END;
            ELSIF user_record.professional_title = 'Physician' THEN
                entries_per_day := CASE WHEN random() < 0.6 THEN 1 + floor(random() * 3) ELSE 0 END;
            ELSIF user_record.professional_title = 'Pharmacist' THEN
                entries_per_day := CASE WHEN random() < 0.8 THEN 2 + floor(random() * 4) ELSE 0 END;
            ELSIF user_record.professional_title = 'Nurse' THEN
                entries_per_day := CASE WHEN random() < 0.5 THEN 1 + floor(random() * 2) ELSE 0 END;
            ELSE
                entries_per_day := CASE WHEN random() < 0.4 THEN 1 + floor(random() * 2) ELSE 0 END;
            END IF;
            
            -- Create entries for this day
            FOR i IN 1..entries_per_day LOOP
                random_task := task_options[1 + floor(random() * array_length(task_options, 1))];
                random_comment := comment_options[1 + floor(random() * array_length(comment_options, 1))];
                random_minutes := 15 + floor(random() * 120); -- 15-135 minutes
                
                -- Adjust minutes based on task type
                IF random_task LIKE '%Prospective Audit%' THEN
                    random_minutes := 10 + floor(random() * 30); -- 10-40 minutes
                ELSIF random_task LIKE '%Clinical Rounds%' THEN
                    random_minutes := 30 + floor(random() * 60); -- 30-90 minutes
                ELSIF random_task LIKE '%Education%' THEN
                    random_minutes := 45 + floor(random() * 75); -- 45-120 minutes
                ELSIF random_task LIKE '%Committee Work%' THEN
                    random_minutes := 60 + floor(random() * 60); -- 60-120 minutes
                END IF;
                
                -- Insert the time entry
                INSERT INTO time_entries (
                    id,
                    user_id,
                    task,
                    minutes,
                    occurred_on,
                    comment,
                    created_at,
                    updated_at
                ) VALUES (
                    gen_random_uuid(),
                    user_record.id,
                    random_task,
                    random_minutes,
                    entry_date,
                    random_comment,
                    entry_date + (random() * INTERVAL '1 day'),
                    entry_date + (random() * INTERVAL '1 day')
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- =============================================
-- STEP 4: CREATE SAMPLE CONTACT SUBMISSIONS
-- =============================================

INSERT INTO contact_submissions (
    id,
    first_name,
    last_name,
    email,
    organization,
    subject,
    message,
    created_at
) VALUES 
(
    gen_random_uuid(),
    'Dr. Sample',
    'Contact',
    'contact1@sample-test.com',
    'Sample Hospital',
    'Interest in SPARC Calculator Implementation',
    'Interested in learning more about SPARC Calculator for our institution.',
    NOW() - INTERVAL '2 weeks'
),
(
    gen_random_uuid(),
    'Nurse Sample',
    'Contact',
    'contact2@sample-test.com',
    'Sample Medical Center',
    'Stewardship Program Implementation Inquiry',
    'Would like to implement this tool in our stewardship program.',
    NOW() - INTERVAL '1 week'
),
(
    gen_random_uuid(),
    'Pharmacist Sample',
    'Contact',
    'contact3@sample-test.com',
    'Sample Health System',
    'Pricing and Implementation Information Request',
    'Need more information about pricing and implementation.',
    NOW() - INTERVAL '3 days'
);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Display summary of created data
SELECT 
    'Sample Users Created' as category,
    COUNT(*) as count
FROM profiles 
WHERE email LIKE '%@sample-test.com'

UNION ALL

SELECT 
    'Sample Time Entries Created' as category,
    COUNT(*) as count
FROM time_entries te
JOIN profiles p ON te.user_id = p.id
WHERE p.email LIKE '%@sample-test.com'

UNION ALL

SELECT 
    'Sample Contact Submissions Created' as category,
    COUNT(*) as count
FROM contact_submissions
WHERE email LIKE '%@sample-test.com';

-- Display user breakdown by role
SELECT 
    role,
    COUNT(*) as user_count
FROM profiles 
WHERE email LIKE '%@sample-test.com'
GROUP BY role;

-- Display activity breakdown by task type
SELECT 
    task,
    COUNT(*) as entry_count,
    SUM(minutes) as total_minutes
FROM time_entries te
JOIN profiles p ON te.user_id = p.id
WHERE p.email LIKE '%@sample-test.com'
GROUP BY task
ORDER BY entry_count DESC;
