import { describe, it, expect, beforeEach } from 'vitest'
import { 
  fixedToday, 
  freezeDate, 
  clearEntries, 
  seedEntries, 
  readEntries,
  entryFactory,
  pafEntry,
  createMixedTaskEntries
} from './index'

describe('Test Utilities Example', () => {
  beforeEach(() => {
    clearEntries()
  })

  describe('Time Utilities', () => {
    it('should return fixed date for consistent testing', () => {
      expect(fixedToday()).toBe('2025-01-15')
    })

    it('should freeze time for testing', () => {
      const cleanup = freezeDate('2025-01-15T10:00:00Z')
      
      // Test that time is frozen
      expect(new Date().toISOString()).toContain('2025-01-15T10:00:00')
      
      cleanup()
    })
  })

  describe('Storage Utilities', () => {
    it('should seed and read entries', () => {
      const entries = [
        entryFactory({ task: 'PAF', minutes: 15 }),
        entryFactory({ task: 'AUTH_RESTRICTED_ANTIMICROBIALS', minutes: 30 })
      ]
      
      seedEntries(entries)
      const read = readEntries()
      
      expect(read).toHaveLength(2)
      expect(read[0].task).toBe('PAF')
      expect(read[1].task).toBe('PRIOR_AUTH')
    })

    it('should clear entries', () => {
      seedEntries([entryFactory()])
      expect(readEntries()).toHaveLength(1)
      
      clearEntries()
      expect(readEntries()).toHaveLength(0)
    })
  })

  describe('Factory Utilities', () => {
    it('should create entry with defaults', () => {
      const entry = entryFactory()
      
      expect(entry.task).toBe('PAF')
      expect(entry.minutes).toBe(30)
      expect(entry.occurredOn).toBe('2025-01-15')
      expect(entry.id).toMatch(/^test-/)
    })

    it('should create entry with overrides', () => {
      const entry = entryFactory({
        task: 'PROVIDING_EDUCATION',
        minutes: 60,
        comment: 'Test comment'
      })
      
      expect(entry.task).toBe('PROVIDING_EDUCATION')
      expect(entry.minutes).toBe(60)
      expect(entry.comment).toBe('Test comment')
    })

    it('should create PAF entry', () => {
      const entry = pafEntry(15)
      
      expect(entry.task).toBe('PAF')
      expect(entry.minutes).toBe(15)
      expect(entry.comment).toContain('PAF activity')
    })

    it('should create mixed task entries', () => {
      const entries = createMixedTaskEntries()
      
      expect(entries).toHaveLength(6)
      expect(entries.map(e => e.task)).toContain('PAF')
      expect(entries.map(e => e.task)).toContain('PRIOR_AUTH')
      expect(entries.map(e => e.task)).toContain('EDUCATION')
      expect(entries.map(e => e.task)).toContain('OTHER')
    })
  })

  describe('Integration Example', () => {
    it('should work together for comprehensive testing', () => {
      // Freeze time
      const cleanup = freezeDate('2025-01-15T10:00:00Z')
      
      // Create test data
      const entries = createMixedTaskEntries()
      seedEntries(entries)
      
      // Verify data
      const read = readEntries()
      expect(read).toHaveLength(6)
      
      // Test filtering by task
      const pafEntries = read.filter(e => e.task === 'PAF')
      expect(pafEntries).toHaveLength(1)
      
      // Test filtering by date
      const todayEntries = read.filter(e => e.occurredOn === fixedToday())
      expect(todayEntries).toHaveLength(6) // All entries use fixed today
      
      cleanup()
    })
  })
})
