import { TimeEntry } from "@/app/dashboard/data/client"

// Excel export utilities
export const excelUtils = {
  // Convert TimeEntry to Excel row
  entryToExcelRow: (entry: TimeEntry): Record<string, string | number> => {
    // Format date only (no time) in browser's timezone
    const formatDateForExcel = (dateString: string): string => {
      try {
        const date = new Date(dateString)
        // Use browser's timezone for display, date only
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
        // Use browser's timezone for display
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

    return {
      'Date': formatDateForExcel(entry.createdAt),
      'Task': entry.task,
      'Other Task': entry.otherTask || '',
      'Minutes': entry.minutes,
      'Comment': entry.comment || '',
      'Created At': formatDateTimeForExcel(entry.createdAt),
      'Updated At': formatDateTimeForExcel(entry.updatedAt)
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
  range: 'today' | 'week' | 'all' = 'all'
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
    const worksheetData = processedEntries.map(entry => excelUtils.entryToExcelRow(entry))
    
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData)
    
    // Set column widths
    const columnWidths = [
      { wch: 12 }, // Date (date only, shorter)
      { wch: 20 }, // Task
      { wch: 20 }, // Other Task
      { wch: 10 }, // Minutes
      { wch: 30 }, // Comment
      { wch: 20 }, // Created At
      { wch: 20 }  // Updated At
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
  data: Record<string, string | number>[],
  sheetName: string = 'Data',
  filename: string = 'export.xlsx'
): Promise<void> => {
  try {
    // Dynamically import xlsx library
    const XLSX = await import('xlsx')
    
    const worksheet = XLSX.utils.json_to_sheet(data)
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
