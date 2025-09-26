// Supabase-based TimeEntryClient
// This replaces the localStorage-based client with Supabase integration

import { createClient } from '@/lib/supabase/client'

// Types (same as before)
export type Activity = 
  // Patient Care
  | 'PAF' 
  | 'AUTH_RESTRICTED_ANTIMICROBIALS' 
  | 'CLINICAL_ROUNDS'
  // Administrative
  | 'GUIDELINES_EHR'
  // Tracking
  | 'AMU'
  | 'AMR' 
  | 'ANTIBIOTIC_APPROPRIATENESS'
  | 'INTERVENTION_ACCEPTANCE'
  // Reporting
  | 'SHARING_DATA'
  // Education
  | 'PROVIDING_EDUCATION'
  | 'RECEIVING_EDUCATION'
  // Administrative
  | 'COMMITTEE_WORK'
  | 'QI_PROJECTS_RESEARCH'
  | 'EMAILS'
  // Other
  | 'OTHER';

export interface TimeEntry {
  id: string;
  task: Activity;
  otherTask?: string;
  minutes: number;          // 1..480
  occurredOn: string;       // ISO datetime (YYYY-MM-DDTHH:mm:ssZ)
  comment?: string;
  createdAt: string;        // ISO datetime
  updatedAt: string;        // ISO datetime
  deletedAt?: string | null;
}

export interface CreateEntryInput {
  task: Activity;
  otherTask?: string;
  minutes: number;
  occurredOn: string;
  comment?: string;
}

export interface UpdateEntryInput {
  task?: Activity;
  otherTask?: string;
  minutes?: number;
  occurredOn?: string;
  comment?: string;
}

export interface ListEntriesOptions {
  range?: 'today' | 'week' | 'all';
  task?: Activity;
  includeDeleted?: boolean;
}

export interface TodayTotals {
  total: number;
  // Patient Care
  PAF: number;
  AUTH_RESTRICTED_ANTIMICROBIALS: number;
  CLINICAL_ROUNDS: number;
  // Administrative
  GUIDELINES_EHR: number;
  // Tracking
  AMU: number;
  AMR: number;
  ANTIBIOTIC_APPROPRIATENESS: number;
  INTERVENTION_ACCEPTANCE: number;
  // Reporting
  SHARING_DATA: number;
  // Education
  PROVIDING_EDUCATION: number;
  RECEIVING_EDUCATION: number;
  // Administrative
  COMMITTEE_WORK: number;
  QI_PROJECTS_RESEARCH: number;
  EMAILS: number;
  // Other
  OTHER: number;
}

// Date utilities (updated for datetime support)
export const dateUtils = {
  today: (): string => new Date().toISOString().split('T')[0],
  
  todayDateTime: (): string => new Date().toISOString(),
  
  startOfWeek: (date: string = new Date().toISOString().split('T')[0]): string => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  },
  
  isToday: (date: string): boolean => {
    // Handle both date (YYYY-MM-DD) and datetime (YYYY-MM-DDTHH:mm:ssZ) formats
    const dateOnly = date.includes('T') ? date.split('T')[0] : date;
    return dateOnly === dateUtils.today();
  },
  
  isThisWeek: (date: string): boolean => {
    // Handle both date and datetime formats
    const dateOnly = date.includes('T') ? date.split('T')[0] : date;
    const entryDate = new Date(dateOnly);
    const startOfWeek = new Date(dateUtils.startOfWeek());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    return entryDate >= startOfWeek && entryDate <= endOfWeek;
  },
  
  formatDate: (date: string): string => {
    return new Date(date).toLocaleDateString();
  },
  
  formatDateTime: (datetime: string): string => {
    return new Date(datetime).toLocaleString();
  },
  
  formatTime: (datetime: string): string => {
    return new Date(datetime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },
  
  formatDateAndTime: (datetime: string): { date: string; time: string } => {
    const d = new Date(datetime);
    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};

// Helper function to convert Supabase row to TimeEntry
const mapSupabaseRowToTimeEntry = (row: Record<string, unknown>): TimeEntry => ({
  id: row.id as string,
  task: row.task as Activity,
  otherTask: (row.other_task as string) || undefined,
  minutes: row.minutes as number,
  occurredOn: row.occurred_on as string,
  comment: (row.comment as string) || undefined,
  createdAt: row.created_at as string,
  updatedAt: row.updated_at as string,
  deletedAt: (row.deleted_at as string) || undefined
});

// Helper function to convert TimeEntry to Supabase row
const mapTimeEntryToSupabaseRow = (entry: CreateEntryInput | UpdateEntryInput) => {
  const row: Record<string, unknown> = {};
  
  if ('task' in entry) row.task = entry.task;
  if ('otherTask' in entry) row.other_task = entry.otherTask;
  if ('minutes' in entry) row.minutes = entry.minutes;
  if ('occurredOn' in entry) row.occurred_on = entry.occurredOn;
  if ('comment' in entry) row.comment = entry.comment;
  
  return row;
};

// Supabase-based TimeEntryClient
class SupabaseTimeEntryClient {
  private supabase = createClient();


  async createEntry(input: CreateEntryInput): Promise<TimeEntry> {
    // Get the current user
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Failed to get authenticated user:', authError);
      throw new Error('You must be logged in to create time entries');
    }

    const { data, error } = await this.supabase
      .from('time_entries')
      .insert({
        user_id: user.id,
        task: input.task,
        other_task: input.otherTask,
        minutes: input.minutes,
        occurred_on: input.occurredOn,
        comment: input.comment
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create time entry:', error);
      throw new Error(`Failed to create time entry: ${error.message}`);
    }

    return mapSupabaseRowToTimeEntry(data);
  }

  async updateEntry(id: string, patch: UpdateEntryInput): Promise<TimeEntry> {
    // Get the current user
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Failed to get authenticated user:', authError);
      throw new Error('You must be logged in to update time entries');
    }

    const updateData = mapTimeEntryToSupabaseRow(patch);
    
    const { data, error } = await this.supabase
      .from('time_entries')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own entries
      .select()
      .single();

    if (error) {
      console.error('Failed to update time entry:', error);
      throw new Error(`Failed to update time entry: ${error.message}`);
    }

    return mapSupabaseRowToTimeEntry(data);
  }

  async deleteEntries(ids: string[]): Promise<void> {
    // Get the current user
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Failed to get authenticated user:', authError);
      throw new Error('You must be logged in to delete time entries');
    }

    const { error } = await this.supabase
      .from('time_entries')
      .update({ deleted_at: new Date().toISOString() })
      .in('id', ids)
      .eq('user_id', user.id); // Ensure user can only delete their own entries

    if (error) {
      console.error('Failed to delete time entries:', error);
      throw new Error(`Failed to delete time entries: ${error.message}`);
    }
  }

  async listEntries(options: ListEntriesOptions = {}): Promise<TimeEntry[]> {
    // Get the current user
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Failed to get authenticated user:', authError);
      throw new Error('You must be logged in to view time entries');
    }

    const { range = 'all', task, includeDeleted = false } = options;
    
    let query = this.supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', user.id) // Only show entries for current user
      .order('occurred_on', { ascending: false });

    // Apply deleted filter
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }

    // Apply task filter
    if (task) {
      query = query.eq('task', task);
    }

    // Apply range filter
    if (range === 'today') {
      const today = dateUtils.today();
      query = query.eq('occurred_on', today);
    } else if (range === 'week') {
      const startOfWeek = dateUtils.startOfWeek();
      const endOfWeek = new Date();
      endOfWeek.setDate(new Date(startOfWeek).getDate() + 6);
      const endOfWeekStr = endOfWeek.toISOString().split('T')[0];
      
      query = query
        .gte('occurred_on', startOfWeek)
        .lte('occurred_on', endOfWeekStr);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to list time entries:', error);
      throw new Error(`Failed to list time entries: ${error.message}`);
    }

    return data.map(mapSupabaseRowToTimeEntry);
  }

  async getTodayTotals(): Promise<TodayTotals> {
    const todayEntries = await this.listEntries({ range: 'today' });
    
    const totals: TodayTotals = {
      total: 0,
      // Patient Care
      PAF: 0,
      AUTH_RESTRICTED_ANTIMICROBIALS: 0,
      CLINICAL_ROUNDS: 0,
      // Administrative
      GUIDELINES_EHR: 0,
      // Tracking
      AMU: 0,
      AMR: 0,
      ANTIBIOTIC_APPROPRIATENESS: 0,
      INTERVENTION_ACCEPTANCE: 0,
      // Reporting
      SHARING_DATA: 0,
      // Education
      PROVIDING_EDUCATION: 0,
      RECEIVING_EDUCATION: 0,
      // Administrative
      COMMITTEE_WORK: 0,
      QI_PROJECTS_RESEARCH: 0,
      EMAILS: 0,
      // Other
      OTHER: 0
    };

    todayEntries.forEach(entry => {
      totals.total += entry.minutes;
      totals[entry.task] += entry.minutes;
    });

    return totals;
  }

  async duplicateEntry(entry: TimeEntry): Promise<TimeEntry> {
    return this.createEntry({
      task: entry.task,
      otherTask: entry.otherTask,
      minutes: entry.minutes,
      occurredOn: dateUtils.today(),
      comment: entry.comment
    });
  }

  async bulkDuplicateEntries(entries: TimeEntry[]): Promise<void> {
    // Get the current user
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Failed to get authenticated user:', authError);
      throw new Error('You must be logged in to duplicate time entries');
    }

    const today = dateUtils.today();
    
    const insertData = entries.map(entry => ({
      user_id: user.id,
      task: entry.task,
      other_task: entry.otherTask,
      minutes: entry.minutes,
      occurred_on: today,
      comment: entry.comment
    }));

    const { error } = await this.supabase
      .from('time_entries')
      .insert(insertData);

    if (error) {
      console.error('Failed to bulk duplicate entries:', error);
      throw new Error(`Failed to bulk duplicate entries: ${error.message}`);
    }
  }

  // Utility method to get entry by ID
  async getEntry(id: string): Promise<TimeEntry | null> {
    // Get the current user
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Failed to get authenticated user:', authError);
      throw new Error('You must be logged in to view time entries');
    }

    const { data, error } = await this.supabase
      .from('time_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only access their own entries
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      console.error('Failed to get time entry:', error);
      throw new Error(`Failed to get time entry: ${error.message}`);
    }

    return mapSupabaseRowToTimeEntry(data);
  }

  // Utility method to get storage stats (for compatibility)
  async getStorageStats(): Promise<{ total: number; active: number; deleted: number }> {
    // Get the current user
    const { data: { user }, error: authError } = await this.supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Failed to get authenticated user:', authError);
      throw new Error('You must be logged in to view storage stats');
    }

    const { data: allData, error: allError } = await this.supabase
      .from('time_entries')
      .select('id, deleted_at')
      .eq('user_id', user.id); // Only count entries for current user

    if (allError) {
      console.error('Failed to get storage stats:', allError);
      throw new Error(`Failed to get storage stats: ${allError.message}`);
    }

    const total = allData.length;
    const active = allData.filter(entry => !entry.deleted_at).length;
    const deleted = total - active;
    
    return { total, active, deleted };
  }

}

// Export singleton instance
export const supabaseTimeEntryClient = new SupabaseTimeEntryClient();
