import { TimeEntry } from "@/app/dashboard/data/client"

export interface LoggedItemsExportContext {
  profile?: Record<string, unknown>
  additionalSurvey?: {
    licensedBeds?: number | null
    occupiedBedsCount?: number | null
    occupiedBedsPercent?: number | null
    icuBeds?: number | null
    hospitalServices?: string[] | null
    aspFte?: number | null
    pharmacistFte?: number | null
    physicianFte?: number | null
    other1Specify?: string | null
    other1Fte?: number | null
    other2Specify?: string | null
    other2Fte?: number | null
    other3Specify?: string | null
    other3Fte?: number | null
    telehealthAsp?: string | null
    saarValue?: number | null
    saarCategory?: string | null
    effectivenessOptions?: string[] | null
    effectivenessOther?: string | null
    profileSurveySubmittedAt?: string | null
  }
}

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

const buildLoggedItemsProfileColumns = (
  context?: LoggedItemsExportContext
): Record<string, string | number> => {
  const profile = context?.profile
  const survey = context?.additionalSurvey

  return {
    'Profile - Full Name': getStringValue(profile?.name),
    'Profile - Email': getStringValue(profile?.email),
    'Profile - Job Title': getStringValue(profile?.title),
    'Profile - Experience Level': getStringValue(profile?.experience_level),
    'Profile - Institution': getStringValue(profile?.institution),
    'Profile - Licensed Beds': survey?.licensedBeds ?? '',
    'Profile - Occupied Beds Count': survey?.occupiedBedsCount ?? '',
    'Profile - Occupied Beds Percent': survey?.occupiedBedsPercent ?? '',
    'Profile - ICU Beds': survey?.icuBeds ?? '',
    'Profile - Additional Survey Submitted At': survey?.profileSurveySubmittedAt ?? '',
    'Profile - Hospital Services Answered': hasSelection(survey?.hospitalServices),
    'Profile - Hospital Services Offered': labelsForValues(survey?.hospitalServices, HOSPITAL_SERVICE_LABELS),
    'Profile - Current ASP FTE': survey?.aspFte ?? '',
    'Profile - Pharmacist FTE': survey?.pharmacistFte ?? '',
    'Profile - Physician FTE': survey?.physicianFte ?? '',
    'Profile - Other FTE 1 Role': survey?.other1Specify ?? '',
    'Profile - Other FTE 1': survey?.other1Fte ?? '',
    'Profile - Other FTE 2 Role': survey?.other2Specify ?? '',
    'Profile - Other FTE 2': survey?.other2Fte ?? '',
    'Profile - Other FTE 3 Role': survey?.other3Specify ?? '',
    'Profile - Other FTE 3': survey?.other3Fte ?? '',
    'Profile - Telehealth ASP Utilization': survey?.telehealthAsp
      ? TELEHEALTH_ASP_LABELS[survey.telehealthAsp] ?? survey.telehealthAsp
      : '',
    'Profile - SAAR Value': survey?.saarValue ?? '',
    'Profile - SAAR Category': survey?.saarCategory
      ? SAAR_CATEGORY_LABELS[survey.saarCategory] ?? survey.saarCategory
      : '',
    'Profile - Demonstrated Effectiveness Answered': hasSelection(survey?.effectivenessOptions),
    'Profile - Demonstrated Effectiveness': labelsForValues(
      survey?.effectivenessOptions,
      EFFECTIVENESS_LABELS
    ),
    'Profile - Effectiveness Other': survey?.effectivenessOther ?? '',
  }
}

// Excel export utilities
export const excelUtils = {
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

  // Convert TimeEntry to Excel row
  entryToExcelRow: (
    entry: TimeEntry,
    context?: LoggedItemsExportContext
  ): Record<string, string | number> => {
    // Format date only (no time) in browser's timezone
    const formatDateForExcel = (dateString: string): string => {
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      } catch {
        return dateString
      }
    }

    // Format date and time in browser's timezone
    const formatDateTimeForExcel = (dateString: string): string => {
      try {
        const date = new Date(dateString)
        return date.toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      } catch {
        return dateString
      }
    }

    const endedAt = excelUtils.getEndedAt(entry)

    return {
      'Date': formatDateForExcel(entry.occurredOn),
      'Task': entry.task,
      'Other Task': entry.otherTask || '',
      'Minutes': entry.minutes,
      'End Date & Time': endedAt ? formatDateTimeForExcel(endedAt) : '',
      'Patient Count': entry.patientCount ?? '',
      'Typical Day': entry.isTypicalDay ? 'Yes' : 'No',
      'Tele-health': entry.isTelehealth ? 'Yes' : 'No',
      'Comment': entry.comment || '',
      'Created At': formatDateTimeForExcel(entry.createdAt),
      'Updated At': formatDateTimeForExcel(entry.updatedAt),
      ...buildLoggedItemsProfileColumns(context),
    }
  },

  // Generate filename based on current date and range
  generateFilename: (range: 'today' | 'week' | 'all' = 'all'): string => {
    const today = new Date().toISOString().split('T')[0]
    return `sparc_entries_${today}_${range}.xlsx`
  },

  // Format date for Excel (ensure consistent format)
  formatDateForExcel: (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    } catch {
      return dateString
    }
  },

  // Format datetime for Excel
  formatDateTimeForExcel: (dateTimeString: string): string => {
    try {
      const date = new Date(dateTimeString)
      return date.toISOString()
    } catch {
      return dateTimeString
    }
  }
}

// Export function for TimeEntry array to Excel
export const exportEntriesToExcel = async (
  entries: TimeEntry[], 
  range: 'today' | 'week' | 'all' = 'all',
  context?: LoggedItemsExportContext
): Promise<void> => {
  try {
    // Dynamically import xlsx library
    const XLSX = await import('xlsx')
    
    // Process entries for Excel (format dates consistently)
    const processedEntries = entries.map(entry => ({
      ...entry,
      occurredOn: excelUtils.formatDateForExcel(entry.occurredOn),
      createdAt: excelUtils.formatDateTimeForExcel(entry.createdAt),
      updatedAt: excelUtils.formatDateTimeForExcel(entry.updatedAt)
    }))
    
    // Convert to Excel format
    const worksheetData = processedEntries.map(entry => excelUtils.entryToExcelRow(entry, context))
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData)
    
    // Set column widths
    const columnWidths = [
      { wch: 12 }, // Date
      { wch: 20 }, // Task
      { wch: 20 }, // Other Task
      { wch: 10 }, // Minutes
      { wch: 20 }, // End Date & Time
      { wch: 14 }, // Patient Count
      { wch: 14 }, // Typical Day
      { wch: 12 }, // Tele-health
      { wch: 30 }, // Comment
      { wch: 20 }, // Created At
      { wch: 20 }, // Updated At
      { wch: 22 }, // Profile - Full Name
      { wch: 28 }, // Profile - Email
      { wch: 24 }, // Profile - Job Title
      { wch: 20 }, // Profile - Experience Level
      { wch: 24 }, // Profile - Institution
      { wch: 18 }, // Profile - Licensed Beds
      { wch: 24 }, // Profile - Occupied Beds Count
      { wch: 26 }, // Profile - Occupied Beds Percent
      { wch: 18 }, // Profile - ICU Beds
      { wch: 28 }, // Profile - Additional Survey Submitted At
      { wch: 28 }, // Profile - Hospital Services Answered
      { wch: 48 }, // Profile - Hospital Services Offered
      { wch: 22 }, // Profile - Current ASP FTE
      { wch: 22 }, // Profile - Pharmacist FTE
      { wch: 22 }, // Profile - Physician FTE
      { wch: 24 }, // Profile - Other FTE 1 Role
      { wch: 18 }, // Profile - Other FTE 1
      { wch: 24 }, // Profile - Other FTE 2 Role
      { wch: 18 }, // Profile - Other FTE 2
      { wch: 24 }, // Profile - Other FTE 3 Role
      { wch: 18 }, // Profile - Other FTE 3
      { wch: 34 }, // Profile - Telehealth ASP Utilization
      { wch: 18 }, // Profile - SAAR Value
      { wch: 34 }, // Profile - SAAR Category
      { wch: 36 }, // Profile - Demonstrated Effectiveness Answered
      { wch: 48 }, // Profile - Demonstrated Effectiveness
      { wch: 30 }, // Profile - Effectiveness Other
    ]
    worksheet['!cols'] = columnWidths
    
    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Time Entries')
    
    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    })
    
    // Create blob and download
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const filename = excelUtils.generateFilename(range)
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('Failed to export Excel:', error)
    throw new Error('Failed to export Excel file')
  }
}

// Export function for any data array to Excel
export const exportDataToExcel = async (
  data: Record<string, unknown>[],
  sheetName: string = 'Data',
  filename: string = 'export.xlsx'
): Promise<void> => {
  try {
    // Dynamically import xlsx library
    const XLSX = await import('xlsx')

    const worksheetData = data.map((row) => {
      const out: Record<string, string | number | null> = {}
      for (const [key, value] of Object.entries(row)) {
        if (value === null || value === undefined) out[key] = null
        else if (Array.isArray(value)) out[key] = value.join(', ')
        else if (value instanceof Date) out[key] = value.toISOString()
        else if (typeof value === 'object') out[key] = JSON.stringify(value)
        else if (typeof value === 'boolean') out[key] = value ? 'true' : 'false'
        else out[key] = value as string | number
      }
      return out
    })
    
    const worksheet = XLSX.utils.json_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    
    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    })
    
    // Create blob and download
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export Excel:', error)
    throw new Error('Failed to export Excel file')
  }
}
