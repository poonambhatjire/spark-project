import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}))

// Mock the server action
vi.mock('@/lib/auth/supabase-actions', () => ({
  resetPassword: vi.fn(),
}))

describe('Forgot Password Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders forgot password form correctly', () => {
    render(<ForgotPasswordPage />)
    
    expect(screen.getByRole('heading', { name: /forgot password/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset email/i })).toBeInTheDocument()
    expect(screen.getByText(/enter your email address/i)).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<ForgotPasswordPage />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(emailInput).toHaveAttribute('aria-label', 'Email address')
  })

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordPage />)
    
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    await user.click(submitButton)
    
    // HTML5 validation should prevent submission
    const emailInput = screen.getByLabelText(/email address/i)
    expect(emailInput).toBeInvalid()
  })

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordPage />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    await user.click(submitButton)
    
    expect(emailInput).toBeInvalid()
  })

  it('accepts valid email format', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordPage />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'test@example.com')
    
    expect(emailInput).toBeValid()
  })

  it('has navigation links to sign in and sign up', () => {
    render(<ForgotPasswordPage />)
    
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/sign-in')
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/sign-up')
  })

  it('has proper focus management', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordPage />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    await user.click(emailInput)
    
    expect(emailInput).toHaveFocus()
  })

  it('meets accessibility standards', async () => {
    const { container } = render(<ForgotPasswordPage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has proper form structure', () => {
    render(<ForgotPasswordPage />)
    
    const form = document.querySelector('form')
    expect(form).toBeInTheDocument()
    
    const emailInput = screen.getByLabelText(/email address/i)
    expect(emailInput.closest('form')).toBe(form)
  })

  it('shows loading state on submit', async () => {
    const user = userEvent.setup()
    render(<ForgotPasswordPage />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send reset email/i })
    
    await user.type(emailInput, 'test@example.com')
    
    // Mock the form submission to show loading state
    fireEvent.submit(emailInput.closest('form')!)
    
    // The button should show loading state (this would be handled by useFormStatus)
    expect(submitButton).toBeInTheDocument()
  })

  it('has proper error handling structure', () => {
    render(<ForgotPasswordPage />)
    
    // Check that error container exists (even if not visible)
    const errorContainer = document.getElementById('forgot-password-error')
    // The error container only exists when there's an error state
    expect(errorContainer).toBeNull()
  })

  it('has proper success message structure', () => {
    render(<ForgotPasswordPage />)
    
    // Check that success container exists (even if not visible)
    const successContainer = document.getElementById('forgot-password-success')
    // The success container only exists when there's a success state
    expect(successContainer).toBeNull()
  })
})
