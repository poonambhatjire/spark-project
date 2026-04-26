-- Analysis-oriented views. These do not replace raw tables; they provide stable
-- user-level and logged-item datasets for exports and external BI tools.

CREATE OR REPLACE VIEW analysis_logged_items AS
SELECT
  te.id AS logged_item_id,
  te.user_id,
  p.name AS user_name,
  p.email AS user_email,
  p.title AS profile_job_title,
  p.experience_level AS profile_experience_level,
  p.institution AS profile_institution_text,
  p.institution_id AS profile_institution_id,
  i.name AS profile_institution_id_name,
  (p.institution_id IS NOT NULL AND i.name IS NOT NULL AND p.institution IS DISTINCT FROM i.name) AS institution_mismatch,
  te.task,
  te.other_task,
  te.activity_id,
  a.name AS activity_name,
  ac.name AS activity_category,
  te.minutes,
  te.occurred_on,
  te.ended_at,
  te.patient_count,
  te.is_typical_day,
  te.is_telehealth,
  te.comment,
  te.deleted_at,
  te.created_at,
  te.updated_at,
  asr.profile_survey_submitted_at,
  (asr.id IS NOT NULL) AS has_additional_survey,
  asr.licensed_beds,
  asr.occupied_beds_count,
  asr.occupied_beds_percent,
  asr.icu_beds,
  (jsonb_array_length(COALESCE(asr.hospital_services, '[]'::jsonb)) > 0) AS hospital_services_answered,
  asr.hospital_services,
  asr.asp_fte,
  asr.pharmacist_fte,
  asr.physician_fte,
  asr.other1_specify,
  asr.other1_fte,
  asr.other2_specify,
  asr.other2_fte,
  asr.other3_specify,
  asr.other3_fte,
  (asr.telehealth_asp IS NOT NULL) AS telehealth_asp_answered,
  asr.telehealth_asp,
  (asr.saar_value IS NOT NULL OR asr.saar_category IS NOT NULL) AS saar_answered,
  asr.saar_value,
  asr.saar_category,
  (jsonb_array_length(COALESCE(asr.effectiveness_options, '[]'::jsonb)) > 0) AS effectiveness_answered,
  asr.effectiveness_options,
  asr.effectiveness_other
FROM time_entries te
LEFT JOIN profiles p ON p.id = te.user_id
LEFT JOIN institutions i ON i.id = p.institution_id
LEFT JOIN activities a ON a.id = te.activity_id
LEFT JOIN activity_categories ac ON ac.id = a.category_id
LEFT JOIN additional_survey_responses asr ON asr.user_id = te.user_id;

CREATE OR REPLACE VIEW analysis_burnout_scores AS
WITH scored AS (
  SELECT
    b.user_id,
    b.question_number,
    b.response_value,
    CASE
      WHEN b.question_number IN (1, 5, 7, 10) THEN 5 - b.response_value
      ELSE b.response_value
    END AS scored_value,
    b.completed_at
  FROM burnout_survey_responses b
),
aggregated AS (
  SELECT
    user_id,
    COUNT(*) AS answers,
    SUM(scored_value) FILTER (WHERE question_number IN (2, 4, 5, 8, 10, 12)) AS exhaustion_score,
    SUM(scored_value) FILTER (WHERE question_number IN (1, 3, 6, 7, 9, 11)) AS disengagement_score,
    ROUND(AVG(scored_value) FILTER (WHERE question_number IN (2, 4, 5, 8, 10, 12)), 2) AS exhaustion_average,
    ROUND(AVG(scored_value) FILTER (WHERE question_number IN (1, 3, 6, 7, 9, 11)), 2) AS disengagement_average,
    MIN(completed_at) AS completed_at
  FROM scored
  GROUP BY user_id
)
SELECT
  a.user_id,
  p.name AS user_name,
  p.email AS user_email,
  a.answers,
  (a.answers = 12) AS complete,
  a.exhaustion_score,
  a.disengagement_score,
  a.exhaustion_average,
  a.disengagement_average,
  ROUND(((a.exhaustion_average + a.disengagement_average) / 2.0), 2) AS total_average,
  a.completed_at
FROM aggregated a
LEFT JOIN profiles p ON p.id = a.user_id;

CREATE OR REPLACE VIEW analysis_users AS
WITH time_rollup AS (
  SELECT
    user_id,
    COUNT(*) AS time_entries_total,
    COUNT(*) FILTER (WHERE deleted_at IS NULL) AS time_entries_active,
    COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) AS time_entries_deleted,
    COALESCE(SUM(minutes) FILTER (WHERE deleted_at IS NULL), 0) AS total_active_minutes
  FROM time_entries
  GROUP BY user_id
)
SELECT
  p.id AS user_id,
  p.name AS user_name,
  p.email AS user_email,
  p.role,
  p.is_active,
  p.title AS profile_job_title,
  p.experience_level AS profile_experience_level,
  p.institution AS profile_institution_text,
  p.institution_id AS profile_institution_id,
  i.name AS profile_institution_id_name,
  (p.institution_id IS NOT NULL AND i.name IS NOT NULL AND p.institution IS DISTINCT FROM i.name) AS institution_mismatch,
  COALESCE(tr.time_entries_total, 0) AS time_entries_total,
  COALESCE(tr.time_entries_active, 0) AS time_entries_active,
  COALESCE(tr.time_entries_deleted, 0) AS time_entries_deleted,
  COALESCE(tr.total_active_minutes, 0) AS total_active_minutes,
  (asr.id IS NOT NULL) AS has_additional_survey,
  asr.profile_survey_submitted_at AS additional_survey_submitted_at,
  (jsonb_array_length(COALESCE(asr.hospital_services, '[]'::jsonb)) > 0) AS hospital_services_answered,
  asr.hospital_services,
  (asr.telehealth_asp IS NOT NULL) AS telehealth_asp_answered,
  asr.telehealth_asp,
  (asr.saar_value IS NOT NULL OR asr.saar_category IS NOT NULL) AS saar_answered,
  (jsonb_array_length(COALESCE(asr.effectiveness_options, '[]'::jsonb)) > 0) AS effectiveness_answered,
  bs.answers AS burnout_answers,
  COALESCE(bs.complete, false) AS burnout_complete,
  bs.exhaustion_average,
  bs.disengagement_average,
  bs.total_average AS burnout_total_average
FROM profiles p
LEFT JOIN institutions i ON i.id = p.institution_id
LEFT JOIN time_rollup tr ON tr.user_id = p.id
LEFT JOIN additional_survey_responses asr ON asr.user_id = p.id
LEFT JOIN analysis_burnout_scores bs ON bs.user_id = p.id;
