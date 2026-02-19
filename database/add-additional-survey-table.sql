-- =============================================
-- ADDITIONAL SURVEY (TIME-IN-MOTION STUDY)
-- Creates table for Time-in-motion Study additional survey items
-- =============================================

CREATE TABLE IF NOT EXISTS additional_survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- Q1: Licensed beds
  licensed_beds INTEGER CHECK (licensed_beds IS NULL OR licensed_beds >= 0),
  -- Q2: Occupied beds - either exact count OR percentage
  occupied_beds_count INTEGER CHECK (occupied_beds_count IS NULL OR occupied_beds_count >= 0),
  occupied_beds_percent NUMERIC(5,2) CHECK (occupied_beds_percent IS NULL OR (occupied_beds_percent >= 0 AND occupied_beds_percent <= 100)),
  -- Q3: ICU beds
  icu_beds INTEGER CHECK (icu_beds IS NULL OR icu_beds >= 0),
  -- Q4: Current ASP FTE (0-1)
  asp_fte NUMERIC(4,2) CHECK (asp_fte IS NULL OR (asp_fte >= 0 AND asp_fte <= 1)),
  -- Q5: Total FTEs by position
  pharmacist_fte NUMERIC(6,2) CHECK (pharmacist_fte IS NULL OR pharmacist_fte >= 0),
  physician_fte NUMERIC(6,2) CHECK (physician_fte IS NULL OR physician_fte >= 0),
  other1_specify TEXT,
  other1_fte NUMERIC(6,2) CHECK (other1_fte IS NULL OR other1_fte >= 0),
  other2_specify TEXT,
  other2_fte NUMERIC(6,2) CHECK (other2_fte IS NULL OR other2_fte >= 0),
  other3_specify TEXT,
  other3_fte NUMERIC(6,2) CHECK (other3_fte IS NULL OR other3_fte >= 0),
  -- Q6: SAAR / antibacterial use
  saar_value NUMERIC(8,2),
  saar_category TEXT,
  -- Q7: Demonstrated effectiveness (stored as JSONB array)
  effectiveness_options JSONB DEFAULT '[]',
  effectiveness_other TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_additional_survey_user_id ON additional_survey_responses(user_id);

COMMENT ON TABLE additional_survey_responses IS 'Time-in-motion Study: Additional survey items';

ALTER TABLE additional_survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own additional survey responses"
  ON additional_survey_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own additional survey responses"
  ON additional_survey_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own additional survey responses"
  ON additional_survey_responses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_additional_survey_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_additional_survey_updated_at
  BEFORE UPDATE ON additional_survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_additional_survey_updated_at();
