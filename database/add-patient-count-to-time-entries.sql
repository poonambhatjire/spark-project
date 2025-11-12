-- =============================================
-- ADD PATIENT COUNT TO TIME ENTRIES
-- Adds patient_count column for capturing number of patients served
-- =============================================

-- Add patient_count column
ALTER TABLE time_entries
  ADD COLUMN IF NOT EXISTS patient_count integer CHECK (patient_count IS NULL OR patient_count >= 0);

-- Optional: comment for clarity
COMMENT ON COLUMN time_entries.patient_count IS 'Number of patients associated with the time entry (patient care tasks)';


