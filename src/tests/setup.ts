import '@testing-library/jest-dom'
import { vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { clearEntries } from './utils/storage'

// Configure jest-axe for accessibility testing
import 'jest-axe/extend-expect'

// Mock Next.js components that aren't available in test environment
vi.mock('next/link', () => {
  return {
    default: function MockLink({ children, href, ...props }: any) {
      return React.createElement('a', { href, ...props }, children)
    }
  }
})

vi.mock('next/image', () => {
  return {
    default: function MockImage({ src, alt, ...props }: any) {
      return React.createElement('img', { src, alt, ...props })
    }
  }
})

// Polyfill crypto.randomUUID if missing
if (typeof crypto === 'undefined' || !crypto.randomUUID) {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0
          const v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      }
    }
  })
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()

// Clean up localStorage before and after each test
beforeEach(() => {
  clearEntries()
  vi.clearAllMocks()
})

afterEach(() => {
  clearEntries()
  vi.clearAllTimers()
})
