-- =============================================
-- UPDATE TASK CONSTRAINT FOR TIME ENTRIES
-- Updates the check constraint to include new task names
-- Replaces AMU/AMR with full names and adds new "Other" options
-- =============================================

-- STEP 1: Drop the existing constraint FIRST
-- This allows us to update data without constraint violations
ALTER TABLE time_entries 
DROP CONSTRAINT IF EXISTS time_entries_task_check;

-- STEP 2: Update existing rows with old task names to new names
-- Update Tracking - AMU to Tracking - Antimicrobial Use
UPDATE time_entries
SET task = 'Tracking - Antimicrobial Use'
WHERE task = 'Tracking - AMU';

-- Update Tracking - AMR to Tracking - Antimicrobial Resistance
UPDATE time_entries
SET task = 'Tracking - Antimicrobial Resistance'
WHERE task = 'Tracking - AMR';

-- Handle old "Other - specify in comments" - migrate to "Administrative - Other"
-- (This is a reasonable default since we don't know the original category)
UPDATE time_entries
SET task = 'Administrative - Other (please specify under comment section)'
WHERE task = 'Other - specify in comments';

-- Show summary of updates
DO $$
DECLARE
  amu_count INTEGER;
  amr_count INTEGER;
  other_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO amu_count FROM time_entries WHERE task = 'Tracking - AMU';
  SELECT COUNT(*) INTO amr_count FROM time_entries WHERE task = 'Tracking - AMR';
  SELECT COUNT(*) INTO other_count FROM time_entries WHERE task = 'Other - specify in comments';
  
  RAISE NOTICE 'Migration summary:';
  RAISE NOTICE '  Remaining AMU entries: %', amu_count;
  RAISE NOTICE '  Remaining AMR entries: %', amr_count;
  RAISE NOTICE '  Old "Other" entries: %', other_count;
  
  IF other_count > 0 THEN
    RAISE WARNING 'Found % entries with old "Other - specify in comments". These need manual review.', other_count;
  END IF;
END $$;

-- STEP 3: Recreate the constraint with all current task names
ALTER TABLE time_entries 
ADD CONSTRAINT time_entries_task_check 
CHECK (task IN (
  -- Patient Care
  'Patient Care - Prospective Audit & Feedback',
  'Patient Care - Authorization of Restricted Antimicrobials',
  'Patient Care - Participating in Clinical Rounds',
  'Patient Care - Curbside ASP Questions',
  'Patient Care - ASP Rounds (including "handshake" ASP)',
  'Patient Care - Other (please specify under comment section)',
  -- Administrative
  'Administrative - Guidelines/EHR',
  'Administrative - Committee Work',
  'Administrative - QI projects/research',
  'Administrative - Emails',
  'Administrative - Other (please specify under comment section)',
  -- Tracking
  'Tracking - Antimicrobial Use',
  'Tracking - Antimicrobial Resistance',
  'Tracking - Antibiotic Appropriateness',
  'Tracking - Intervention Acceptance',
  'Tracking - Other (please specify under comment section)',
  -- Reporting
  'Reporting - sharing data with prescribers/decision makers',
  'Reporting - Other (please specify under comment section)',
  -- Education
  'Education - Providing Education',
  'Education - Receiving Education (e.g. CE)',
  'Education - Other (please specify under comment section)'
));

-- Verify the constraint was created
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'time_entries_task_check'
  ) THEN
    RAISE NOTICE 'Constraint time_entries_task_check updated successfully';
  ELSE
    RAISE EXCEPTION 'Failed to create constraint time_entries_task_check';
  END IF;
END $$;

