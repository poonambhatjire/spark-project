-- Production-safe RLS hardening for SPARC / sparc-project.
-- Goal: stop unauthenticated API access to sensitive tables without breaking
-- normal authenticated user flows or service-role admin export.
--
-- Safe order:
-- 1) Enable RLS on tables that already have correct policies
-- 2) Lock down backup tables (RLS on, no policies = deny via API)
-- 3) Add read policies for reference tables, then enable RLS
-- 4) Tighten overly-permissive contact_submissions SELECT

BEGIN;

-- ---------------------------------------------------------------------------
-- 1) Critical app tables: policies already exist, just turn RLS on
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 2) Backup / migration leftovers: enable RLS with no policies
--    => anon/authenticated cannot read/write via PostgREST API
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles_backup_pre_normalization_20260204_153417 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries_backup_pre_normalization_20260204_153417 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activities_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activities_backup_pre_normalization_20260204_153417 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions_backup_pre_normalization_20260204_153417 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_events_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telemetry_events_backup_pre_normalization_20260204_153417 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_summary_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_summary_backup_before_view_conversion_20260204_155232 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_summary_backup_pre_normalization_20260204_153417 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats_backup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats_backup_before_view_conversion_20260204_155232 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats_backup_pre_normalization_20260204_153417 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_metadata ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 3) Reference tables used by logged-in users
-- ---------------------------------------------------------------------------
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read activities" ON public.activities;
CREATE POLICY "Authenticated can read activities"
  ON public.activities
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can read activity categories" ON public.activity_categories;
CREATE POLICY "Authenticated can read activity categories"
  ON public.activity_categories
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can read institutions" ON public.institutions;
CREATE POLICY "Authenticated can read institutions"
  ON public.institutions
  FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- 4) Contact submissions: keep public INSERT, remove open SELECT
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view all contact submissions" ON public.contact_submissions;

COMMIT;
