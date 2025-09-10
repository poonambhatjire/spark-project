// Migration script to move localStorage data to Supabase
// This script helps migrate existing time entries from localStorage to Supabase

import { createClient } from '@/lib/supabase/client'
import { TimeEntry } from './client'

// Storage key from the original localStorage implementation
const STORAGE_KEY = 'sparc.entries.v1';

// Helper function to safely parse JSON
const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

// Get localStorage data
const getLocalStorageData = (): TimeEntry[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return safeJsonParse(stored || '[]', []);
};

// Clear localStorage data
const clearLocalStorageData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

// Migration class
export class DataMigrationService {
  private supabase = createClient();

  // Check if user has localStorage data
  hasLocalStorageData(): boolean {
    const data = getLocalStorageData();
    return data.length > 0;
  }

  // Get localStorage data count
  getLocalStorageDataCount(): number {
    const data = getLocalStorageData();
    return data.length;
  }

  // Migrate localStorage data to Supabase
  async migrateToSupabase(): Promise<{ success: boolean; migrated: number; errors: string[] }> {
    const localStorageData = getLocalStorageData();
    const errors: string[] = [];
    let migrated = 0;

    if (localStorageData.length === 0) {
      return { success: true, migrated: 0, errors: [] };
    }

    console.log(`Starting migration of ${localStorageData.length} entries...`);

    // Convert localStorage entries to Supabase format
    const supabaseEntries = localStorageData.map(entry => ({
      task: entry.task,
      other_task: entry.otherTask || null,
      minutes: entry.minutes,
      occurred_on: entry.occurredOn,
      comment: entry.comment || null,
      created_at: entry.createdAt,
      updated_at: entry.updatedAt,
      deleted_at: entry.deletedAt || null
    }));

    // Insert entries in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < supabaseEntries.length; i += batchSize) {
      const batch = supabaseEntries.slice(i, i + batchSize);
      
      try {
        const { error } = await this.supabase
          .from('time_entries')
          .insert(batch);

        if (error) {
          console.error(`Batch ${i / batchSize + 1} failed:`, error);
          errors.push(`Batch ${i / batchSize + 1}: ${error.message}`);
        } else {
          migrated += batch.length;
          console.log(`Migrated batch ${i / batchSize + 1} (${batch.length} entries)`);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Batch ${i / batchSize + 1} failed:`, err);
        errors.push(`Batch ${i / batchSize + 1}: ${errorMsg}`);
      }
    }

    const success = errors.length === 0;
    
    if (success && migrated > 0) {
      console.log(`Migration completed successfully! Migrated ${migrated} entries.`);
    } else if (errors.length > 0) {
      console.error(`Migration completed with errors. Migrated ${migrated} entries.`);
    }

    return { success, migrated, errors };
  }

  // Clear localStorage data after successful migration
  clearLocalStorage(): void {
    clearLocalStorageData();
    console.log('LocalStorage data cleared.');
  }

  // Get migration status
  async getMigrationStatus(): Promise<{
    hasLocalStorage: boolean;
    localStorageCount: number;
    supabaseCount: number;
    needsMigration: boolean;
  }> {
    const hasLocalStorage = this.hasLocalStorageData();
    const localStorageCount = this.getLocalStorageDataCount();
    
    // Get Supabase count
    const { data, error } = await this.supabase
      .from('time_entries')
      .select('id', { count: 'exact' });

    const supabaseCount = error ? 0 : (data?.length || 0);
    const needsMigration = hasLocalStorage && localStorageCount > 0;

    return {
      hasLocalStorage,
      localStorageCount,
      supabaseCount,
      needsMigration
    };
  }

  // Full migration process
  async performFullMigration(): Promise<{
    success: boolean;
    migrated: number;
    errors: string[];
    localStorageCleared: boolean;
  }> {
    console.log('Starting full migration process...');
    
    // Check if migration is needed
    const status = await this.getMigrationStatus();
    if (!status.needsMigration) {
      console.log('No migration needed.');
      return {
        success: true,
        migrated: 0,
        errors: [],
        localStorageCleared: false
      };
    }

    // Perform migration
    const migrationResult = await this.migrateToSupabase();
    
    // Clear localStorage if migration was successful
    let localStorageCleared = false;
    if (migrationResult.success && migrationResult.migrated > 0) {
      this.clearLocalStorage();
      localStorageCleared = true;
    }

    return {
      ...migrationResult,
      localStorageCleared
    };
  }
}

// Export singleton instance
export const dataMigrationService = new DataMigrationService();
