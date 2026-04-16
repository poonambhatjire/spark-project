-- Hospital service offerings (profile / additional survey), after ICU beds question
ALTER TABLE additional_survey_responses
ADD COLUMN IF NOT EXISTS hospital_services JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN additional_survey_responses.hospital_services IS
  'Selected hospital services: level1_trauma, burn_unit, solid_organ_transplant, bone_marrow_transplant, none (JSON array of strings)';
