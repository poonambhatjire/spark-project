"use client"

import { useState, useEffect } from "react"

import { QuickLog } from "@/app/components/QuickLog"
import { HistoryPanel } from "@/app/components/HistoryPanel"
import { 
  timeEntryClient, 
  TimeEntry, 
  CreateEntryInput, 
  UpdateEntryInput,
  TodayTotals
} from "@/app/dashboard/data/client"

const DashboardPage = () => {
  // State
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [todayTotals, setTodayTotals] = useState<TodayTotals>({
    total: 0,
    // Patient Care
    PAF: 0,
    AUTH_RESTRICTED_ANTIMICROBIALS: 0,
    CLINICAL_ROUNDS: 0,
    // Administrative
    GUIDELINES_EHR: 0,
    // Tracking
    AMU: 0,
    AMR: 0,
    ANTIBIOTIC_APPROPRIATENESS: 0,
    INTERVENTION_ACCEPTANCE: 0,
    // Reporting
    SHARING_DATA: 0,
    // Education
    PROVIDING_EDUCATION: 0,
    RECEIVING_EDUCATION: 0,
    // Administrative
    COMMITTEE_WORK: 0,
    QI_PROJECTS_RESEARCH: 0,
    EMAILS: 0,
    // Other
    OTHER: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [entriesData, totalsData] = await Promise.all([
          timeEntryClient.listEntries({ range: 'week' }),
          timeEntryClient.getTodayTotals(),
        ])
        
        setEntries(entriesData)
        setTodayTotals(totalsData)
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
        const [entriesData, totalsData] = await Promise.all([
          timeEntryClient.listEntries({ range: 'week' }),
          timeEntryClient.getTodayTotals(),
        ])
        
        setEntries(entriesData)
        setTodayTotals(totalsData)
    } catch (error) {
      console.error('Failed to refresh data:', error)
    }
  }

  // Event handlers
  const handleCreateEntry = async (data: CreateEntryInput) => {
    try {
      await timeEntryClient.createEntry(data)
      await refreshData()
    } catch (error) {
      console.error('Failed to create entry:', error)
      throw error
    }
  }

  const handleUpdateEntry = async (id: string, updates: UpdateEntryInput) => {
    try {
      await timeEntryClient.updateEntry(id, updates)
      await refreshData()
    } catch (error) {
      console.error('Failed to update entry:', error)
      throw error
    }
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      await timeEntryClient.deleteEntries([id])
      await refreshData()
    } catch (error) {
      console.error('Failed to delete entry:', error)
      throw error
    }
  }

  const handleDuplicateEntry = async (entry: TimeEntry) => {
    try {
      await timeEntryClient.duplicateEntry(entry)
      await refreshData()
    } catch (error) {
      console.error('Failed to duplicate entry:', error)
      throw error
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await timeEntryClient.deleteEntries(ids)
      await refreshData()
    } catch (error) {
      console.error('Failed to bulk delete entries:', error)
      throw error
    }
  }

  const handleBulkDuplicate = async (entries: TimeEntry[]) => {
    try {
      await timeEntryClient.bulkDuplicateEntries(entries)
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
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100" aria-label={`${todayTotals.PAF} minutes of PAF activities today`}>
                {todayTotals.PAF} min
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">PAF Today</div>
            </div>
            
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 p-4 min-h-20 flex flex-col items-center justify-center">
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100" aria-label={`${todayTotals.AUTH_RESTRICTED_ANTIMICROBIALS} minutes of authorization activities today`}>
                {todayTotals.AUTH_RESTRICTED_ANTIMICROBIALS} min
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