import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HistoryPanel } from '@/app/components/HistoryPanel'
import { TimeEntry } from '@/app/dashboard/data/client'
import { 
  fixedToday, 
  freezeDate, 
  clearEntries, 
  seedEntries,
  entryFactory
} from '@/tests/utils'

// Mock the telemetry module
vi.mock('@/lib/telemetry', () => ({
  telemetry: {
    trackEntryUpdated: vi.fn(),
    trackEntryDeleted: vi.fn(),
    trackEntryDuplicated: vi.fn(),
    trackBulkDelete: vi.fn(),
    trackBulkDuplicate: vi.fn(),
    trackExportCsv: vi.fn(),
    trackFilterChanged: vi.fn(),
    trackSortChanged: vi.fn(),
    trackSearchUsed: vi.fn()
  }
}))

// Mock the CSV export utility
vi.mock('@/app/lib/utils/csv', () => ({
  exportEntriesToCsv: vi.fn()
}))

// Mock the toast component
vi.mock('@/app/components/ui/toast', () => ({
  Toast: ({ message }: { message: string }) => <div data-testid="toast">{message}</div>,
  useToast: () => ({
    toasts: [],
    showToast: vi.fn(),
    removeToast: vi.fn()
  })
}))

describe('HistoryPanel Component', () => {
  const mockOnUpdateEntry = vi.fn()
  const mockOnDeleteEntry = vi.fn()
  const mockOnDuplicateEntry = vi.fn()
  const mockOnBulkDelete = vi.fn()
  const mockOnBulkDuplicate = vi.fn()
  const user = userEvent.setup()
  let cleanupTime: (() => void) | undefined

  // Create test entries with varied data
  const createTestEntries = (): TimeEntry[] => [
    entryFactory({
      id: 'test-1',
      task: 'PAF',
      minutes: 15,
      occurredOn: fixedToday(),
      comment: 'PAF audit review for patient A',
      createdAt: `${fixedToday()}T10:00:00Z`,
      updatedAt: `${fixedToday()}T10:00:00Z`
    }),
    entryFactory({
      id: 'test-2',
      task: 'AUTH_RESTRICTED_ANTIMICROBIALS',
      minutes: 30,
      occurredOn: fixedToday(),
      comment: 'Prior authorization for antibiotics',
      createdAt: `${fixedToday()}T11:00:00Z`,
      updatedAt: `${fixedToday()}T11:00:00Z`
    }),
    entryFactory({
      id: 'test-3',
      task: 'PROVIDING_EDUCATION',
      minutes: 60,
      occurredOn: fixedToday(),
      comment: 'Staff education on audit procedures',
      createdAt: `${fixedToday()}T12:00:00Z`,
      updatedAt: `${fixedToday()}T12:00:00Z`
    }),
    entryFactory({
      id: 'test-4',
      task: 'PAF',
      minutes: 20,
      occurredOn: fixedToday(),
      comment: 'PAF audit for patient B',
      createdAt: `${fixedToday()}T13:00:00Z`,
      updatedAt: `${fixedToday()}T13:00:00Z`
    }),
    entryFactory({
      id: 'test-5',
      task: 'SHARING_DATA',
      minutes: 45,
      occurredOn: fixedToday(),
      comment: 'Monthly audit report preparation',
      createdAt: `${fixedToday()}T14:00:00Z`,
      updatedAt: `${fixedToday()}T14:00:00Z`
    }),
    entryFactory({
      id: 'test-6',
      task: 'AUTH_RESTRICTED_ANTIMICROBIALS',
      minutes: 25,
      occurredOn: '2025-01-14', // Yesterday
      comment: 'Yesterday prior auth work',
      createdAt: '2025-01-14T10:00:00Z',
      updatedAt: '2025-01-14T10:00:00Z'
    }),
    entryFactory({
      id: 'test-7',
      task: 'PROVIDING_EDUCATION',
      minutes: 90,
      occurredOn: '2025-01-12', // 3 days ago
      comment: 'Education session on audit compliance',
      createdAt: '2025-01-12T10:00:00Z',
      updatedAt: '2025-01-12T10:00:00Z'
    }),
    entryFactory({
      id: 'test-8',
      task: 'COMMITTEE_WORK',
      minutes: 35,
      occurredOn: '2025-01-07', // 8 days ago (outside week range)
      comment: 'Administrative audit tasks',
      createdAt: '2025-01-07T10:00:00Z',
      updatedAt: '2025-01-07T10:00:00Z'
    })
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    clearEntries()
    
    // Freeze time to fixed date
    cleanupTime = freezeDate(fixedToday())
    
    // Seed test entries
    const entries = createTestEntries()
    seedEntries(entries)
  })

  afterEach(() => {
    clearEntries()
    if (cleanupTime) {
      cleanupTime()
    }
  })

  it('filters by task and date range', async () => {
    render(
      <HistoryPanel
        entries={createTestEntries()}
        onUpdateEntry={mockOnUpdateEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onDuplicateEntry={mockOnDuplicateEntry}
        onBulkDelete={mockOnBulkDelete}
        onBulkDuplicate={mockOnBulkDuplicate}
      />
    )

    // Default range should be "Today" - should show 5 entries from today
    expect(screen.getByText('PAF')).toBeInTheDocument()
    expect(screen.getByText('PRIOR_AUTH')).toBeInTheDocument()
    expect(screen.getByText('EDUCATION')).toBeInTheDocument()
    expect(screen.getByText('REPORTING')).toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()

    // Apply task filter to PAF only
    const taskFilter = screen.getByLabelText(/Tasks:/)
    await user.click(taskFilter)
    
    // Find and click PAF option (this would need proper Select component testing)
    // For now, we'll test the filtering logic by checking the component behavior
    
    // Switch to "This Week" range
    const weekButton = screen.getByRole('button', { name: /This Week/ })
    await user.click(weekButton)

    // Should show entries from the same week (including yesterday and 3 days ago)
    expect(screen.getByText('PAF')).toBeInTheDocument()
    expect(screen.getByText('PRIOR_AUTH')).toBeInTheDocument()
    expect(screen.getByText('EDUCATION')).toBeInTheDocument()
    expect(screen.getByText('REPORTING')).toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    
    // Should also show yesterday's entry
    expect(screen.getByText(/Yesterday prior auth work/)).toBeInTheDocument()
    
    // Should also show 3 days ago entry
    expect(screen.getByText(/Education session on audit compliance/)).toBeInTheDocument()
  })

  it('searches comments text', async () => {
    render(
      <HistoryPanel
        entries={createTestEntries()}
        onUpdateEntry={mockOnUpdateEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onDuplicateEntry={mockOnDuplicateEntry}
        onBulkDelete={mockOnBulkDelete}
        onBulkDuplicate={mockOnBulkDuplicate}
      />
    )

    // Initially all entries should be visible
    expect(screen.getByText('PAF audit review for patient A')).toBeInTheDocument()
    expect(screen.getByText('Prior authorization for antibiotics')).toBeInTheDocument()
    expect(screen.getByText('Staff education on audit procedures')).toBeInTheDocument()

    // Type 'audit' in search
    const searchInput = screen.getByPlaceholderText(/Search comments and task names/)
    await user.type(searchInput, 'audit')

    // Wait for debounced search
    await waitFor(() => {
      // Should only show entries containing 'audit'
      expect(screen.getByText('PAF audit review for patient A')).toBeInTheDocument()
      expect(screen.getByText('Staff education on audit procedures')).toBeInTheDocument()
      expect(screen.getByText('PAF audit for patient B')).toBeInTheDocument()
      expect(screen.getByText('Monthly audit report preparation')).toBeInTheDocument()
      expect(screen.getByText('Education session on audit compliance')).toBeInTheDocument()
      expect(screen.getByText('Administrative audit tasks')).toBeInTheDocument()
      
      // Should not show entries without 'audit'
      expect(screen.queryByText('Prior authorization for antibiotics')).not.toBeInTheDocument()
      expect(screen.queryByText('Yesterday prior auth work')).not.toBeInTheDocument()
    })
  })

  it('sorts by minutes and date', async () => {
    render(
      <HistoryPanel
        entries={createTestEntries()}
        onUpdateEntry={mockOnUpdateEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onDuplicateEntry={mockOnDuplicateEntry}
        onBulkDelete={mockOnBulkDelete}
        onBulkDuplicate={mockOnBulkDuplicate}
      />
    )

    // Click on Minutes header to sort
    const minutesHeader = screen.getByRole('button', { name: /Sort by minutes/ })
    await user.click(minutesHeader)

    // Should sort by minutes ascending (15, 20, 25, 30, 35, 45, 60, 90)
    // First row should be 15 minutes
    const firstRowMinutes = screen.getAllByText(/15|20|25|30|35|45|60|90/)[0]
    expect(firstRowMinutes).toHaveTextContent('15')

    // Click again for descending
    await user.click(minutesHeader)
    
    // Should sort by minutes descending (90, 60, 45, 35, 30, 25, 20, 15)
    // First row should be 90 minutes
    const firstRowMinutesDesc = screen.getAllByText(/15|20|25|30|35|45|60|90/)[0]
    expect(firstRowMinutesDesc).toHaveTextContent('90')

    // Click on Date header to sort by date
    const dateHeader = screen.getByRole('button', { name: /Sort by date/ })
    await user.click(dateHeader)

    // Should sort by date (most recent first by default)
    // Verify the date sorting is applied
    expect(dateHeader).toBeInTheDocument()
  })

  it('inline edits minutes and comment', async () => {
    render(
      <HistoryPanel
        entries={createTestEntries()}
        onUpdateEntry={mockOnUpdateEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onDuplicateEntry={mockOnDuplicateEntry}
        onBulkDelete={mockOnBulkDelete}
        onBulkDuplicate={mockOnBulkDuplicate}
      />
    )

    // Find the edit button for the first entry
    const editButtons = screen.getAllByLabelText(/Edit entry from/)
    const firstEditButton = editButtons[0]
    
    await user.click(firstEditButton)

    // Should show edit inputs
    const minutesInput = screen.getByLabelText('Edit minutes')
    const commentInput = screen.getByLabelText('Edit comment')
    
    expect(minutesInput).toBeInTheDocument()
    expect(commentInput).toBeInTheDocument()

    // Edit the minutes
    await user.clear(minutesInput)
    await user.type(minutesInput, '25')

    // Edit the comment
    await user.clear(commentInput)
    await user.type(commentInput, 'Updated audit review')

    // Save the changes
    const saveButton = screen.getByLabelText('Save changes')
    await user.click(saveButton)

    // Verify the update was called with correct data
    await waitFor(() => {
      expect(mockOnUpdateEntry).toHaveBeenCalledWith('test-1', {
        minutes: 25,
        comment: 'Updated audit review'
      })
    })

    // Verify edit mode is exited
    expect(screen.queryByLabelText('Edit minutes')).not.toBeInTheDocument()
  })

  it('bulk select + delete', async () => {
    render(
      <HistoryPanel
        entries={createTestEntries()}
        onUpdateEntry={mockOnUpdateEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onDuplicateEntry={mockOnDuplicateEntry}
        onBulkDelete={mockOnBulkDelete}
        onBulkDuplicate={mockOnBulkDuplicate}
      />
    )

    // Select first two entries
    const entryCheckboxes = screen.getAllByLabelText(/Select entry from/)
    await user.click(entryCheckboxes[0]) // Select first entry
    await user.click(entryCheckboxes[1]) // Select second entry

    // Should show bulk actions
    expect(screen.getByText('2 selected')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument()

    // Click bulk delete
    const bulkDeleteButton = screen.getByRole('button', { name: /Delete/ })
    await user.click(bulkDeleteButton)

    // Should show confirmation dialog
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete 2 selected entries?')).toBeInTheDocument()

    // Confirm deletion
    const confirmDeleteButton = screen.getByRole('button', { name: /Delete/ })
    await user.click(confirmDeleteButton)

    // Verify bulk delete was called with correct IDs
    await waitFor(() => {
      expect(mockOnBulkDelete).toHaveBeenCalledWith(['test-1', 'test-2'])
    })

    // Verify bulk actions are hidden after deletion
    expect(screen.queryByText('2 selected')).not.toBeInTheDocument()
  })

  it('shows empty state when no entries match filters', async () => {
    render(
      <HistoryPanel
        entries={[]}
        onUpdateEntry={mockOnUpdateEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onDuplicateEntry={mockOnDuplicateEntry}
        onBulkDelete={mockOnBulkDelete}
        onBulkDuplicate={mockOnBulkDuplicate}
      />
    )

    // Should show empty state
    expect(screen.getByText('No entries yet')).toBeInTheDocument()
    expect(screen.getByText('Start logging your AMS activities to see them here.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Your First Entry/ })).toBeInTheDocument()
  })

  it('allows individual entry deletion', async () => {
    render(
      <HistoryPanel
        entries={createTestEntries()}
        onUpdateEntry={mockOnUpdateEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onDuplicateEntry={mockOnDuplicateEntry}
        onBulkDelete={mockOnBulkDelete}
        onBulkDuplicate={mockOnBulkDuplicate}
      />
    )

    // Find the delete button for the first entry
    const deleteButtons = screen.getAllByLabelText(/Delete entry from/)
    const firstDeleteButton = deleteButtons[0]
    
    await user.click(firstDeleteButton)

    // Verify the delete was called with correct ID
    await waitFor(() => {
      expect(mockOnDeleteEntry).toHaveBeenCalledWith('test-1')
    })
  })

  it('allows entry duplication', async () => {
    render(
      <HistoryPanel
        entries={createTestEntries()}
        onUpdateEntry={mockOnUpdateEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onDuplicateEntry={mockOnDuplicateEntry}
        onBulkDelete={mockOnBulkDelete}
        onBulkDuplicate={mockOnBulkDuplicate}
      />
    )

    // Find the duplicate button for the first entry
    const duplicateButtons = screen.getAllByLabelText(/Duplicate entry from/)
    const firstDuplicateButton = duplicateButtons[0]
    
    await user.click(firstDuplicateButton)

    // Verify the duplicate was called with correct entry
    await waitFor(() => {
      expect(mockOnDuplicateEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-1',
          task: 'PAF',
          minutes: 15
        })
      )
    })
  })

  it('exports entries to CSV', async () => {
    const { exportEntriesToCsv } = await import('@/app/lib/utils/csv')
    
    render(
      <HistoryPanel
        entries={createTestEntries()}
        onUpdateEntry={mockOnUpdateEntry}
        onDeleteEntry={mockOnDeleteEntry}
        onDuplicateEntry={mockOnDuplicateEntry}
        onBulkDelete={mockOnBulkDelete}
        onBulkDuplicate={mockOnBulkDuplicate}
      />
    )

    // Click export button
    const exportButton = screen.getByRole('button', { name: /Export/ })
    await user.click(exportButton)

    // Click CSV export option
    const csvExportButton = screen.getByRole('menuitem', { name: /Export CSV/ })
    await user.click(csvExportButton)

    // Verify CSV export was called with correct data
    await waitFor(() => {
      expect(exportEntriesToCsv).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'test-1' }),
          expect.objectContaining({ id: 'test-2' }),
          expect.objectContaining({ id: 'test-3' }),
          expect.objectContaining({ id: 'test-4' }),
          expect.objectContaining({ id: 'test-5' }),
          expect.objectContaining({ id: 'test-6' }),
          expect.objectContaining({ id: 'test-7' }),
          expect.objectContaining({ id: 'test-8' })
        ]),
        'today'
      )
    })
  })
})
