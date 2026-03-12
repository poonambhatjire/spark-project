-- =============================================
-- RENAME TASK: Education - Providing Education -> Education - Providing Education/Teaching
-- =============================================

-- 1. Drop constraint first (so UPDATE can use new value)
ALTER TABLE time_entries DROP CONSTRAINT IF EXISTS time_entries_task_check;

-- 2. Update existing time_entries to use new task name
UPDATE time_entries
SET task = 'Education - Providing Education/Teaching'
WHERE task = 'Education - Providing Education';

-- 3. Update activities table
UPDATE activities
SET name = 'Education - Providing Education/Teaching'
WHERE name = 'Education - Providing Education';

-- 4. Recreate constraint with new value

ALTER TABLE time_entries ADD CONSTRAINT time_entries_task_check CHECK (task IN (
  'Patient Care - Prospective Audit & Feedback',
  'Patient Care - Authorization of Restricted Antimicrobials',
  'Patient Care - Participating in Clinical Rounds',
  'Patient Care - Curbside ASP Questions',
  'Patient Care - ASP Rounds (including "handshake" ASP)',
  'Patient Care - Other (please specify under comment section)',
  'Administrative - Guidelines/EHR',
  'Administrative - Committee Work',
  'Administrative - QI projects/research',
  'Administrative - Emails',
  'Administrative - Other (please specify under comment section)',
  'Tracking - Antimicrobial Use',
  'Tracking - Antimicrobial Resistance',
  'Tracking - Antibiotic Appropriateness',
  'Tracking - Intervention Acceptance',
  'Tracking - Other (please specify under comment section)',
  'Reporting - sharing data with prescribers/decision makers',
  'Reporting - Other (please specify under comment section)',
  'Education - Providing Education/Teaching',
  'Education - Receiving Education (e.g. CE)',
  'Education - Other (please specify under comment section)',
  'Work Interruptions/ Miscellaneous/ Non-ASP time'
));
