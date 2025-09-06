import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import DashboardPage from '@/app/dashboard/page'
import { 
  fixedToday, 
  freezeDate, 
  clearEntries
} from '@/tests/utils'

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations)

// Mock the telemetry module
vi.mock('@/lib/telemetry', () => ({
  telemetry: {
    trackEntryCreated: vi.fn(),
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

describe('Dashboard Accessibility', () => {
  let cleanupTime: (() => void) | undefined

  beforeEach(() => {
    vi.clearAllMocks()
    clearEntries()
    
    // Freeze time to fixed date
    cleanupTime = freezeDate(fixedToday())
  })

  afterEach(() => {
    clearEntries()
    if (cleanupTime) {
      cleanupTime()
    }
  })

  it('has no accessibility violations', async () => {
    const { container } = render(<DashboardPage />)
    
    // Run axe accessibility audit
    const results = await axe(container)
    
    // Assert no serious or critical violations
    expect(results).toHaveNoViolations({
      includedImpacts: ['serious', 'critical']
    })
  })

  it('has proper semantic structure', async () => {
    render(<DashboardPage />)
    
    // Check for main landmark
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { name: /Today Summary/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Quick Log/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /History/i })).toBeInTheDocument()
    
    // Check for proper section landmarks
    expect(screen.getByRole('region', { name: /Today Summary/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /Quick Log/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /History/i })).toBeInTheDocument()
  })

  it('has proper form labels and associations', async () => {
    render(<DashboardPage />)
    
    // Check for form labels
    expect(screen.getByLabelText(/Task/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Minutes/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Comment/i)).toBeInTheDocument()
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /Log Entry/i })).toBeInTheDocument()
  })

  it('has proper table structure', async () => {
    render(<DashboardPage />)
    
    // Check for table with proper role
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    
    // Check for table headers
    expect(screen.getByRole('columnheader', { name: /Date/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Task/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Minutes/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Comment/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Actions/i })).toBeInTheDocument()
  })

  it('has proper focus management for Quick Log controls', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)
    
    // Focus on the first interactive element (task select)
    const taskSelect = screen.getByLabelText(/Task/i)
    await user.click(taskSelect)
    
    // Check that the element has focus
    expect(taskSelect).toHaveFocus()
    
    // Tab to next element (minutes input)
    await user.tab()
    const minutesInput = screen.getByLabelText(/Minutes/i)
    expect(minutesInput).toHaveFocus()
    
    // Tab to date input
    await user.tab()
    const dateInput = screen.getByLabelText(/Date/i)
    expect(dateInput).toHaveFocus()
    
    // Tab to comment input
    await user.tab()
    const commentInput = screen.getByLabelText(/Comment/i)
    expect(commentInput).toHaveFocus()
    
    // Tab to submit button
    await user.tab()
    const submitButton = screen.getByRole('button', { name: /Log Entry/i })
    expect(submitButton).toHaveFocus()
  })

  it('has proper focus management for preset buttons', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)
    
    // Focus on preset buttons
    const presetButtons = screen.getAllByRole('button', { name: /15|30|45|60/ })
    
    // Click on first preset button
    await user.click(presetButtons[0])
    expect(presetButtons[0]).toHaveFocus()
    
    // Tab through preset buttons
    for (let i = 1; i < presetButtons.length; i++) {
      await user.tab()
      expect(presetButtons[i]).toHaveFocus()
    }
  })

  it('has proper focus management for history controls', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)
    
    // Focus on search input
    const searchInput = screen.getByPlaceholderText(/Search comments and task names/i)
    await user.click(searchInput)
    expect(searchInput).toHaveFocus()
    
    // Tab to export button
    await user.tab()
    const exportButton = screen.getByRole('button', { name: /Export/i })
    expect(exportButton).toHaveFocus()
    
    // Tab to date range buttons
    await user.tab()
    const todayButton = screen.getByRole('button', { name: /Today/i })
    expect(todayButton).toHaveFocus()
  })

  it('has proper ARIA attributes', async () => {
    render(<DashboardPage />)
    
    // Check for proper ARIA labels
    expect(screen.getByLabelText(/Tasks:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date range:/)).toBeInTheDocument()
    
    // Check for proper ARIA descriptions
    const commentInput = screen.getByLabelText(/Comment/i)
    expect(commentInput).toHaveAttribute('aria-describedby')
    
    // Check for proper ARIA states
    const submitButton = screen.getByRole('button', { name: /Log Entry/i })
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('has proper color contrast', async () => {
    const { container } = render(<DashboardPage />)
    
    // Run axe with color contrast rules
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true }
      }
    })
    
    // Assert no color contrast violations
    expect(results).toHaveNoViolations({
      includedImpacts: ['serious', 'critical']
    })
  })

  it('has proper keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)
    
    // Test keyboard navigation through form
    const taskSelect = screen.getByLabelText(/Task/i)
    await user.click(taskSelect)
    
    // Use arrow keys to navigate options (if select is open)
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')
    
    // Test tab navigation
    await user.tab()
    const minutesInput = screen.getByLabelText(/Minutes/i)
    expect(minutesInput).toHaveFocus()
    
    // Test enter key on submit
    await user.tab()
    await user.tab()
    await user.tab()
    const submitButton = screen.getByRole('button', { name: /Log Entry/i })
    expect(submitButton).toHaveFocus()
    
    // Test enter key submission
    await user.keyboard('{Enter}')
  })

  it('has proper skip links', async () => {
    render(<DashboardPage />)
    
    // Check for skip to content link
    const skipLink = screen.getByRole('link', { name: /Skip to main content/i })
    expect(skipLink).toBeInTheDocument()
    
    // Check that skip link is properly positioned
    expect(skipLink).toHaveClass('skip-link')
  })

  it('has proper empty state accessibility', async () => {
    render(<DashboardPage />)
    
    // Check for empty state message
    expect(screen.getByText(/No entries yet/i)).toBeInTheDocument()
    expect(screen.getByText(/Start logging your AMS activities to see them here/i)).toBeInTheDocument()
    
    // Check for call-to-action button
    const addButton = screen.getByRole('button', { name: /Add Your First Entry/i })
    expect(addButton).toBeInTheDocument()
    
    // Check that empty state is properly announced
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('has proper loading states', async () => {
    render(<DashboardPage />)
    
    // Check for loading indicators (if any)
    const loadingElements = screen.queryAllByLabelText(/Loading/i)
    
    // If loading elements exist, they should have proper ARIA attributes
    loadingElements.forEach(element => {
      expect(element).toHaveAttribute('aria-live', 'polite')
    })
  })

  it('has proper error handling accessibility', async () => {
    render(<DashboardPage />)
    
    // Check for error message containers
    const errorContainers = screen.queryAllByRole('alert')
    
    // If error containers exist, they should be properly marked
    errorContainers.forEach(container => {
      expect(container).toHaveAttribute('aria-live', 'assertive')
    })
  })

  it('has proper mobile accessibility', async () => {
    const { container } = render(<Dashboard />)
    
    // Run axe with mobile-specific rules
    const results = await axe(container, {
      rules: {
        'touch-target-size': { enabled: true },
        'color-contrast': { enabled: true }
      }
    })
    
    // Assert no mobile accessibility violations
    expect(results).toHaveNoViolations({
      includedImpacts: ['serious', 'critical']
    })
  })
})
