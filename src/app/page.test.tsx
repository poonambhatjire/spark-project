import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LandingPage from './page'

describe('LandingPage', () => {
  it('renders the main heading', () => {
    render(<LandingPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders the subheading', () => {
    render(<LandingPage />)
    expect(screen.getByText('Advancing Antimicrobial Stewardship')).toBeInTheDocument()
  })

  it('renders all keyword badges', () => {
    render(<LandingPage />)
    expect(screen.getByText('Antimicrobial Stewardship Programs (ASPs)')).toBeInTheDocument()
    expect(screen.getByText('Staffing Requirements')).toBeInTheDocument()
    expect(screen.getByText('Evidence-Based Recommendations')).toBeInTheDocument()
  })

  it('renders aims section', () => {
    render(<LandingPage />)
    expect(screen.getByText('Aims')).toBeInTheDocument()
    expect(screen.getByText('Quantify Activities')).toBeInTheDocument()
    expect(screen.getByText('Develop Calculator')).toBeInTheDocument()
    expect(screen.getByText('Support Implementation')).toBeInTheDocument()
  })

  it('renders impact section', () => {
    render(<LandingPage />)
    expect(screen.getByText('Impact')).toBeInTheDocument()
    expect(screen.getByText('Optimize Antimicrobial Use')).toBeInTheDocument()
    expect(screen.getByText('Reduce Drug Resistance')).toBeInTheDocument()
    expect(screen.getByText('Improve Patient Outcomes')).toBeInTheDocument()
  })

  it('renders access button', () => {
    render(<LandingPage />)
    expect(screen.getByRole('link', { name: 'Open SPARC' })).toBeInTheDocument()
  })

  it('renders support email', () => {
    render(<LandingPage />)
    expect(screen.getByText('your-email@example.com')).toBeInTheDocument()
  })
})
