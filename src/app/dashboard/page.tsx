"use client"

import { useState, useEffect } from "react"

import { QuickLog } from "@/app/components/QuickLog"
import { HistoryPanel } from "@/app/components/HistoryPanel"
import ProfileCompletionPrompt from "@/app/components/ProfileCompletionPrompt"
import { 
  TimeEntry, 
  CreateEntryInput, 
  UpdateEntryInput,
  TodayTotals
} from "@/app/dashboard/data/client"
import { dataMigrationService } from "@/app/dashboard/data/migration"
import { createTimeEntry, updateTimeEntry, deleteTimeEntries, listTimeEntries } from "@/lib/actions/time-entries"

const DashboardPage = () => {
  // State
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [todayTotals, setTodayTotals] = useState<TodayTotals>({
    total: 0,
    // Patient Care
    'Patient Care - Prospective Audit & Feedback': 0,
    'Patient Care - Authorization of Restricted Antimicrobials': 0,
    'Patient Care - Participating in Clinical Rounds': 0,
    // Administrative
    'Administrative - Guidelines/EHR': 0,
    // Tracking
    'Tracking - AMU': 0,
    'Tracking - AMR': 0,
    'Tracking - Antibiotic Appropriateness': 0,
    'Tracking - Intervention Acceptance': 0,
    // Reporting
    'Reporting - sharing data with prescribers/decision makers': 0,
    // Education
    'Education - Providing Education': 0,
    'Education - Receiving Education (e.g. CE)': 0,
    // Administrative
    'Administrative - Committee Work': 0,
    'Administrative - QI projects/research': 0,
    'Administrative - Emails': 0,
    // Other
    'Other - specify in comments': 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [migrationStatus, setMigrationStatus] = useState<{
    hasLocalStorage: boolean;
    localStorageCount: number;
    supabaseCount: number;
    needsMigration: boolean;
  } | null>(null)
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false)

  // Load initial data and check migration status
  useEffect(() => {
    const loadData = async () => {
      try {
        // Check migration status first
        const status = await dataMigrationService.getMigrationStatus()
        setMigrationStatus(status)
        
        if (status.needsMigration) {
          setShowMigrationPrompt(true)
        }

        // Load data from Supabase
        const [entriesResult, todayEntriesResult] = await Promise.all([
          listTimeEntries({ range: 'week' }),
          listTimeEntries({ range: 'today' }),
        ])
        
        if (entriesResult.success && entriesResult.data) {
          setEntries(entriesResult.data)
        }
        
        if (todayEntriesResult.success && todayEntriesResult.data) {
          // Calculate today's totals
          const totals: TodayTotals = {
            total: 0,
            'Patient Care - Prospective Audit & Feedback': 0,
            'Patient Care - Authorization of Restricted Antimicrobials': 0,
            'Patient Care - Participating in Clinical Rounds': 0,
            'Administrative - Guidelines/EHR': 0,
            'Tracking - AMU': 0,
            'Tracking - AMR': 0,
            'Tracking - Antibiotic Appropriateness': 0,
            'Tracking - Intervention Acceptance': 0,
            'Reporting - sharing data with prescribers/decision makers': 0,
            'Education - Providing Education': 0,
            'Education - Receiving Education (e.g. CE)': 0,
            'Administrative - Committee Work': 0,
            'Administrative - QI projects/research': 0,
            'Administrative - Emails': 0,
            'Other - specify in comments': 0
          };

          todayEntriesResult.data.forEach(entry => {
            totals.total += entry.minutes;
            totals[entry.task] += entry.minutes;
          });
          
          setTodayTotals(totals)
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Refresh data after operations
  const refreshData = async () => {
    try {
      const [entriesResult, todayEntriesResult] = await Promise.all([
        listTimeEntries({ range: 'week' }),
        listTimeEntries({ range: 'today' }),
      ])
      
      if (entriesResult.success && entriesResult.data) {
        setEntries(entriesResult.data)
      }
      
      if (todayEntriesResult.success && todayEntriesResult.data) {
        // Calculate today's totals
        const totals: TodayTotals = {
          total: 0,
          'Patient Care - Prospective Audit & Feedback': 0,
          'Patient Care - Authorization of Restricted Antimicrobials': 0,
          'Patient Care - Participating in Clinical Rounds': 0,
          'Administrative - Guidelines/EHR': 0,
          'Tracking - AMU': 0,
          'Tracking - AMR': 0,
          'Tracking - Antibiotic Appropriateness': 0,
          'Tracking - Intervention Acceptance': 0,
          'Reporting - sharing data with prescribers/decision makers': 0,
          'Education - Providing Education': 0,
          'Education - Receiving Education (e.g. CE)': 0,
          'Administrative - Committee Work': 0,
          'Administrative - QI projects/research': 0,
          'Administrative - Emails': 0,
          'Other - specify in comments': 0
        };

        todayEntriesResult.data.forEach(entry => {
          totals.total += entry.minutes;
          totals[entry.task] += entry.minutes;
        });
        
        setTodayTotals(totals)
      }
    } catch (error) {
      console.error('Failed to refresh data:', error)
    }
  }

  // Migration handler
  const handleMigration = async () => {
    try {
      const result = await dataMigrationService.performFullMigration()
      
      if (result.success) {
        console.log(`Migration successful! Migrated ${result.migrated} entries.`)
        setShowMigrationPrompt(false)
        await refreshData() // Refresh to show migrated data
      } else {
        console.error('Migration failed:', result.errors)
        alert(`Migration failed: ${result.errors.join(', ')}`)
      }
    } catch (error) {
      console.error('Migration error:', error)
      alert('Migration failed. Please try again.')
    }
  }

  // Event handlers
  const handleCreateEntry = async (data: CreateEntryInput) => {
    try {
      const result = await createTimeEntry(data)
      if (!result.success) {
        throw new Error(result.error || 'Failed to create entry')
      }
      await refreshData()
    } catch (error) {
      console.error('Failed to create entry:', error)
      throw error
    }
  }

  const handleUpdateEntry = async (id: string, updates: UpdateEntryInput) => {
    try {
      const result = await updateTimeEntry(id, updates)
      if (!result.success) {
        throw new Error(result.error || 'Failed to update entry')
      }
      await refreshData()
    } catch (error) {
      console.error('Failed to update entry:', error)
      throw error
    }
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      const result = await deleteTimeEntries([id])
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete entry')
      }
      await refreshData()
    } catch (error) {
      console.error('Failed to delete entry:', error)
      throw error
    }
  }

  const handleDuplicateEntry = async (entry: TimeEntry) => {
    try {
      const duplicateData: CreateEntryInput = {
        task: entry.task,
        otherTask: entry.otherTask,
        minutes: entry.minutes,
        occurredOn: new Date().toISOString().split('T')[0], // Today
        comment: entry.comment
      }
      const result = await createTimeEntry(duplicateData)
      if (!result.success) {
        throw new Error(result.error || 'Failed to duplicate entry')
      }
      await refreshData()
    } catch (error) {
      console.error('Failed to duplicate entry:', error)
      throw error
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      const result = await deleteTimeEntries(ids)
      if (!result.success) {
        throw new Error(result.error || 'Failed to bulk delete entries')
      }
      await refreshData()
    } catch (error) {
      console.error('Failed to bulk delete entries:', error)
      throw error
    }
  }

  const handleBulkDuplicate = async (entries: TimeEntry[]) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const duplicatePromises = entries.map(entry => 
        createTimeEntry({
          task: entry.task,
          otherTask: entry.otherTask,
          minutes: entry.minutes,
          occurredOn: today,
          comment: entry.comment
        })
      )
      
      const results = await Promise.all(duplicatePromises)
      const failedResults = results.filter(result => !result.success)
      
      if (failedResults.length > 0) {
        throw new Error(`Failed to duplicate ${failedResults.length} entries`)
      }
      
      await refreshData()
    } catch (error) {
      console.error('Failed to bulk duplicate entries:', error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900 mx-auto mb-4" aria-label="Loading"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Profile Completion Prompt */}
        <ProfileCompletionPrompt />
        
        {/* Migration Prompt */}
        {showMigrationPrompt && migrationStatus && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Migrate Your Data to Cloud Storage
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-3">
                  We found {migrationStatus.localStorageCount} time entries in your browser storage. 
                  Would you like to migrate them to our secure cloud database? This will make your data 
                  accessible across all your devices and enable admin features.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleMigration}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Migrate Data ({migrationStatus.localStorageCount} entries)
                  </button>
                  <button
                    onClick={() => setShowMigrationPrompt(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Not Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Today Summary Section */}
        <section aria-labelledby="summary-title" className="mb-8">
          <h2 id="summary-title" className="sr-only">Today Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 p-4 min-h-20 flex flex-col items-center justify-center">
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100" aria-label={`${todayTotals.total} minutes total today`}>
                {todayTotals.total} min
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Today Total</div>
            </div>
            
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 p-4 min-h-20 flex flex-col items-center justify-center">
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100" aria-label={`${todayTotals['Patient Care - Prospective Audit & Feedback']} minutes of PAF activities today`}>
                {todayTotals['Patient Care - Prospective Audit & Feedback']} min
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">PAF Today</div>
            </div>
            
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 p-4 min-h-20 flex flex-col items-center justify-center">
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100" aria-label={`${todayTotals['Patient Care - Authorization of Restricted Antimicrobials']} minutes of authorization activities today`}>
                {todayTotals['Patient Care - Authorization of Restricted Antimicrobials']} min
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">Auth Restricted Today</div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Pane: Quick Log Form */}
          <div className="w-full">
            <QuickLog onSubmit={handleCreateEntry} />
          </div>

          {/* Right Pane: History Panel */}
          <div className="w-full">
            <HistoryPanel
              entries={entries}
              onUpdateEntry={handleUpdateEntry}
              onDeleteEntry={handleDeleteEntry}
              onDuplicateEntry={handleDuplicateEntry}
              onBulkDelete={handleBulkDelete}
              onBulkDuplicate={handleBulkDuplicate}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default DashboardPage 