-- Update the time_entries table to use full descriptive names instead of abbreviations
-- This script will update the existing constraint and any existing data

-- First, let's update the constraint to allow the full descriptive names
ALTER TABLE time_entries DROP CONSTRAINT IF EXISTS time_entries_task_check;

-- Add the new constraint with full descriptive names
ALTER TABLE time_entries ADD CONSTRAINT time_entries_task_check CHECK (task IN (
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
));

-- Update any existing data to use the new format
UPDATE time_entries SET task = 'Patient Care - Prospective Audit & Feedback' WHERE task = 'PAF';
UPDATE time_entries SET task = 'Patient Care - Authorization of Restricted Antimicrobials' WHERE task = 'AUTH_RESTRICTED_ANTIMICROBIALS';
UPDATE time_entries SET task = 'Patient Care - Participating in Clinical Rounds' WHERE task = 'CLINICAL_ROUNDS';
UPDATE time_entries SET task = 'Administrative - Guidelines/EHR' WHERE task = 'GUIDELINES_EHR';
UPDATE time_entries SET task = 'Tracking - AMU' WHERE task = 'AMU';
UPDATE time_entries SET task = 'Tracking - AMR' WHERE task = 'AMR';
UPDATE time_entries SET task = 'Tracking - Antibiotic Appropriateness' WHERE task = 'ANTIBIOTIC_APPROPRIATENESS';
UPDATE time_entries SET task = 'Tracking - Intervention Acceptance' WHERE task = 'INTERVENTION_ACCEPTANCE';
UPDATE time_entries SET task = 'Reporting - sharing data with prescribers/decision makers' WHERE task = 'SHARING_DATA';
UPDATE time_entries SET task = 'Education - Providing Education' WHERE task = 'PROVIDING_EDUCATION';
UPDATE time_entries SET task = 'Education - Receiving Education (e.g. CE)' WHERE task = 'RECEIVING_EDUCATION';
UPDATE time_entries SET task = 'Administrative - Committee Work' WHERE task = 'COMMITTEE_WORK';
UPDATE time_entries SET task = 'Administrative - QI projects/research' WHERE task = 'QI_PROJECTS_RESEARCH';
UPDATE time_entries SET task = 'Administrative - Emails' WHERE task = 'EMAILS';
UPDATE time_entries SET task = 'Other - specify in comments' WHERE task = 'OTHER';

-- Verify the changes
SELECT DISTINCT task FROM time_entries ORDER BY task;
