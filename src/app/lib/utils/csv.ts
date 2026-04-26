import { TimeEntry } from "@/app/dashboard/data/client"
import type { LoggedItemsExportContext } from "@/app/lib/utils/excel"

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

const getStringValue = (value: unknown): string => {
  return typeof value === 'string' ? value : ''
}

const labelsForValues = (
  values: string[] | null | undefined,
  labels: Record<string, string>
): string => {
  return (values ?? []).map((value) => labels[value] ?? value).join(', ')
}

const hasSelection = (values: string[] | null | undefined): string => {
  return values && values.length > 0 ? 'Yes' : 'No'
}

const buildProfileCsvFields = (context?: LoggedItemsExportContext): Array<string | number> => {
  const profile = context?.profile
  const survey = context?.additionalSurvey

  return [
    getStringValue(profile?.name),
    getStringValue(profile?.email),
    getStringValue(profile?.title),
    getStringValue(profile?.experience_level),
    getStringValue(profile?.institution),
    survey?.licensedBeds ?? '',
    survey?.occupiedBedsCount ?? '',
    survey?.occupiedBedsPercent ?? '',
    survey?.icuBeds ?? '',
    survey?.profileSurveySubmittedAt ?? '',
    hasSelection(survey?.hospitalServices),
    labelsForValues(survey?.hospitalServices, HOSPITAL_SERVICE_LABELS),
    survey?.aspFte ?? '',
    survey?.pharmacistFte ?? '',
    survey?.physicianFte ?? '',
    survey?.other1Specify ?? '',
    survey?.other1Fte ?? '',
    survey?.other2Specify ?? '',
    survey?.other2Fte ?? '',
    survey?.other3Specify ?? '',
    survey?.other3Fte ?? '',
    survey?.telehealthAsp
      ? TELEHEALTH_ASP_LABELS[survey.telehealthAsp] ?? survey.telehealthAsp
      : '',
    survey?.saarValue ?? '',
    survey?.saarCategory ? SAAR_CATEGORY_LABELS[survey.saarCategory] ?? survey.saarCategory : '',
    hasSelection(survey?.effectivenessOptions),
    labelsForValues(survey?.effectivenessOptions, EFFECTIVENESS_LABELS),
    survey?.effectivenessOther ?? '',
  ]
}

const PROFILE_CSV_HEADERS = [
  'Profile - Full Name',
  'Profile - Email',
  'Profile - Job Title',
  'Profile - Experience Level',
  'Profile - Institution',
  'Profile - Licensed Beds',
  'Profile - Occupied Beds Count',
  'Profile - Occupied Beds Percent',
  'Profile - ICU Beds',
  'Profile - Additional Survey Submitted At',
  'Profile - Hospital Services Answered',
  'Profile - Hospital Services Offered',
  'Profile - Current ASP FTE',
  'Profile - Pharmacist FTE',
  'Profile - Physician FTE',
  'Profile - Other FTE 1 Role',
  'Profile - Other FTE 1',
  'Profile - Other FTE 2 Role',
  'Profile - Other FTE 2',
  'Profile - Other FTE 3 Role',
  'Profile - Other FTE 3',
  'Profile - Telehealth ASP Utilization',
  'Profile - SAAR Value',
  'Profile - SAAR Category',
  'Profile - Demonstrated Effectiveness Answered',
  'Profile - Demonstrated Effectiveness',
  'Profile - Effectiveness Other',
]

// CSV helper functions
export const csvUtils = {
  // Escape CSV field value
  escapeField: (value: unknown): string => {
    if (value === null || value === undefined) {
      return ''
    }
    
    const stringValue = Array.isArray(value)
      ? value.join('; ')
      : value instanceof Date
        ? value.toISOString()
        : typeof value === 'object'
          ? JSON.stringify(value)
          : String(value)
    
    // If the value contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    
    return stringValue
  },

  // Get end datetime: prefer entry.endedAt from DB, else compute from occurredOn + minutes
  getEndedAt: (entry: TimeEntry): string => {
    if (entry.endedAt) return entry.endedAt
    try {
      const start = new Date(entry.occurredOn.includes('T') ? entry.occurredOn : `${entry.occurredOn}T00:00:00`)
      const end = new Date(start.getTime() + entry.minutes * 60_000)
      return end.toISOString()
    } catch {
      return ''
    }
  },

  // Convert TimeEntry to CSV row
  entryToCsvRow: (entry: TimeEntry, context?: LoggedItemsExportContext): string => {
    const fields = [
      entry.occurredOn,
      entry.task,
      entry.otherTask || '',
      entry.minutes,
      csvUtils.getEndedAt(entry),
      entry.patientCount ?? '',
      entry.isTypicalDay ? 'Yes' : 'No',
      entry.isTelehealth ? 'Yes' : 'No',
      entry.comment || '',
      entry.createdAt,
      entry.updatedAt,
      ...buildProfileCsvFields(context),
    ]
    
    return fields.map(field => csvUtils.escapeField(field)).join(',')
  },

  // Generate CSV content from entries
  generateCsv: (entries: TimeEntry[], context?: LoggedItemsExportContext): string => {
    const headers = [
      'Date',
      'Task',
      'Other Task',
      'Minutes',
      'End Date & Time',
      'Patient Count',
      'Typical Day',
      'Tele-health',
      'Comment',
      'Created At',
      'Updated At',
      ...PROFILE_CSV_HEADERS,
    ]
    
    const headerRow = headers.join(',')
    const dataRows = entries.map(entry => csvUtils.entryToCsvRow(entry, context))
    
    return [headerRow, ...dataRows].join('\n')
  },

  // Download CSV file
  downloadCsv: (csvContent: string, filename: string): void => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    // Create download link
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      // Fallback for older browsers
      window.open(`data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`)
    }
  },

  // Generate filename based on current date and range
  generateFilename: (range: 'today' | 'week' | 'all' = 'all'): string => {
    const today = new Date().toISOString().split('T')[0]
    return `sparc_entries_${today}_${range}.csv`
  },

  // Format date for CSV (ensure consistent format)
  formatDateForCsv: (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    } catch {
      return dateString
    }
  },

  // Format datetime for CSV
  formatDateTimeForCsv: (dateTimeString: string): string => {
    try {
      const date = new Date(dateTimeString)
      return date.toISOString()
    } catch {
      return dateTimeString
    }
  }
}

// Pure function for generating CSV content from entries
export const generateCsvFromEntries = (
  entries: TimeEntry[],
  context?: LoggedItemsExportContext
): string => {
  // Process entries for CSV (format dates consistently)
  const processedEntries = entries.map(entry => ({
    ...entry,
    occurredOn: csvUtils.formatDateForCsv(entry.occurredOn),
    createdAt: csvUtils.formatDateTimeForCsv(entry.createdAt),
    updatedAt: csvUtils.formatDateTimeForCsv(entry.updatedAt)
  }))
  
  return csvUtils.generateCsv(processedEntries, context)
}

// Export function for TimeEntry array
export const exportEntriesToCsv = (
  entries: TimeEntry[], 
  range: 'today' | 'week' | 'all' = 'all',
  context?: LoggedItemsExportContext
): void => {
  try {
    const csvContent = generateCsvFromEntries(entries, context)
    const filename = csvUtils.generateFilename(range)
    
    csvUtils.downloadCsv(csvContent, filename)
  } catch (error) {
    console.error('Failed to export CSV:', error)
    throw new Error('Failed to export CSV file')
  }
}

// Generic CSV conversion function for any object array
export const convertToCSV = (data: Record<string, unknown>[]): string => {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const headerRow = headers.join(',')
  
  const dataRows = data.map(row => 
    headers.map(header => csvUtils.escapeField(row[header])).join(',')
  )
  
  return [headerRow, ...dataRows].join('\n')
}
