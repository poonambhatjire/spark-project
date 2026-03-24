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

export function serializeCellForSheet(value: unknown): string | number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
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
