import { TimeEntry } from "@/app/dashboard/data/client"

// CSV helper functions
export const csvUtils = {
  // Escape CSV field value
  escapeField: (value: string | number | undefined | null): string => {
    if (value === null || value === undefined) {
      return ''
    }
    
    const stringValue = String(value)
    
    // If the value contains comma, quote, or newline, wrap in quotes and escape internal quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    
    return stringValue
  },

  // Convert TimeEntry to CSV row
  entryToCsvRow: (entry: TimeEntry): string => {
    const fields = [
      entry.occurredOn,
      entry.task,
      entry.otherTask || '',
      entry.minutes,
      entry.comment || '',
      entry.createdAt,
      entry.updatedAt
    ]
    
    return fields.map(field => csvUtils.escapeField(field)).join(',')
  },

  // Generate CSV content from entries
  generateCsv: (entries: TimeEntry[]): string => {
    const headers = [
      'Date',
      'Task',
      'Other Task',
      'Minutes',
      'Comment',
      'Created At',
      'Updated At'
    ]
    
    const headerRow = headers.join(',')
    const dataRows = entries.map(entry => csvUtils.entryToCsvRow(entry))
    
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

// Pure function for generating CSV content from entries (for testing)
export const generateCsvFromEntries = (entries: TimeEntry[]): string => {
  // Process entries for CSV (format dates consistently)
  const processedEntries = entries.map(entry => ({
    ...entry,
    occurredOn: csvUtils.formatDateForCsv(entry.occurredOn),
    createdAt: csvUtils.formatDateTimeForCsv(entry.createdAt),
    updatedAt: csvUtils.formatDateTimeForCsv(entry.updatedAt)
  }))
  
  return csvUtils.generateCsv(processedEntries)
}

// Export function for TimeEntry array
export const exportEntriesToCsv = (
  entries: TimeEntry[], 
  range: 'today' | 'week' | 'all' = 'all'
): void => {
  try {
    const csvContent = generateCsvFromEntries(entries)
    const filename = csvUtils.generateFilename(range)
    
    csvUtils.downloadCsv(csvContent, filename)
  } catch (error) {
    console.error('Failed to export CSV:', error)
    throw new Error('Failed to export CSV file')
  }
}
