import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Page from '@/app/page'

describe('Landing Page', () => {
  it('renders the main heading', () => {
    render(<Page />)
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'SPARC — Stewardship Personnel required for Antimicrobial Stewardship Programs Resource Calculator'
    )
  })

  it('renders the subheading', () => {
    render(<Page />)
    
    expect(screen.getByText('Advancing Antimicrobial Stewardship')).toBeInTheDocument()
  })

  it('renders keywords section', () => {
    render(<Page />)
    
    // Check for some key keywords
    expect(screen.getByText('Antimicrobial Stewardship Programs (ASPs)')).toBeInTheDocument()
    expect(screen.getByText('Staffing Requirements')).toBeInTheDocument()
    expect(screen.getByText('Evidence-Based Recommendations')).toBeInTheDocument()
  })

  it('renders aims section', () => {
    render(<Page />)
    
    expect(screen.getByText('Quantify Activities')).toBeInTheDocument()
    expect(screen.getByText('Develop Calculator')).toBeInTheDocument()
    expect(screen.getByText('Support Implementation')).toBeInTheDocument()
  })

  it('renders impact section', () => {
    render(<Page />)
    
    expect(screen.getByText('Optimize Antimicrobial Use')).toBeInTheDocument()
    expect(screen.getByText('Reduce Drug Resistance')).toBeInTheDocument()
    expect(screen.getByText('Improve Patient Outcomes')).toBeInTheDocument()
  })

  it('renders access button', () => {
    render(<Page />)
    
    const accessButton = screen.getByRole('link', { name: /Open SPARC/i })
    expect(accessButton).toBeInTheDocument()
    expect(accessButton).toHaveAttribute('href', '/dashboard')
  })

  it('renders support email link', () => {
    render(<Page />)
    
    const emailLink = screen.getByRole('link', { name: /your-email@example\.com/i })
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:your-email@example.com')
  })

})
