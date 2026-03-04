-- =============================================
-- ADD ENDED_AT COLUMN TO TIME_ENTRIES
-- Computed as: occurred_on + minutes
-- Enables querying/filtering by end time
-- =============================================

-- Add column (not generated - PostgreSQL rejects interval math as immutable)
ALTER TABLE time_entries
ADD COLUMN IF NOT EXISTS ended_at timestamp with time zone;

-- Trigger function: set ended_at = occurred_on + (minutes || ' minutes')::interval
CREATE OR REPLACE FUNCTION time_entries_set_ended_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ended_at := NEW.occurred_on + (NEW.minutes || ' minutes')::interval;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists (for re-running migration)
DROP TRIGGER IF EXISTS trg_time_entries_set_ended_at ON time_entries;

-- Create trigger
CREATE TRIGGER trg_time_entries_set_ended_at
  BEFORE INSERT OR UPDATE OF occurred_on, minutes
  ON time_entries
  FOR EACH ROW
  EXECUTE PROCEDURE time_entries_set_ended_at();

-- Backfill existing rows
UPDATE time_entries SET ended_at = occurred_on + (minutes || ' minutes')::interval WHERE ended_at IS NULL;

-- Add indexes for end-time range queries
CREATE INDEX IF NOT EXISTS idx_time_entries_ended_at
ON time_entries (ended_at);

CREATE INDEX IF NOT EXISTS idx_time_entries_user_ended_at
ON time_entries (user_id, ended_at);

COMMENT ON COLUMN time_entries.ended_at IS 'Computed: occurred_on + minutes. End date/time of the activity.';
