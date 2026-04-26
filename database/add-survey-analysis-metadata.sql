-- Clarify optional survey answers for analysis.
-- NULL means unanswered; explicit selections (including ["none"]) mean answered.

ALTER TABLE additional_survey_responses
ADD COLUMN IF NOT EXISTS profile_survey_submitted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE additional_survey_responses
ALTER COLUMN hospital_services DROP DEFAULT;

ALTER TABLE additional_survey_responses
ALTER COLUMN effectiveness_options DROP DEFAULT;

UPDATE additional_survey_responses
SET hospital_services = NULL
WHERE hospital_services = '[]'::jsonb;

UPDATE additional_survey_responses
SET effectiveness_options = NULL
WHERE effectiveness_options = '[]'::jsonb;

UPDATE additional_survey_responses
SET profile_survey_submitted_at = updated_at
WHERE profile_survey_submitted_at IS NULL;

COMMENT ON COLUMN additional_survey_responses.profile_survey_submitted_at IS
  'Timestamp of the latest profile/additional survey submission. Optional fields may still be NULL.';

COMMENT ON COLUMN additional_survey_responses.hospital_services IS
  'Selected hospital services. NULL = unanswered; ["none"] = user explicitly selected none of the above.';

COMMENT ON COLUMN additional_survey_responses.effectiveness_options IS
  'Selected demonstrated effectiveness options. NULL = unanswered; ["none"] = user explicitly selected none of the above.';
