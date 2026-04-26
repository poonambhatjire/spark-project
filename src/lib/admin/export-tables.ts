/** Public application tables included in full admin exports (see scripts/backup-database.js). */
export const ADMIN_EXPORT_TABLES = [
  'profiles',
  'time_entries',
  'additional_survey_responses',
  'burnout_survey_responses',
  'contact_submissions',
  'admin_activities',
  'telemetry_events',
  'institutions',
  'activities',
  'activity_categories',
] as const

export type AdminExportTableName = (typeof ADMIN_EXPORT_TABLES)[number]

export const LOGGED_ITEMS_WITH_PROFILE_SHEET = 'logged_items_with_profile'
export const ANALYSIS_USERS_SHEET = 'analysis_users'
export const ANALYSIS_BURNOUT_SCORES_SHEET = 'analysis_burnout_scores'
export const ANALYSIS_DATA_QUALITY_SHEET = 'analysis_data_quality'

const HOSPITAL_SERVICE_LABELS: Record<string, string> = {
  level1_trauma: 'Level 1 trauma center',
  burn_unit: 'Burn unit',
  solid_organ_transplant: 'Solid organ transplant program',
  bone_marrow_transplant: 'Bone marrow transplant program',
  none: 'None of the above',
}

const EFFECTIVENESS_LABELS: Record<string, string> = {
  cost_savings: 'Cost savings/cost avoidance',
  decreased_utilization: 'Decreased antibiotic utilization',
  decreased_cdiff: 'Decreased Clostridium difficile infection',
  decreased_resistance: 'Decreased rate of drug-resistant organisms',
  none: 'Our ASP has not demonstrated any of the above',
  other: 'Other (please specify)',
}

const TELEHEALTH_ASP_LABELS: Record<string, string> = {
  provides: 'My hospital provides telehealth ASP',
  receives: 'My hospital receives telehealth ASP',
  none: 'None of the above',
}

const SAAR_CATEGORY_LABELS: Record<string, string> = {
  much_lower: 'Much lower than predicted (<0.7)',
  slightly_lower: 'Slightly lower than predicted (0.7 to <1)',
  about_predicted: 'About as predicted (around 1.0)',
  slightly_higher: 'Slightly higher than predicted (>1 to 1.3)',
  much_higher: 'Much higher than predicted (>1.3)',
  dont_know: "Don't know",
  not_available: 'SAAR not available',
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.map(String)
    } catch {
      return value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    }
  }
  return []
}

function labelsForValues(value: unknown, labels: Record<string, string>): string {
  return asStringArray(value)
    .map((item) => labels[item] ?? item)
    .join(', ')
}

function hasAnsweredSelection(value: unknown): boolean {
  return asStringArray(value).length > 0
}

function hasAnsweredScalar(value: unknown): boolean {
  return value !== null && value !== undefined && !(typeof value === 'string' && value.trim() === '')
}

function labelForValue(value: unknown, labels: Record<string, string>): string {
  if (typeof value !== 'string' || !value) return ''
  return labels[value] ?? value
}

function numberValue(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function isDeleted(row: Record<string, unknown>): boolean {
  return hasAnsweredScalar(row.deleted_at)
}

export function serializeCellForSheet(value: unknown): string | number | null {
  if (value === null || value === undefined) return null
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'object' && !(value instanceof Date)) {
    return JSON.stringify(value)
  }
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return value as string | number
}

export function rowToSheetRow(row: Record<string, unknown>): Record<string, string | number | null> {
  const out: Record<string, string | number | null> = {}
  for (const [k, v] of Object.entries(row)) {
    out[k] = serializeCellForSheet(v)
  }
  return out
}

export function buildLoggedItemsWithProfileRows(
  payload: Partial<Record<AdminExportTableName, unknown[]>>
): Record<string, unknown>[] {
  const timeEntries = (payload.time_entries ?? []) as Record<string, unknown>[]
  const profiles = (payload.profiles ?? []) as Record<string, unknown>[]
  const surveyResponses = (payload.additional_survey_responses ?? []) as Record<string, unknown>[]

  const profileById = new Map(profiles.map((profile) => [String(profile.id), profile]))
  const surveyByUserId = new Map(
    surveyResponses.map((survey) => [String(survey.user_id), survey])
  )

  return timeEntries.map((entry) => {
    const userId = String(entry.user_id ?? '')
    const profile = profileById.get(userId)
    const survey = surveyByUserId.get(userId)

    return {
      'Logged Item ID': entry.id ?? null,
      'User ID': entry.user_id ?? null,
      'User Name': profile?.name ?? null,
      'User Email': profile?.email ?? null,
      'Task': entry.task ?? null,
      'Other Task': entry.other_task ?? null,
      'Minutes': entry.minutes ?? null,
      'Occurred On': entry.occurred_on ?? null,
      'Ended At': entry.ended_at ?? null,
      'Patient Count': entry.patient_count ?? null,
      'Typical Day': entry.is_typical_day ?? null,
      'Tele-health': entry.is_telehealth ?? null,
      'Comment': entry.comment ?? null,
      'Created At': entry.created_at ?? null,
      'Updated At': entry.updated_at ?? null,
      'Deleted At': entry.deleted_at ?? null,
      'Profile - Job Title': profile?.title ?? null,
      'Profile - Experience Level': profile?.experience_level ?? null,
      'Profile - Institution': profile?.institution ?? null,
      'Profile - Licensed Beds': survey?.licensed_beds ?? null,
      'Profile - Occupied Beds Count': survey?.occupied_beds_count ?? null,
      'Profile - Occupied Beds Percent': survey?.occupied_beds_percent ?? null,
      'Profile - ICU Beds': survey?.icu_beds ?? null,
      'Profile - Has Additional Survey': Boolean(survey),
      'Profile - Additional Survey Submitted At': survey?.profile_survey_submitted_at ?? null,
      'Profile - Hospital Services Answered': hasAnsweredSelection(survey?.hospital_services),
      'Profile - Hospital Services Offered': labelsForValues(
        survey?.hospital_services,
        HOSPITAL_SERVICE_LABELS
      ),
      'Profile - Current ASP FTE': survey?.asp_fte ?? null,
      'Profile - Pharmacist FTE': survey?.pharmacist_fte ?? null,
      'Profile - Physician FTE': survey?.physician_fte ?? null,
      'Profile - Other FTE 1 Role': survey?.other1_specify ?? null,
      'Profile - Other FTE 1': survey?.other1_fte ?? null,
      'Profile - Other FTE 2 Role': survey?.other2_specify ?? null,
      'Profile - Other FTE 2': survey?.other2_fte ?? null,
      'Profile - Other FTE 3 Role': survey?.other3_specify ?? null,
      'Profile - Other FTE 3': survey?.other3_fte ?? null,
      'Profile - Telehealth ASP Utilization': labelForValue(
        survey?.telehealth_asp,
        TELEHEALTH_ASP_LABELS
      ),
      'Profile - Telehealth ASP Answered': hasAnsweredScalar(survey?.telehealth_asp),
      'Profile - SAAR Value': survey?.saar_value ?? null,
      'Profile - SAAR Category': labelForValue(survey?.saar_category, SAAR_CATEGORY_LABELS),
      'Profile - SAAR Answered': hasAnsweredScalar(survey?.saar_value) || hasAnsweredScalar(survey?.saar_category),
      'Profile - Demonstrated Effectiveness Answered': hasAnsweredSelection(
        survey?.effectiveness_options
      ),
      'Profile - Demonstrated Effectiveness': labelsForValues(
        survey?.effectiveness_options,
        EFFECTIVENESS_LABELS
      ),
      'Profile - Effectiveness Other': survey?.effectiveness_other ?? null,
    }
  })
}

export function buildAnalysisUsersRows(
  payload: Partial<Record<AdminExportTableName, unknown[]>>
): Record<string, unknown>[] {
  const profiles = (payload.profiles ?? []) as Record<string, unknown>[]
  const timeEntries = (payload.time_entries ?? []) as Record<string, unknown>[]
  const surveyResponses = (payload.additional_survey_responses ?? []) as Record<string, unknown>[]
  const burnoutResponses = (payload.burnout_survey_responses ?? []) as Record<string, unknown>[]
  const institutions = (payload.institutions ?? []) as Record<string, unknown>[]

  const surveyByUserId = new Map(
    surveyResponses.map((survey) => [String(survey.user_id), survey])
  )
  const institutionById = new Map(
    institutions.map((institution) => [String(institution.id), institution])
  )

  return profiles.map((profile) => {
    const userId = String(profile.id ?? '')
    const entries = timeEntries.filter((entry) => String(entry.user_id ?? '') === userId)
    const activeEntries = entries.filter((entry) => !isDeleted(entry))
    const survey = surveyByUserId.get(userId)
    const burnoutForUser = burnoutResponses.filter(
      (response) => String(response.user_id ?? '') === userId
    )
    const institution = institutionById.get(String(profile.institution_id ?? ''))

    return {
      'User ID': profile.id ?? null,
      'User Name': profile.name ?? null,
      'User Email': profile.email ?? null,
      'Role': profile.role ?? null,
      'Active': profile.is_active ?? null,
      'Profile - Job Title': profile.title ?? null,
      'Profile - Experience Level': profile.experience_level ?? null,
      'Profile - Institution Text': profile.institution ?? null,
      'Profile - Institution ID': profile.institution_id ?? null,
      'Profile - Institution ID Name': institution?.name ?? null,
      'Time Entries Total': entries.length,
      'Time Entries Active': activeEntries.length,
      'Time Entries Deleted': entries.length - activeEntries.length,
      'Total Active Minutes': activeEntries.reduce(
        (sum, entry) => sum + numberValue(entry.minutes),
        0
      ),
      'Has Additional Survey': Boolean(survey),
      'Additional Survey Submitted At': survey?.profile_survey_submitted_at ?? null,
      'Hospital Services Answered': hasAnsweredSelection(survey?.hospital_services),
      'Hospital Services Offered': labelsForValues(survey?.hospital_services, HOSPITAL_SERVICE_LABELS),
      'Telehealth ASP Answered': hasAnsweredScalar(survey?.telehealth_asp),
      'Telehealth ASP Utilization': labelForValue(survey?.telehealth_asp, TELEHEALTH_ASP_LABELS),
      'SAAR Answered': hasAnsweredScalar(survey?.saar_value) || hasAnsweredScalar(survey?.saar_category),
      'Demonstrated Effectiveness Answered': hasAnsweredSelection(survey?.effectiveness_options),
      'Burnout Answers': burnoutForUser.length,
      'Burnout Complete': burnoutForUser.length === 12,
    }
  })
}

const EXHAUSTION_QUESTIONS = new Set([2, 4, 5, 8, 10, 12])
const DISENGAGEMENT_QUESTIONS = new Set([1, 3, 6, 7, 9, 11])
const REVERSE_SCORED_QUESTIONS = new Set([1, 5, 7, 10])

function scoredBurnoutValue(questionNumber: number, responseValue: number): number {
  return REVERSE_SCORED_QUESTIONS.has(questionNumber) ? 5 - responseValue : responseValue
}

export function buildAnalysisBurnoutScoresRows(
  payload: Partial<Record<AdminExportTableName, unknown[]>>
): Record<string, unknown>[] {
  const profiles = (payload.profiles ?? []) as Record<string, unknown>[]
  const burnoutResponses = (payload.burnout_survey_responses ?? []) as Record<string, unknown>[]
  const profileById = new Map(profiles.map((profile) => [String(profile.id), profile]))
  const userIds = [...new Set(burnoutResponses.map((response) => String(response.user_id ?? '')))]

  return userIds.map((userId) => {
    const profile = profileById.get(userId)
    const responses = burnoutResponses.filter((response) => String(response.user_id ?? '') === userId)
    const exhaustionScores: number[] = []
    const disengagementScores: number[] = []

    for (const response of responses) {
      const questionNumber = numberValue(response.question_number)
      const responseValue = numberValue(response.response_value)
      const score = scoredBurnoutValue(questionNumber, responseValue)
      if (EXHAUSTION_QUESTIONS.has(questionNumber)) exhaustionScores.push(score)
      if (DISENGAGEMENT_QUESTIONS.has(questionNumber)) disengagementScores.push(score)
    }

    const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)
    const avg = (values: number[]) =>
      values.length > 0 ? Math.round((sum(values) / values.length) * 100) / 100 : null
    const exhaustionAverage = avg(exhaustionScores)
    const disengagementAverage = avg(disengagementScores)

    return {
      'User ID': userId,
      'User Name': profile?.name ?? null,
      'User Email': profile?.email ?? null,
      'Answers': responses.length,
      'Complete': responses.length === 12,
      'Exhaustion Score': sum(exhaustionScores),
      'Disengagement Score': sum(disengagementScores),
      'Exhaustion Average': exhaustionAverage,
      'Disengagement Average': disengagementAverage,
      'Total Average':
        exhaustionAverage !== null && disengagementAverage !== null
          ? Math.round(((exhaustionAverage + disengagementAverage) / 2) * 100) / 100
          : null,
      'Completed At': responses[0]?.completed_at ?? null,
    }
  })
}

export function buildAnalysisDataQualityRows(
  payload: Partial<Record<AdminExportTableName, unknown[]>>
): Record<string, unknown>[] {
  const profiles = (payload.profiles ?? []) as Record<string, unknown>[]
  const timeEntries = (payload.time_entries ?? []) as Record<string, unknown>[]
  const surveyResponses = (payload.additional_survey_responses ?? []) as Record<string, unknown>[]
  const burnoutResponses = (payload.burnout_survey_responses ?? []) as Record<string, unknown>[]
  const profileIds = new Set(profiles.map((profile) => String(profile.id ?? '')))
  const surveyUserIds = new Set(surveyResponses.map((survey) => String(survey.user_id ?? '')))
  const activeTimeEntries = timeEntries.filter((entry) => !isDeleted(entry))

  const checks = [
    {
      check: 'Active time entries join to profiles',
      value: activeTimeEntries.filter((entry) => profileIds.has(String(entry.user_id ?? ''))).length,
      total: activeTimeEntries.length,
    },
    {
      check: 'Active time entries have additional survey context',
      value: activeTimeEntries.filter((entry) => surveyUserIds.has(String(entry.user_id ?? ''))).length,
      total: activeTimeEntries.length,
    },
    {
      check: 'Users have additional survey rows',
      value: surveyUserIds.size,
      total: profiles.length,
    },
    {
      check: 'Additional survey rows have hospital services answered',
      value: surveyResponses.filter((survey) => hasAnsweredSelection(survey.hospital_services)).length,
      total: surveyResponses.length,
    },
    {
      check: 'Additional survey rows have submitted timestamp',
      value: surveyResponses.filter((survey) => hasAnsweredScalar(survey.profile_survey_submitted_at)).length,
      total: surveyResponses.length,
    },
    {
      check: 'Users have complete burnout survey',
      value: [...new Set(burnoutResponses.map((response) => String(response.user_id ?? '')))].filter(
        (userId) => burnoutResponses.filter((response) => String(response.user_id ?? '') === userId).length === 12
      ).length,
      total: profiles.length,
    },
    {
      check: 'Time entries have valid minutes',
      value: timeEntries.filter((entry) => numberValue(entry.minutes) > 0 && numberValue(entry.minutes) <= 480).length,
      total: timeEntries.length,
    },
  ]

  return checks.map((check) => ({
    'Check': check.check,
    'Passing Rows': check.value,
    'Total Rows': check.total,
    'Pass Percent': check.total ? Math.round((check.value / check.total) * 1000) / 10 : null,
  }))
}
