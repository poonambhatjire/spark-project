import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SignUpPage from '@/app/(auth)/sign-up/page'

describe('Sign Up Page', () => {
  it('renders sign-up form with required fields', () => {
    render(<SignUpPage />)
    
    // Check for page title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sign Up')
    
    // Check for name field
    const nameInput = screen.getByRole('textbox', { name: /full name/i })
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveAttribute('type', 'text')
    expect(nameInput).toHaveAttribute('required')
    expect(nameInput).toHaveAttribute('minLength', '2')
    expect(nameInput).toHaveAttribute('maxLength', '64')
    
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
    expect(passwordInput).toHaveAttribute('maxLength', '72')
    
    // Check for submit button
    const submitButton = screen.getByRole('button', { name: /sign up/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
    
    // Check for sign in link
    const signInLink = screen.getByRole('link', { name: /sign in/i })
    expect(signInLink).toBeInTheDocument()
    expect(signInLink).toHaveAttribute('href', '/sign-in')
  })
})
