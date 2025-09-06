import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuickLog } from '@/app/components/QuickLog'
import { timeEntryClient } from '@/app/dashboard/data/client'
import { 
  fixedToday, 
  freezeDate, 
  clearEntries, 
  // readEntries,
  // entryFactory,
  // pafEntry
} from '@/tests/utils'

// Mock the telemetry module
vi.mock('@/lib/telemetry', () => ({
  telemetry: {
    trackEntryCreated: vi.fn()
  }
}))

// Mock the data client
vi.mock('@/app/dashboard/data/client', () => ({
  timeEntryClient: {
    createEntry: vi.fn(),
    listEntries: vi.fn(),
    getTodayTotals: vi.fn(),
    getTodayByCategory: vi.fn()
  },
  Activity: {
    PAF: 'PAF',
    AUTH_RESTRICTED_ANTIMICROBIALS: 'AUTH_RESTRICTED_ANTIMICROBIALS',
    CLINICAL_ROUNDS: 'CLINICAL_ROUNDS',
    GUIDELINES_EHR: 'GUIDELINES_EHR',
    AMU: 'AMU',
    AMR: 'AMR',
    ANTIBIOTIC_APPROPRIATENESS: 'ANTIBIOTIC_APPROPRIATENESS',
    INTERVENTION_ACCEPTANCE: 'INTERVENTION_ACCEPTANCE',
    SHARING_DATA: 'SHARING_DATA',
    PROVIDING_EDUCATION: 'PROVIDING_EDUCATION',
    RECEIVING_EDUCATION: 'RECEIVING_EDUCATION',
    COMMITTEE_WORK: 'COMMITTEE_WORK',
    QI_PROJECTS_RESEARCH: 'QI_PROJECTS_RESEARCH',
    EMAILS: 'EMAILS',
    OTHER: 'OTHER'
  }
}))

describe('QuickLog Component', () => {
  const mockOnSubmit = vi.fn()
  const user = userEvent.setup()
  let cleanupTime: (() => void) | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    clearEntries()
    
    // Freeze time to fixed date
    cleanupTime = freezeDate(fixedToday())
    
    // Mock successful data client responses
    vi.mocked(timeEntryClient.createEntry).mockResolvedValue({
      id: 'test-entry-1',
      task: 'PAF',
      minutes: 15,
      occurredOn: fixedToday(),
      comment: 'Test PAF activity',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    })
  })

  afterEach(() => {
    clearEntries()
    if (cleanupTime) {
      cleanupTime()
    }
  })

  it('logs a PAF 15m entry via template chip', async () => {
    render(<QuickLog onSubmit={mockOnSubmit} />)

    // Click the PAF 15m template chip
    const pafButton = screen.getByRole('button', { name: /PAF 15m/ })
    await user.click(pafButton)

    // Verify the form is populated correctly
    const taskSelect = screen.getByLabelText(/Task Type/)
    const minutesInput = screen.getByLabelText(/Minutes/)
    
    // Check that task is selected (PAF)
    expect(taskSelect).toHaveValue('PAF')
    
    // Check that minutes is set to 15
    expect(minutesInput).toHaveValue(15)

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Log Entry/ })
    await user.click(submitButton)

    // Wait for the form submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        task: 'PAF',
        otherTask: '',
        minutes: 15,
        occurredOn: fixedToday(),
        comment: ''
      })
    })

    // Check that success message appears
    await waitFor(() => {
      expect(screen.getByText('Saved ✓')).toBeInTheDocument()
    })

    // Verify the entry was created with correct data
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        task: 'PAF',
        minutes: 15,
        occurredOn: fixedToday()
      })
    )
  })

  it('requires Other label when task is Other', async () => {
    render(<QuickLog onSubmit={mockOnSubmit} />)

    // Select "Other" task
    const taskSelect = screen.getByLabelText(/Task Type/)
    await user.click(taskSelect)
    
    // Find and click the "Other" option in the dropdown
    const otherOption = screen.getByRole('button', { name: /Other/ })
    await user.click(otherOption)

    // Set minutes to 10
    const minutesInput = screen.getByLabelText(/Minutes/)
    await user.clear(minutesInput)
    await user.type(minutesInput, '10')

    // Try to submit without filling "otherTask"
    const submitButton = screen.getByRole('button', { name: /Log Entry/ })
    await user.click(submitButton)

    // Expect validation error for missing "otherTask"
    await waitFor(() => {
      expect(screen.getByText(/Please specify the task name/)).toBeInTheDocument()
    })

    // Fill in the "otherTask" field
    const otherTaskInput = screen.getByLabelText(/Task Name/)
    await user.type(otherTaskInput, 'Antibiotic Review')

    // Submit again
    await user.click(submitButton)

    // Verify successful submission with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        task: 'OTHER',
        otherTask: 'Antibiotic Review',
        minutes: 10,
        occurredOn: fixedToday(),
        comment: ''
      })
    })

    // Check success message
    await waitFor(() => {
      expect(screen.getByText('Saved ✓')).toBeInTheDocument()
    })
  })

  it('prevents invalid minutes (0 or >480)', async () => {
    render(<QuickLog onSubmit={mockOnSubmit} />)

    // Set task to PAF
    const taskSelect = screen.getByLabelText(/Task Type/)
    await user.click(taskSelect)
    const pafOption = screen.getByRole('button', { name: /PAF/ })
    await user.click(pafOption)

    const minutesInput = screen.getByLabelText(/Minutes/)

    // Test minutes = 0 (invalid)
    await user.clear(minutesInput)
    await user.type(minutesInput, '0')

    const submitButton = screen.getByRole('button', { name: /Log Entry/ })
    await user.click(submitButton)

    // Expect validation error for minutes = 0
    await waitFor(() => {
      expect(screen.getByText(/Minutes must be at least 1/)).toBeInTheDocument()
    })

    // Test minutes = 500 (invalid)
    await user.clear(minutesInput)
    await user.type(minutesInput, '500')
    await user.click(submitButton)

    // Expect validation error for minutes > 480
    await waitFor(() => {
      expect(screen.getByText(/Minutes cannot exceed 480/)).toBeInTheDocument()
    })

    // Test minutes = 60 (valid)
    await user.clear(minutesInput)
    await user.type(minutesInput, '60')
    await user.click(submitButton)

    // Should submit successfully with valid minutes
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        task: 'PAF',
        otherTask: '',
        minutes: 60,
        occurredOn: fixedToday(),
        comment: ''
      })
    })

    // Check success message
    await waitFor(() => {
      expect(screen.getByText('Saved ✓')).toBeInTheDocument()
    })
  })

  it('clears form after successful submission', async () => {
    render(<QuickLog onSubmit={mockOnSubmit} />)

    // Fill out form
    const minutesInput = screen.getByLabelText(/Minutes/)
    await user.clear(minutesInput)
    await user.type(minutesInput, '30')

    const commentInput = screen.getByLabelText(/Comments/)
    await user.type(commentInput, 'Test comment')

    // Set task to PAF
    const taskSelect = screen.getByLabelText(/Task Type/)
    await user.click(taskSelect)
    const pafOption = screen.getByRole('button', { name: /PAF/ })
    await user.click(pafOption)

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Log Entry/ })
    await user.click(submitButton)

    // Wait for submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    // Check that form is cleared (minutes and comment, but task remains)
    await waitFor(() => {
      expect(minutesInput).toHaveValue(30) // Default value after reset
      expect(commentInput).toHaveValue('')
    })
  })

  it('shows loading state during submission', async () => {
    // Mock a slow submission
    vi.mocked(mockOnSubmit).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<QuickLog onSubmit={mockOnSubmit} />)

    // Fill out form
    const minutesInput = screen.getByLabelText(/Minutes/)
    await user.clear(minutesInput)
    await user.type(minutesInput, '20')

    // Set task to PAF
    const taskSelect = screen.getByLabelText(/Task Type/)
    await user.click(taskSelect)
    const pafOption = screen.getByRole('button', { name: /PAF/ })
    await user.click(pafOption)

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Log Entry/ })
    await user.click(submitButton)

    // Check loading state
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('Saved ✓')).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    render(<QuickLog onSubmit={mockOnSubmit} />)

    // Try to submit without selecting a task
    const submitButton = screen.getByRole('button', { name: /Log Entry/ })
    await user.click(submitButton)

    // Should show validation error for missing task
    await waitFor(() => {
      expect(screen.getByText(/Task Type is required/)).toBeInTheDocument()
    })

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('handles minutes preset buttons', async () => {
    render(<QuickLog onSubmit={mockOnSubmit} />)

    // Click 15m preset
    const fifteenButton = screen.getByRole('button', { name: /15m/ })
    await user.click(fifteenButton)

    const minutesInput = screen.getByLabelText(/Minutes/)
    expect(minutesInput).toHaveValue(15)

    // Click 30m preset
    const thirtyButton = screen.getByRole('button', { name: /30m/ })
    await user.click(thirtyButton)
    expect(minutesInput).toHaveValue(30)

    // Click 60m preset
    const sixtyButton = screen.getByRole('button', { name: /60m/ })
    await user.click(sixtyButton)
    expect(minutesInput).toHaveValue(60)
  })

  it('maintains task selection after form reset', async () => {
    render(<QuickLog onSubmit={mockOnSubmit} />)

    // Set task to PAF
    const taskSelect = screen.getByLabelText(/Task Type/)
    await user.click(taskSelect)
    const pafOption = screen.getByRole('button', { name: /PAF/ })
    await user.click(pafOption)

    // Fill and submit form
    const minutesInput = screen.getByLabelText(/Minutes/)
    await user.clear(minutesInput)
    await user.type(minutesInput, '25')

    const submitButton = screen.getByRole('button', { name: /Log Entry/ })
    await user.click(submitButton)

    // Wait for submission and reset
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })

    // Task should remain selected after reset
    await waitFor(() => {
      expect(taskSelect).toHaveValue('PAF')
    })
  })
})
