import { vi } from 'vitest'

/**
 * Returns a fixed date string in YYYY-MM-DD format for consistent testing
 * This ensures tests don't depend on the current date
 */
export function fixedToday(): string {
  return "2025-01-15"
}

/**
 * Freezes the system time to a specific date for testing
 * @param isoDate - ISO date string (e.g., "2025-01-15T10:00:00Z")
 * @returns Cleanup function that restores real timers
 */
export function freezeDate(isoDate: string): () => void {
  vi.setSystemTime(new Date(isoDate))
  
  // Return cleanup function
  return () => {
    vi.useRealTimers()
  }
}

/**
 * Helper to create a fixed date for testing with time
 * @param date - Date string (e.g., "2025-01-15")
 * @param time - Time string (e.g., "10:00:00")
 * @returns ISO date string
 */
export function createTestDate(date: string, time: string = "00:00:00"): string {
  return `${date}T${time}Z`
}

/**
 * Helper to create a date string for a specific number of days ago
 * @param daysAgo - Number of days in the past
 * @returns Date string in YYYY-MM-DD format
 */
export function daysAgo(daysAgo: number): string {
  const date = new Date("2025-01-15")
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

/**
 * Helper to create a date string for a specific number of days in the future
 * @param daysFromNow - Number of days in the future
 * @returns Date string in YYYY-MM-DD format
 */
export function daysFromNow(daysFromNow: number): string {
  const date = new Date("2025-01-15")
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0]
}
