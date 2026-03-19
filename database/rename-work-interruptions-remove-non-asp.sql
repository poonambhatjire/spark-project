-- =============================================
-- RENAME: Work Interruptions/ Miscellaneous/ Non-ASP time -> Work Interruptions/ Miscellaneous
-- =============================================

-- 1. Drop constraint first
ALTER TABLE time_entries DROP CONSTRAINT IF EXISTS time_entries_task_check;

-- 2. Update existing time_entries
UPDATE time_entries
SET task = 'Work Interruptions/ Miscellaneous'
WHERE task = 'Work Interruptions/ Miscellaneous/ Non-ASP time';

-- 3. Update activities table
UPDATE activities
SET name = 'Work Interruptions/ Miscellaneous'
WHERE name = 'Work Interruptions/ Miscellaneous/ Non-ASP time';

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
  'Work Interruptions/ Miscellaneous'
));
