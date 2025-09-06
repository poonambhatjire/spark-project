import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SignInPage from '@/app/(auth)/sign-in/page'

describe('Sign In Page', () => {
  it('renders sign-in form with required fields', () => {
    render(<SignInPage />)
    
    // Check for page title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign In')
    
    // Check for email field
    const emailInput = screen.getByRole('textbox', { name: /email/i })
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    
    // Check for password field
    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('minLength', '6')
    
    // Check for submit button
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
    
    // Check for sign up link
    const signUpLink = screen.getByRole('link', { name: /sign up/i })
    expect(signUpLink).toBeInTheDocument()
    expect(signUpLink).toHaveAttribute('href', '/sign-up')
  })
})
