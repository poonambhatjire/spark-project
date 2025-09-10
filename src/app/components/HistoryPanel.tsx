"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"

import { Badge } from "@/app/components/ui/badge"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Textarea } from "@/app/components/ui/textarea"
import { Search, Filter, SortAsc, SortDesc, Edit2, Copy, Trash2, X, Check, Download, ChevronDown } from "lucide-react"
import { useDebounce } from "@/app/hooks/useDebounce"
import { TimeEntry, Activity, UpdateEntryInput } from "@/app/dashboard/data/client"
import { exportEntriesToCsv } from "@/app/lib/utils/csv"
import { Toast, useToast } from "@/app/components/ui/toast"
import { telemetry } from "@/lib/telemetry"

// Types
interface HistoryPanelProps {
  entries: TimeEntry[]
  onUpdateEntry: (id: string, updates: UpdateEntryInput) => Promise<void>
  onDeleteEntry: (id: string) => Promise<void>
  onDuplicateEntry: (entry: TimeEntry) => Promise<void>
  onBulkDelete: (ids: string[]) => Promise<void>
  onBulkDuplicate: (entries: TimeEntry[]) => Promise<void>
}

type SortField = 'occurredOn' | 'task' | 'minutes'
type SortDirection = 'asc' | 'desc'
type DateRange = 'today' | 'week'

// Task options for filtering
const TASK_OPTIONS = [
  // Patient Care
  { value: "PAF", label: "Patient Care - Prospective Audit & Feedback" },
  { value: "AUTH_RESTRICTED_ANTIMICROBIALS", label: "Patient Care - Authorization of Restricted Antimicrobials" },
  { value: "CLINICAL_ROUNDS", label: "Patient Care - Participating in Clinical Rounds" },
  // Administrative
  { value: "GUIDELINES_EHR", label: "Administrative - Guidelines/EHR" },
  // Tracking
  { value: "AMU", label: "Tracking - AMU" },
  { value: "AMR", label: "Tracking - AMR" },
  { value: "ANTIBIOTIC_APPROPRIATENESS", label: "Tracking - Antibiotic Appropriateness" },
  { value: "INTERVENTION_ACCEPTANCE", label: "Tracking - Intervention Acceptance" },
  // Reporting
  { value: "SHARING_DATA", label: "Reporting - sharing data with prescribers/decision makers" },
  // Education
  { value: "PROVIDING_EDUCATION", label: "Education - Providing Education" },
  { value: "RECEIVING_EDUCATION", label: "Education - Receiving Education (e.g. CE)" },
  // Administrative
  { value: "COMMITTEE_WORK", label: "Administrative - Committee Work" },
  { value: "QI_PROJECTS_RESEARCH", label: "Administrative - QI projects/research" },
  { value: "EMAILS", label: "Administrative - Emails" },
  // Other
  { value: "OTHER", label: "Other - specify in comments" }
]

export function HistoryPanel({
  entries,
  onUpdateEntry,
  onDeleteEntry,
  onDuplicateEntry,
  onBulkDelete,
  onBulkDuplicate
}: HistoryPanelProps) {
  // State
  const [dateRange, setDateRange] = useState<DateRange>('today')
  const [selectedTasks, setSelectedTasks] = useState<Activity[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('occurredOn')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingMinutes, setEditingMinutes] = useState('')
  const [editingComment, setEditingComment] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [showExportDropdown, setShowExportDropdown] = useState(false)

  // Refs for focus management
  const exportButtonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const editingMinutesRef = useRef<HTMLInputElement>(null)
  const editingCommentRef = useRef<HTMLTextAreaElement>(null)

  // Toast notifications
  const { toasts, showToast, removeToast } = useToast()

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Filter and sort entries
  const filteredAndSortedEntries = useMemo(() => {
    // Find the most recent date in the data for "Today" filter
    const mostRecentDate = entries.length > 0 
      ? new Date(Math.max(...entries.map(entry => {
          // Parse date string as local date, not UTC
          const [year, month, day] = entry.occurredOn.split('-').map(Number)
          return new Date(year, month - 1, day).getTime()
        })))
      : new Date()
    mostRecentDate.setHours(0, 0, 0, 0)
    
    const filtered = entries.filter(entry => {
      // Date range filter - parse dates as local dates
      const [entryYear, entryMonth, entryDay] = entry.occurredOn.split('-').map(Number)
      const entryDate = new Date(entryYear, entryMonth - 1, entryDay)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (dateRange === 'today') {
        const entryDateOnly = new Date(entryYear, entryMonth - 1, entryDay)
        entryDateOnly.setHours(0, 0, 0, 0)
        
        // Debug logging with expanded values
        console.log('Today filter details:', {
          entryDate: entry.occurredOn,
          entryDateOnly: entryDateOnly.toISOString(),
          today: today.toISOString(),
          mostRecentDate: mostRecentDate.toISOString(),
          entryDay: entryDateOnly.getDate(),
          todayDay: today.getDate(),
          entryMonth: entryDateOnly.getMonth() + 1,
          todayMonth: today.getMonth() + 1,
          entryYear: entryDateOnly.getFullYear(),
          todayYear: today.getFullYear(),
          isExactMatch: entryDateOnly.getTime() === today.getTime(),
          isMostRecentMatch: entryDateOnly.getTime() === mostRecentDate.getTime()
        })
        
        // Show entries from the most recent date in the data
        const exactMatch = entryDateOnly.getTime() === today.getTime()
        const mostRecentMatch = entryDateOnly.getTime() === mostRecentDate.getTime()
        
        console.log('Match results:', { exactMatch, mostRecentMatch })
        
        // Use exact date match for production, but allow most recent date for demo
        if (!exactMatch && !mostRecentMatch) return false
      } else if (dateRange === 'week') {
        const weekAgo = new Date(today)
        weekAgo.setDate(today.getDate() - 7)
        if (entryDate < weekAgo) return false
      }

      // Task filter
      if (selectedTasks.length > 0 && !selectedTasks.includes(entry.task)) {
        return false
      }

      // Search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase()
        const commentMatch = entry.comment?.toLowerCase().includes(searchLower)
        const otherTaskMatch = entry.otherTask?.toLowerCase().includes(searchLower)
        if (!commentMatch && !otherTaskMatch) return false
      }

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: number | string, bValue: number | string
      
      switch (sortField) {
        case 'occurredOn':
          aValue = new Date(a.occurredOn).getTime()
          bValue = new Date(b.occurredOn).getTime()
          break
        case 'task':
          aValue = (a.otherTask || a.task).toLowerCase()
          bValue = (b.otherTask || b.task).toLowerCase()
          break
        case 'minutes':
          aValue = a.minutes
          bValue = b.minutes
          break
        default:
          return 0
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    console.log('Filtering results:', {
      totalEntries: entries.length,
      filteredCount: filtered.length,
      dateRange,
      selectedTasks: selectedTasks.length,
      searchQuery: debouncedSearch,
      filteredEntries: filtered.map(entry => ({
        id: entry.id,
        date: entry.occurredOn,
        task: entry.task
      }))
    })

    return filtered
  }, [entries, dateRange, selectedTasks, debouncedSearch, sortField, sortDirection])

  // Export functions
  const handleExportCsv = useCallback(() => {
    try {
      exportEntriesToCsv(filteredAndSortedEntries, dateRange)
      
      // Track telemetry
      telemetry.trackExportCsv(filteredAndSortedEntries.length)
      
      showToast(`Exported ${filteredAndSortedEntries.length} entries to CSV`, 'success')
      setShowExportDropdown(false)
      // Return focus to export button
      setTimeout(() => exportButtonRef.current?.focus(), 100)
    } catch (error) {
      console.error('Export failed:', error)
      showToast('Failed to export CSV file', 'error')
    }
  }, [filteredAndSortedEntries, dateRange, showToast])

  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
    setEditingMinutes('')
    setEditingComment('')
  }, [])

  // Handle escape key to close dropdowns and cancel editing
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showExportDropdown) {
          setShowExportDropdown(false)
          exportButtonRef.current?.focus()
        }
        if (editingId) {
          handleCancelEdit()
        }
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false)
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showExportDropdown, editingId, showDeleteConfirm, handleCancelEdit])

  // Handle click outside to close export dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showExportDropdown && exportButtonRef.current && !exportButtonRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false)
      }
    }

    if (showExportDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportDropdown])

  // Bulk selection
  const allSelected = filteredAndSortedEntries.length > 0 && 
    filteredAndSortedEntries.every(entry => selectedIds.has(entry.id))
  const someSelected = filteredAndSortedEntries.some(entry => selectedIds.has(entry.id))

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredAndSortedEntries.map(entry => entry.id)))
    }
  }, [allSelected, filteredAndSortedEntries])

  const handleSelectEntry = useCallback((id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }, [selectedIds])

  // Inline editing
  const handleStartEdit = useCallback((entry: TimeEntry) => {
    setEditingId(entry.id)
    setEditingMinutes(entry.minutes.toString())
    setEditingComment(entry.comment || '')
    // Focus the minutes input after a short delay
    setTimeout(() => editingMinutesRef.current?.focus(), 100)
  }, [])

  const handleSaveEdit = useCallback(async () => {
    if (editingId) {
      try {
        const entry = filteredAndSortedEntries.find(e => e.id === editingId)
        await onUpdateEntry(editingId, {
          minutes: parseInt(editingMinutes) || 0,
          comment: editingComment
        })
        
        // Track telemetry
        if (entry) {
          telemetry.trackEntryUpdated(entry.task, parseInt(editingMinutes) || 0)
        }
        
        setEditingId(null)
        setEditingMinutes('')
        setEditingComment('')
        showToast('Entry updated successfully', 'success')
      } catch {
        showToast('Failed to update entry', 'error')
      }
    }
  }, [editingId, editingMinutes, editingComment, onUpdateEntry, showToast, filteredAndSortedEntries])

  // Handle keyboard navigation for inline editing
  const handleEditKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancelEdit()
    }
  }, [handleSaveEdit, handleCancelEdit])

  // Bulk actions
  const handleBulkDelete = useCallback(async () => {
    const idsToDelete = Array.from(selectedIds)
    setDeletingIds(new Set(idsToDelete))
    try {
      await onBulkDelete(idsToDelete)
      
      // Track telemetry
      telemetry.trackBulkDelete(idsToDelete.length)
      
      setSelectedIds(new Set())
      showToast(`Deleted ${idsToDelete.length} entries`, 'success')
    } catch {
      showToast('Failed to delete entries', 'error')
    } finally {
      setDeletingIds(new Set())
    }
  }, [selectedIds, onBulkDelete, showToast])

  const handleBulkDuplicate = useCallback(async () => {
    const entriesToDuplicate = filteredAndSortedEntries.filter(entry => selectedIds.has(entry.id))
    try {
      await onBulkDuplicate(entriesToDuplicate)
      
      // Track telemetry
      telemetry.trackBulkDuplicate(entriesToDuplicate.length)
      
      setSelectedIds(new Set())
      showToast(`Duplicated ${entriesToDuplicate.length} entries`, 'success')
    } catch {
      showToast('Failed to duplicate entries', 'error')
    }
  }, [selectedIds, filteredAndSortedEntries, onBulkDuplicate, showToast])

  // Sort controls
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    
    // Track telemetry
    telemetry.trackSortChanged(field)
  }, [sortField, sortDirection])

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
        {/* Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between mb-4">
          <div>
            <h2 className="page-title font-semibold text-slate-900 dark:text-slate-100">History</h2>
          </div>
          
          {/* Export Dropdown */}
          <div className="relative">
            <Button
              ref={exportButtonRef}
              variant="outline"
              size="sm"
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center gap-2 min-h-11"
              aria-expanded={showExportDropdown}
              aria-haspopup="true"
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            {showExportDropdown && (
              <div 
                className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-50 min-w-48"
                role="menu"
                aria-label="Export options"
              >
                <div className="py-1">
                  <button
                    onClick={handleExportCsv}
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 min-h-11"
                    role="menuitem"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV ({filteredAndSortedEntries.length} entries)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="space-y-4 mb-6">
          {/* Top row: Date Range and Task Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date Range */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Range:</span>
              <div className="flex border border-slate-300 dark:border-slate-600 rounded-lg" role="group" aria-label="Date range selection">
                <Button
                  variant={dateRange === 'today' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setDateRange('today')
                    telemetry.trackFilterChanged('date_range_today')
                  }}
                  className="rounded-r-none border-r border-slate-300 dark:border-slate-600 min-h-11"
                  aria-pressed={dateRange === 'today'}
                >
                  Today
                </Button>
                <Button
                  variant={dateRange === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setDateRange('week')
                    telemetry.trackFilterChanged('date_range_week')
                  }}
                  className="rounded-l-none min-h-11"
                  aria-pressed={dateRange === 'week'}
                >
                  This Week
                </Button>
              </div>
            </div>

            {/* Task Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="task-filter" className="text-sm font-medium text-slate-700 dark:text-slate-300">Tasks:</label>
              <Select
                value={selectedTasks.join(',')}
                onValueChange={(value) => {
                  setSelectedTasks(value ? value.split(',') as Activity[] : [])
                  telemetry.trackFilterChanged('task_filter')
                }}
              >
                <SelectTrigger id="task-filter" className="w-[45rem] min-h-11">
                  <SelectValue placeholder="All tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All tasks</SelectItem>
                  {TASK_OPTIONS.map(task => (
                    <SelectItem key={task.value} value={task.value}>
                      {task.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bottom row: Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              ref={searchInputRef}
              placeholder="Search comments and task names..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value) {
                  telemetry.trackSearchUsed()
                }
              }}
              className="pl-16 min-h-11"
              aria-label="Search entries"
            />
          </div>
        </div>

          {/* Bulk Actions */}
          {someSelected && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg mb-4" role="region" aria-label="Bulk actions">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {selectedIds.size} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDuplicate}
                disabled={deletingIds.size > 0}
                className="min-h-11"
              >
                <Copy className="w-4 h-4 mr-1" />
                Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deletingIds.size > 0}
                className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 min-h-11"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="text-left py-2 px-2 font-medium text-slate-700 dark:text-slate-300 w-8">
                    <Checkbox
                      checked={allSelected}
                      ref={ref => {
                        if (ref) ref.indeterminate = someSelected && !allSelected
                      }}
                      onCheckedChange={handleSelectAll}
                      aria-label={allSelected ? "Deselect all entries" : "Select all entries"}
                    />
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-slate-700 dark:text-slate-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('occurredOn')}
                      className="h-auto p-0 font-medium hover:bg-transparent min-h-11"
                      aria-label={`Sort by date ${sortField === 'occurredOn' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
                    >
                      Date {getSortIcon('occurredOn')}
                    </Button>
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-slate-700 dark:text-slate-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('task')}
                      className="h-auto p-0 font-medium hover:bg-transparent min-h-11"
                      aria-label={`Sort by task ${sortField === 'task' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
                    >
                      Task {getSortIcon('task')}
                    </Button>
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-slate-700 dark:text-slate-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('minutes')}
                      className="h-auto p-0 font-medium hover:bg-transparent min-h-11"
                      aria-label={`Sort by minutes ${sortField === 'minutes' ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
                    >
                      Minutes {getSortIcon('minutes')}
                    </Button>
                  </th>
                  <th className="text-left py-2 px-2 font-medium text-slate-700 dark:text-slate-300">Comment</th>
                  <th className="text-right py-2 px-2 font-medium text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="[&>tr>td]:align-top">
                {filteredAndSortedEntries.map((entry) => (
                  <tr 
                    key={entry.id} 
                    className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      deletingIds.has(entry.id) ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="py-2 px-2">
                      <Checkbox
                        checked={selectedIds.has(entry.id)}
                        onCheckedChange={() => handleSelectEntry(entry.id)}
                        aria-label={`Select entry from ${(() => {
                          const [year, month, day] = entry.occurredOn.split('-').map(Number)
                          return new Date(year, month - 1, day).toLocaleDateString()
                        })()}`}
                      />
                    </td>
                    <td className="py-2 px-2 text-slate-600 dark:text-slate-300">
                      {(() => {
                        const [year, month, day] = entry.occurredOn.split('-').map(Number)
                        return new Date(year, month - 1, day).toLocaleDateString()
                      })()}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {entry.task === 'Other - specify in comments' ? 'Other' : entry.task}
                        </Badge>
                        {entry.otherTask && (
                          <span className="text-slate-900 dark:text-slate-100">{entry.otherTask}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      {editingId === entry.id ? (
                        <Input
                          ref={editingMinutesRef}
                          type="number"
                          value={editingMinutes}
                          onChange={(e) => setEditingMinutes(e.target.value)}
                          className="w-20 h-8 text-sm min-h-[32px]"
                          min={1}
                          max={480}
                          onKeyDown={handleEditKeyDown}
                          aria-label="Edit minutes"
                        />
                      ) : (
                        <span className="text-slate-600 dark:text-slate-300">{entry.minutes}</span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      {editingId === entry.id ? (
                        <Textarea
                          ref={editingCommentRef}
                          value={editingComment}
                          onChange={(e) => setEditingComment(e.target.value)}
                          className="w-full h-8 text-sm resize-none min-h-[32px]"
                          placeholder="Add comment..."
                          onKeyDown={handleEditKeyDown}
                          aria-label="Edit comment"
                        />
                      ) : (
                        <span className="text-slate-600 dark:text-slate-300 break-words max-w-[32rem]">
                          {entry.comment || '-'}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center justify-end gap-1">
                        {editingId === entry.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleSaveEdit}
                              className="h-8 w-8 p-0 min-h-[32px] min-w-[32px]"
                              aria-label="Save changes"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEdit}
                              className="h-8 w-8 p-0 min-h-[32px] min-w-[32px]"
                              aria-label="Cancel editing"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleStartEdit(entry)}
                              className="h-8 w-8 p-0 min-h-[32px] min-w-[32px]"
                              aria-label={`Edit entry from ${(() => {
                                const [year, month, day] = entry.occurredOn.split('-').map(Number)
                                return new Date(year, month - 1, day).toLocaleDateString()
                              })()}`}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                onDuplicateEntry(entry)
                                telemetry.trackEntryDuplicated(entry.task)
                              }}
                              className="h-8 w-8 p-0 min-h-[32px] min-w-[32px]"
                              aria-label={`Duplicate entry from ${(() => {
                                const [year, month, day] = entry.occurredOn.split('-').map(Number)
                                return new Date(year, month - 1, day).toLocaleDateString()
                              })()}`}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                onDeleteEntry(entry.id)
                                telemetry.trackEntryDeleted(entry.task)
                              }}
                              className="h-8 w-8 p-0 min-h-[32px] min-w-[32px] text-red-600 hover:text-red-700"
                              aria-label={`Delete entry from ${(() => {
                                const [year, month, day] = entry.occurredOn.split('-').map(Number)
                                return new Date(year, month - 1, day).toLocaleDateString()
                              })()}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredAndSortedEntries.length === 0 && (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div className="text-slate-400 dark:text-slate-500 mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                {entries.length === 0 ? 'No entries yet' : 'No entries match your filters'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {entries.length === 0 
                  ? 'Start logging your AMS activities to see them here.'
                  : 'Try adjusting your filters or search terms.'
                }
              </p>
              {entries.length === 0 && (
                <Button 
                  onClick={() => document.getElementById('task-filter')?.focus()}
                  className="bg-red-900 hover:bg-red-800 min-h-11"
                >
                  Add Your First Entry
                </Button>
              )}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-confirm-title"
              aria-describedby="delete-confirm-description"
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md mx-4">
                <h3 id="delete-confirm-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Confirm Delete
                </h3>
                <p id="delete-confirm-description" className="text-slate-600 dark:text-slate-300 mb-4">
                  Are you sure you want to delete {selectedIds.size} selected {selectedIds.size === 1 ? 'entry' : 'entries'}? This action cannot be undone.
                </p>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="min-h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleBulkDelete()
                      setShowDeleteConfirm(false)
                    }}
                    className="min-h-11"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* Click outside to close export dropdown */}
      {showExportDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowExportDropdown(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
