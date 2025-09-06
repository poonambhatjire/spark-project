import { TimeEntry } from '@/app/dashboard/data/client'

/**
 * Storage key used by the application for entries
 */
export const STORAGE_KEY = "sparc.entries.v1"

/**
 * Clears all entries from localStorage
 * Useful for test cleanup
 */
export function clearEntries(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

/**
 * Seeds localStorage with test entries
 * @param entries - Array of TimeEntry objects to seed
 */
export function seedEntries(entries: TimeEntry[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }
}

/**
 * Reads current entries from localStorage
 * @returns Array of TimeEntry objects or empty array if none exist
 */
export function readEntries(): TimeEntry[] {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }
    
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('Failed to parse entries from localStorage:', error)
    return []
  }
}

/**
 * Gets the count of entries in localStorage
 * @returns Number of entries
 */
export function getEntryCount(): number {
  return readEntries().length
}

/**
 * Checks if localStorage has any entries
 * @returns True if entries exist, false otherwise
 */
export function hasEntries(): boolean {
  return getEntryCount() > 0
}

/**
 * Seeds a single entry for testing
 * @param entry - Single TimeEntry object to seed
 */
export function seedSingleEntry(entry: TimeEntry): void {
  seedEntries([entry])
}

/**
 * Seeds multiple entries with different dates for testing date filtering
 * @param baseDate - Base date for entries (defaults to fixed today)
 */
export function seedEntriesWithDates(baseDate: string = "2025-01-15"): void {
  const entries: TimeEntry[] = [
    {
      id: "test-1",
      task: "PAF",
      minutes: 15,
      occurredOn: baseDate,
      comment: "Test PAF activity",
      createdAt: `${baseDate}T10:00:00Z`,
      updatedAt: `${baseDate}T10:00:00Z`
    },
    {
      id: "test-2", 
      task: "AUTH_RESTRICTED_ANTIMICROBIALS",
      minutes: 30,
      occurredOn: baseDate,
      comment: "Test prior auth activity",
      createdAt: `${baseDate}T11:00:00Z`,
      updatedAt: `${baseDate}T11:00:00Z`
    },
    {
      id: "test-3",
      task: "PROVIDING_EDUCATION", 
      minutes: 60,
      occurredOn: baseDate,
      comment: "Test education activity",
      createdAt: `${baseDate}T12:00:00Z`,
      updatedAt: `${baseDate}T12:00:00Z`
    }
  ]
  
  seedEntries(entries)
}

/**
 * Seeds entries across multiple days for testing date range filtering
 */
export function seedEntriesAcrossDays(): void {
  const entries: TimeEntry[] = [
    // Today
    {
      id: "test-today-1",
      task: "PAF",
      minutes: 15,
      occurredOn: "2025-01-15",
      comment: "Today PAF",
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-01-15T10:00:00Z"
    },
    // Yesterday
    {
      id: "test-yesterday-1", 
      task: "AUTH_RESTRICTED_ANTIMICROBIALS",
      minutes: 30,
      occurredOn: "2025-01-14",
      comment: "Yesterday prior auth",
      createdAt: "2025-01-14T10:00:00Z",
      updatedAt: "2025-01-14T10:00:00Z"
    },
    // 3 days ago
    {
      id: "test-3days-1",
      task: "PROVIDING_EDUCATION",
      minutes: 60,
      occurredOn: "2025-01-12", 
      comment: "3 days ago education",
      createdAt: "2025-01-12T10:00:00Z",
      updatedAt: "2025-01-12T10:00:00Z"
    },
    // 8 days ago (outside week range)
    {
      id: "test-8days-1",
      task: "SHARING_DATA",
      minutes: 45,
      occurredOn: "2025-01-07",
      comment: "8 days ago reporting",
      createdAt: "2025-01-07T10:00:00Z", 
      updatedAt: "2025-01-07T10:00:00Z"
    }
  ]
  
  seedEntries(entries)
}
