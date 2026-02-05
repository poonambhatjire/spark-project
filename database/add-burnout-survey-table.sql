-- =============================================
-- ADD BURNOUT SURVEY TABLE
-- Creates table for storing Oldenburg Burnout Inventory (OLBI) responses
-- =============================================

-- Create burnout_survey_responses table
CREATE TABLE IF NOT EXISTS burnout_survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL CHECK (question_number >= 1 AND question_number <= 12),
  response_value INTEGER NOT NULL CHECK (response_value >= 1 AND response_value <= 4),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_number)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_burnout_survey_user_id ON burnout_survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_burnout_survey_completed_at ON burnout_survey_responses(completed_at);

-- Add comment for documentation
COMMENT ON TABLE burnout_survey_responses IS 'Stores responses to the Oldenburg Burnout Inventory (OLBI) survey';
COMMENT ON COLUMN burnout_survey_responses.question_number IS 'Question number from 1 to 12';
COMMENT ON COLUMN burnout_survey_responses.response_value IS 'Response value: 1=Strongly Agree, 2=Agree, 3=Disagree, 4=Strongly Disagree';

-- Enable RLS (Row Level Security)
ALTER TABLE burnout_survey_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only see and modify their own survey responses
CREATE POLICY "Users can view their own burnout survey responses"
  ON burnout_survey_responses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own burnout survey responses"
  ON burnout_survey_responses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own burnout survey responses"
  ON burnout_survey_responses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_burnout_survey_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_burnout_survey_updated_at
  BEFORE UPDATE ON burnout_survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_burnout_survey_updated_at();
