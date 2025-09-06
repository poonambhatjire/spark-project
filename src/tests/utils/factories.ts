import { TimeEntry, Activity } from '@/app/dashboard/data/client'
import { fixedToday } from './time'

/**
 * Generates a valid TimeEntry object with sensible defaults
 * @param partial - Partial TimeEntry object to override defaults
 * @returns Complete TimeEntry object
 */
export function entryFactory(partial?: Partial<TimeEntry>): TimeEntry {
  const now = new Date().toISOString()
  const id = `test-${crypto.randomUUID()}`
  
  const defaults: TimeEntry = {
    id,
    task: "PAF" as Activity,
    minutes: 30,
    occurredOn: fixedToday(),
    comment: "",
    createdAt: now,
    updatedAt: now
  }
  
  return {
    ...defaults,
    ...partial
  }
}

/**
 * Creates a PAF entry with specific minutes
 * @param minutes - Number of minutes (default: 15)
 * @param partial - Additional overrides
 * @returns PAF TimeEntry
 */
export function pafEntry(minutes: number = 15, partial?: Partial<TimeEntry>): TimeEntry {
  return entryFactory({
    task: "PAF",
    minutes,
    comment: `PAF activity for ${minutes} minutes`,
    ...partial
  })
}

/**
 * Creates an Authorization of Restricted Antimicrobials entry with specific minutes
 * @param minutes - Number of minutes (default: 30)
 * @param partial - Additional overrides
 * @returns AUTH_RESTRICTED_ANTIMICROBIALS TimeEntry
 */
export function authRestrictedEntry(minutes: number = 30, partial?: Partial<TimeEntry>): TimeEntry {
  return entryFactory({
    task: "AUTH_RESTRICTED_ANTIMICROBIALS",
    minutes,
    comment: `Authorization of restricted antimicrobials for ${minutes} minutes`,
    ...partial
  })
}

/**
 * Creates a Providing Education entry with specific minutes
 * @param minutes - Number of minutes (default: 60)
 * @param partial - Additional overrides
 * @returns PROVIDING_EDUCATION TimeEntry
 */
export function providingEducationEntry(minutes: number = 60, partial?: Partial<TimeEntry>): TimeEntry {
  return entryFactory({
    task: "PROVIDING_EDUCATION",
    minutes,
    comment: `Providing education session for ${minutes} minutes`,
    ...partial
  })
}

/**
 * Creates an "Other" entry with custom task name
 * @param otherTask - Custom task name
 * @param minutes - Number of minutes (default: 45)
 * @param partial - Additional overrides
 * @returns OTHER TimeEntry
 */
export function otherEntry(otherTask: string, minutes: number = 45, partial?: Partial<TimeEntry>): TimeEntry {
  return entryFactory({
    task: "OTHER",
    otherTask,
    minutes,
    comment: `Custom activity: ${otherTask}`,
    ...partial
  })
}

/**
 * Creates multiple entries for testing
 * @param count - Number of entries to create
 * @param partial - Base overrides for all entries
 * @returns Array of TimeEntry objects
 */
export function createEntries(count: number, partial?: Partial<TimeEntry>): TimeEntry[] {
  return Array.from({ length: count }, (_, index) => 
    entryFactory({
      ...partial,
      comment: `Test entry ${index + 1}`
    })
  )
}

/**
 * Creates entries with different tasks for testing task filtering
 * @returns Array of TimeEntry objects with different tasks
 */
export function createMixedTaskEntries(): TimeEntry[] {
  return [
    pafEntry(15),
    authRestrictedEntry(30),
    providingEducationEntry(60),
    otherEntry("Custom Task", 45),
    entryFactory({ task: "SHARING_DATA", minutes: 20, comment: "Reporting activity" }),
    entryFactory({ task: "COMMITTEE_WORK", minutes: 25, comment: "Administrative work" })
  ]
}

/**
 * Creates entries with different dates for testing date filtering
 * @returns Array of TimeEntry objects with different dates
 */
export function createDateRangeEntries(): TimeEntry[] {
  return [
    // Today
    entryFactory({ 
      occurredOn: "2025-01-15",
      comment: "Today's activity"
    }),
    // Yesterday
    entryFactory({ 
      occurredOn: "2025-01-14",
      comment: "Yesterday's activity"
    }),
    // 3 days ago
    entryFactory({ 
      occurredOn: "2025-01-12",
      comment: "3 days ago activity"
    }),
    // 8 days ago (outside week range)
    entryFactory({ 
      occurredOn: "2025-01-07",
      comment: "8 days ago activity"
    })
  ]
}

/**
 * Creates a large dataset for performance testing
 * @param count - Number of entries to create (default: 100)
 * @returns Array of TimeEntry objects
 */
export function createLargeDataset(count: number = 100): TimeEntry[] {
  const tasks: Activity[] = [
    "PAF", 
    "AUTH_RESTRICTED_ANTIMICROBIALS", 
    "CLINICAL_ROUNDS",
    "GUIDELINES_EHR",
    "AMU",
    "AMR", 
    "ANTIBIOTIC_APPROPRIATENESS",
    "INTERVENTION_ACCEPTANCE",
    "SHARING_DATA",
    "PROVIDING_EDUCATION",
    "RECEIVING_EDUCATION",
    "COMMITTEE_WORK",
    "QI_PROJECTS_RESEARCH",
    "EMAILS",
    "OTHER"
  ]
  const comments = [
    "Patient review",
    "Antibiotic stewardship",
    "Clinical consultation",
    "Documentation",
    "Team meeting",
    "Research review"
  ]
  
  return Array.from({ length: count }, (_, index) => {
    const task = tasks[index % tasks.length]
    const comment = comments[index % comments.length]
    const minutes = [15, 30, 45, 60][index % 4]
    
    return entryFactory({
      task,
      minutes,
      comment: `${comment} ${index + 1}`,
      occurredOn: `2025-01-${String(15 - (index % 10)).padStart(2, '0')}` // Spread across 10 days
    })
  })
}
