-- =============================================
-- ADD is_telehealth COLUMN TO time_entries
-- Same table as is_typical_day - captures whether activity was tele-health
-- =============================================

ALTER TABLE time_entries
  ADD COLUMN IF NOT EXISTS is_telehealth boolean;

UPDATE time_entries
  SET is_telehealth = COALESCE(is_telehealth, false);

ALTER TABLE time_entries
  ALTER COLUMN is_telehealth SET DEFAULT false;

COMMENT ON COLUMN time_entries.is_telehealth IS 'Indicates if the activity was conducted via tele-health (true/false)';
