import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from '@/app/dashboard/page'
import { 
  fixedToday, 
  freezeDate, 
  clearEntries,
  seedEntries,
  entryFactory
} from '@/tests/utils'

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

describe('Dashboard Telemetry', () => {
  const user = userEvent.setup()
  let cleanupTime: (() => void) | undefined
  let consoleSpy: any

  beforeEach(() => {
    vi.clearAllMocks()
    clearEntries()
    
    // Freeze time to fixed date
    cleanupTime = freezeDate(fixedToday())
    
    // Spy on console.log to capture telemetry events
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    clearEntries()
    if (cleanupTime) {
      cleanupTime()
    }
    consoleSpy.mockRestore()
  })

  it('tracks entry_created event when creating a new entry', async () => {
    render(<DashboardPage />)

    // Fill out the Quick Log form
    const taskSelect = screen.getByLabelText(/Task/i)
    await user.click(taskSelect)
    
    // Select PAF task (this would need proper Select component interaction)
    // For now, we'll test the telemetry call directly
    
    const minutesInput = screen.getByLabelText(/Minutes/i)
    await user.clear(minutesInput)
    await user.type(minutesInput, '30')

    const dateInput = screen.getByLabelText(/Date/i)
    await user.clear(dateInput)
    await user.type(dateInput, fixedToday())

    const commentInput = screen.getByLabelText(/Comment/i)
    await user.type(commentInput, 'Test telemetry entry')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Log Entry/i })
    await user.click(submitButton)

    // Wait for the telemetry event to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Telemetry:',
        expect.objectContaining({
          event: 'entry_created',
          metadata: expect.objectContaining({
            taskType: expect.any(String),
            minutes: 30
          })
        })
      )
    })
  })

  it('tracks entry_updated event when editing an entry', async () => {
    // Seed a test entry
    const testEntry = entryFactory({
      id: 'test-1',
      task: 'PAF',
      minutes: 15,
      occurredOn: fixedToday(),
      comment: 'Original comment',
      createdAt: `${fixedToday()}T10:00:00Z`,
      updatedAt: `${fixedToday()}T10:00:00Z`
    })
    seedEntries([testEntry])

    render(<DashboardPage />)

    // Wait for the entry to appear in the history table
    await waitFor(() => {
      expect(screen.getByText('PAF')).toBeInTheDocument()
    })

    // Find and click the edit button for the entry
    const editButtons = screen.getAllByLabelText(/Edit entry from/)
    const firstEditButton = editButtons[0]
    await user.click(firstEditButton)

    // Edit the minutes
    const minutesInput = screen.getByLabelText('Edit minutes')
    await user.clear(minutesInput)
    await user.type(minutesInput, '45')

    // Save the changes
    const saveButton = screen.getByLabelText('Save changes')
    await user.click(saveButton)

    // Wait for the telemetry event to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Telemetry:',
        expect.objectContaining({
          event: 'entry_updated',
          metadata: expect.objectContaining({
            taskType: 'PAF',
            minutes: 45
          })
        })
      )
    })
  })

  it('tracks entry_deleted event when deleting an entry', async () => {
    // Seed a test entry
    const testEntry = entryFactory({
      id: 'test-1',
      task: 'PRIOR_AUTH',
      minutes: 30,
      occurredOn: fixedToday(),
      comment: 'Test entry to delete',
      createdAt: `${fixedToday()}T10:00:00Z`,
      updatedAt: `${fixedToday()}T10:00:00Z`
    })
    seedEntries([testEntry])

    render(<DashboardPage />)

    // Wait for the entry to appear in the history table
    await waitFor(() => {
      expect(screen.getByText('PRIOR_AUTH')).toBeInTheDocument()
    })

    // Find and click the delete button for the entry
    const deleteButtons = screen.getAllByLabelText(/Delete entry from/)
    const firstDeleteButton = deleteButtons[0]
    await user.click(firstDeleteButton)

    // Wait for the telemetry event to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Telemetry:',
        expect.objectContaining({
          event: 'entry_deleted',
          metadata: expect.objectContaining({
            taskType: 'PRIOR_AUTH'
          })
        })
      )
    })
  })

  it('tracks entry_duplicated event when duplicating an entry', async () => {
    // Seed a test entry
    const testEntry = entryFactory({
      id: 'test-1',
      task: 'EDUCATION',
      minutes: 60,
      occurredOn: fixedToday(),
      comment: 'Test entry to duplicate',
      createdAt: `${fixedToday()}T10:00:00Z`,
      updatedAt: `${fixedToday()}T10:00:00Z`
    })
    seedEntries([testEntry])

    render(<DashboardPage />)

    // Wait for the entry to appear in the history table
    await waitFor(() => {
      expect(screen.getByText('EDUCATION')).toBeInTheDocument()
    })

    // Find and click the duplicate button for the entry
    const duplicateButtons = screen.getAllByLabelText(/Duplicate entry from/)
    const firstDuplicateButton = duplicateButtons[0]
    await user.click(firstDuplicateButton)

    // Wait for the telemetry event to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Telemetry:',
        expect.objectContaining({
          event: 'entry_duplicated',
          metadata: expect.objectContaining({
            taskType: 'EDUCATION'
          })
        })
      )
    })
  })

  it('tracks export_csv event when exporting to CSV', async () => {
    // Seed test entries
    const testEntries = [
      entryFactory({
        id: 'test-1',
        task: 'PAF',
        minutes: 15,
        occurredOn: fixedToday(),
        comment: 'Test entry 1',
        createdAt: `${fixedToday()}T10:00:00Z`,
        updatedAt: `${fixedToday()}T10:00:00Z`
      }),
      entryFactory({
        id: 'test-2',
        task: 'PRIOR_AUTH',
        minutes: 30,
        occurredOn: fixedToday(),
        comment: 'Test entry 2',
        createdAt: `${fixedToday()}T11:00:00Z`,
        updatedAt: `${fixedToday()}T11:00:00Z`
      })
    ]
    seedEntries(testEntries)

    render(<DashboardPage />)

    // Wait for entries to appear in the history table
    await waitFor(() => {
      expect(screen.getByText('PAF')).toBeInTheDocument()
      expect(screen.getByText('PRIOR_AUTH')).toBeInTheDocument()
    })

    // Click export button
    const exportButton = screen.getByRole('button', { name: /Export/i })
    await user.click(exportButton)

    // Click CSV export option
    const csvExportButton = screen.getByRole('menuitem', { name: /Export CSV/i })
    await user.click(csvExportButton)

    // Wait for the telemetry event to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Telemetry:',
        expect.objectContaining({
          event: 'export_csv',
          metadata: expect.objectContaining({
            entryCount: 2
          })
        })
      )
    })
  })

  it('tracks bulk_delete event when bulk deleting entries', async () => {
    // Seed test entries
    const testEntries = [
      entryFactory({
        id: 'test-1',
        task: 'PAF',
        minutes: 15,
        occurredOn: fixedToday(),
        comment: 'Test entry 1',
        createdAt: `${fixedToday()}T10:00:00Z`,
        updatedAt: `${fixedToday()}T10:00:00Z`
      }),
      entryFactory({
        id: 'test-2',
        task: 'PRIOR_AUTH',
        minutes: 30,
        occurredOn: fixedToday(),
        comment: 'Test entry 2',
        createdAt: `${fixedToday()}T11:00:00Z`,
        updatedAt: `${fixedToday()}T11:00:00Z`
      }),
      entryFactory({
        id: 'test-3',
        task: 'EDUCATION',
        minutes: 45,
        occurredOn: fixedToday(),
        comment: 'Test entry 3',
        createdAt: `${fixedToday()}T12:00:00Z`,
        updatedAt: `${fixedToday()}T12:00:00Z`
      })
    ]
    seedEntries(testEntries)

    render(<DashboardPage />)

    // Wait for entries to appear in the history table
    await waitFor(() => {
      expect(screen.getByText('PAF')).toBeInTheDocument()
      expect(screen.getByText('PRIOR_AUTH')).toBeInTheDocument()
      expect(screen.getByText('EDUCATION')).toBeInTheDocument()
    })

    // Select first two entries
    const entryCheckboxes = screen.getAllByLabelText(/Select entry from/)
    await user.click(entryCheckboxes[0]) // Select first entry
    await user.click(entryCheckboxes[1]) // Select second entry

    // Click bulk delete
    const bulkDeleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(bulkDeleteButton)

    // Confirm deletion
    const confirmDeleteButton = screen.getByRole('button', { name: /Delete/i })
    await user.click(confirmDeleteButton)

    // Wait for the telemetry event to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Telemetry:',
        expect.objectContaining({
          event: 'bulk_delete',
          metadata: expect.objectContaining({
            entryCount: 2
          })
        })
      )
    })
  })

  it('tracks bulk_duplicate event when bulk duplicating entries', async () => {
    // Seed test entries
    const testEntries = [
      entryFactory({
        id: 'test-1',
        task: 'PAF',
        minutes: 15,
        occurredOn: fixedToday(),
        comment: 'Test entry 1',
        createdAt: `${fixedToday()}T10:00:00Z`,
        updatedAt: `${fixedToday()}T10:00:00Z`
      }),
      entryFactory({
        id: 'test-2',
        task: 'PRIOR_AUTH',
        minutes: 30,
        occurredOn: fixedToday(),
        comment: 'Test entry 2',
        createdAt: `${fixedToday()}T11:00:00Z`,
        updatedAt: `${fixedToday()}T11:00:00Z`
      })
    ]
    seedEntries(testEntries)

    render(<DashboardPage />)

    // Wait for entries to appear in the history table
    await waitFor(() => {
      expect(screen.getByText('PAF')).toBeInTheDocument()
      expect(screen.getByText('PRIOR_AUTH')).toBeInTheDocument()
    })

    // Select both entries
    const entryCheckboxes = screen.getAllByLabelText(/Select entry from/)
    await user.click(entryCheckboxes[0]) // Select first entry
    await user.click(entryCheckboxes[1]) // Select second entry

    // Click bulk duplicate
    const bulkDuplicateButton = screen.getByRole('button', { name: /Duplicate/i })
    await user.click(bulkDuplicateButton)

    // Wait for the telemetry event to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Telemetry:',
        expect.objectContaining({
          event: 'bulk_duplicate',
          metadata: expect.objectContaining({
            entryCount: 2
          })
        })
      )
    })
  })

  it('tracks filter_changed event when changing filters', async () => {
    render(<DashboardPage />)

    // Click on task filter
    const taskFilter = screen.getByLabelText(/Tasks:/)
    await user.click(taskFilter)

    // Wait for the telemetry event to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Telemetry:',
        expect.objectContaining({
          event: 'filter_changed',
          metadata: expect.objectContaining({
            filterType: expect.any(String)
          })
        })
      )
    })
  })

  it('tracks sort_changed event when changing sort order', async () => {
    render(<DashboardPage />)

    // Click on minutes header to sort
    const minutesHeader = screen.getByRole('button', { name: /Sort by minutes/i })
    await user.click(minutesHeader)

    // Wait for the telemetry event to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Telemetry:',
        expect.objectContaining({
          event: 'sort_changed',
          metadata: expect.objectContaining({
            sortField: 'minutes'
          })
        })
      )
    })
  })

  it('tracks search_used event when using search', async () => {
    render(<DashboardPage />)

    // Type in search input
    const searchInput = screen.getByPlaceholderText(/Search comments and task names/i)
    await user.type(searchInput, 'test search')

    // Wait for debounced search and telemetry event
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Telemetry:',
        expect.objectContaining({
          event: 'search_used'
        })
      )
    })
  })

  it('includes proper telemetry data structure', async () => {
    render(<DashboardPage />)

    // Trigger a simple event (search)
    const searchInput = screen.getByPlaceholderText(/Search comments and task names/i)
    await user.type(searchInput, 'test')

    // Wait for telemetry event and verify structure
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '📊 Telemetry:',
        expect.objectContaining({
          event: 'search_used',
          timestamp: expect.any(Number),
          sessionId: expect.stringMatching(/^session_\d+_[a-z0-9]+$/),
          metadata: expect.any(Object)
        })
      )
    })
  })

  it('tracks multiple events in sequence', async () => {
    render(<DashboardPage />)

    // Perform multiple actions
    const searchInput = screen.getByPlaceholderText(/Search comments and task names/i)
    await user.type(searchInput, 'test')

    const minutesHeader = screen.getByRole('button', { name: /Sort by minutes/i })
    await user.click(minutesHeader)

    // Wait for both telemetry events
    await waitFor(() => {
      const calls = consoleSpy.mock.calls
      const telemetryCalls = calls.filter(call => 
        call[0] === '📊 Telemetry:'
      )
      
      expect(telemetryCalls).toHaveLength(2)
      
      const events = telemetryCalls.map(call => call[1].event)
      expect(events).toContain('search_used')
      expect(events).toContain('sort_changed')
    })
  })

  it('does not track events when telemetry is disabled', async () => {
    // Mock environment to disable telemetry
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    
    // Mock window.location.hostname to be localhost
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' },
      writable: true
    })

    render(<DashboardPage />)

    // Perform an action
    const searchInput = screen.getByPlaceholderText(/Search comments and task names/i)
    await user.type(searchInput, 'test')

    // Wait a bit and verify no telemetry was logged
    await waitFor(() => {
      const telemetryCalls = consoleSpy.mock.calls.filter(call => 
        call[0] === '📊 Telemetry:'
      )
      expect(telemetryCalls).toHaveLength(0)
    }, { timeout: 1000 })

    // Restore original environment
    process.env.NODE_ENV = originalEnv
  })
})
