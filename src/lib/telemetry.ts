// Lightweight telemetry for user actions
// Privacy-safe: No PHI, no personal data, only action types and counts

export type TelemetryEvent = 
  | 'entry_created'
  | 'entry_updated' 
  | 'entry_deleted'
  | 'entry_duplicated'
  | 'bulk_delete'
  | 'bulk_duplicate'
  | 'export_csv'
  | 'filter_changed'
  | 'sort_changed'
  | 'search_used'

interface TelemetryData {
  event: TelemetryEvent
  timestamp: number
  sessionId: string
  // Optional metadata (no PHI)
  metadata?: {
    taskType?: string
    minutes?: number
    entryCount?: number
    filterType?: string
    sortField?: string
  }
}

class Telemetry {
  private sessionId: string
  private isEnabled: boolean

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isEnabled = process.env.NODE_ENV === 'development' || 
                    typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  track(event: TelemetryEvent, metadata?: TelemetryData['metadata']) {
    if (!this.isEnabled) return

    const telemetryData: TelemetryData = {
      event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      metadata
    }

    // Development: Console logging
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Telemetry:', telemetryData)
    }

    // Production: Could send to analytics service
    // For now, just log to console in production too
    if (typeof window !== 'undefined') {
      console.log('📊 Telemetry:', telemetryData)
    }
  }

  // Convenience methods for common events
  trackEntryCreated(taskType: string, minutes: number) {
    this.track('entry_created', { taskType, minutes })
  }

  trackEntryUpdated(taskType: string, minutes: number) {
    this.track('entry_updated', { taskType, minutes })
  }

  trackEntryDeleted(taskType: string) {
    this.track('entry_deleted', { taskType })
  }

  trackEntryDuplicated(taskType: string) {
    this.track('entry_duplicated', { taskType })
  }

  trackBulkDelete(entryCount: number) {
    this.track('bulk_delete', { entryCount })
  }

  trackBulkDuplicate(entryCount: number) {
    this.track('bulk_duplicate', { entryCount })
  }

  trackExportCsv(entryCount: number) {
    this.track('export_csv', { entryCount })
  }

  trackFilterChanged(filterType: string) {
    this.track('filter_changed', { filterType })
  }

  trackSortChanged(sortField: string) {
    this.track('sort_changed', { sortField })
  }

  trackSearchUsed() {
    this.track('search_used')
  }
}

// Singleton instance
export const telemetry = new Telemetry()
