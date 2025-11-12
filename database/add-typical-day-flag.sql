-- =============================================
-- ADD TYPICAL DAY FLAG TO TIME ENTRIES
-- Adds is_typical_day column to capture whether an entry reflects a typical day
-- =============================================

ALTER TABLE time_entries
  ADD COLUMN IF NOT EXISTS is_typical_day boolean;

UPDATE time_entries
  SET is_typical_day = COALESCE(is_typical_day, true);

ALTER TABLE time_entries
  ALTER COLUMN is_typical_day SET DEFAULT true,
  ALTER COLUMN is_typical_day SET NOT NULL;

COMMENT ON COLUMN time_entries.is_typical_day IS 'Indicates if the time entry reflects a typical day (true/false)';


