-- =============================================
-- ADD telehealth_asp COLUMN (before SAAR)
-- Question: Considering your hospital, what is your utilization of telehealth services for your ASP?
-- Options: provides, receives, none
-- =============================================

ALTER TABLE additional_survey_responses
ADD COLUMN IF NOT EXISTS telehealth_asp TEXT;

COMMENT ON COLUMN additional_survey_responses.telehealth_asp IS 'Telehealth ASP utilization: provides, receives, or none';
