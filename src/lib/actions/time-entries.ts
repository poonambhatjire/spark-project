// Server actions for time entries
// These run on the server and have access to the authenticated user session

'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateEntryInput, UpdateEntryInput, TimeEntry, Activity } from '@/app/dashboard/data/client'

// Helper function to convert Supabase row to TimeEntry
const mapSupabaseRowToTimeEntry = (row: Record<string, unknown>): TimeEntry => ({
  id: row.id as string,
  task: row.task as Activity,
  otherTask: (row.other_task as string) || undefined,
  minutes: row.minutes as number,
  patientCount: (row.patient_count as number) ?? null,
  isTypicalDay: (row.is_typical_day as boolean) ?? true,
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
  if ('patientCount' in entry) row.patient_count = entry.patientCount ?? null;
  if ('isTypicalDay' in entry) row.is_typical_day = entry.isTypicalDay ?? true;
  if ('occurredOn' in entry) row.occurred_on = entry.occurredOn;
  if ('comment' in entry) row.comment = entry.comment;
  
  return row;
};

export async function createTimeEntry(input: CreateEntryInput): Promise<{ success: boolean; data?: TimeEntry; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be logged in to create time entries' 
      };
    }

    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        user_id: user.id,
        task: input.task,
        other_task: input.otherTask,
        minutes: input.minutes,
      patient_count: input.patientCount ?? null,
        is_typical_day: input.isTypicalDay ?? true,
        occurred_on: input.occurredOn,
        comment: input.comment
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create time entry:', error);
      return { 
        success: false, 
        error: `Failed to create time entry: ${error.message}` 
      };
    }

    return { 
      success: true, 
      data: mapSupabaseRowToTimeEntry(data) 
    };
  } catch (error) {
    console.error('Create time entry error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function updateTimeEntry(id: string, patch: UpdateEntryInput): Promise<{ success: boolean; data?: TimeEntry; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be logged in to update time entries' 
      };
    }

    const updateData = mapTimeEntryToSupabaseRow(patch);
    
    const { data, error } = await supabase
      .from('time_entries')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own entries
      .select()
      .single();

    if (error) {
      console.error('Failed to update time entry:', error);
      return { 
        success: false, 
        error: `Failed to update time entry: ${error.message}` 
      };
    }

    return { 
      success: true, 
      data: mapSupabaseRowToTimeEntry(data) 
    };
  } catch (error) {
    console.error('Update time entry error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function deleteTimeEntries(ids: string[]): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be logged in to delete time entries' 
      };
    }

    const { error } = await supabase
      .from('time_entries')
      .update({ deleted_at: new Date().toISOString() })
      .in('id', ids)
      .eq('user_id', user.id); // Ensure user can only delete their own entries

    if (error) {
      console.error('Failed to delete time entries:', error);
      return { 
        success: false, 
        error: `Failed to delete time entries: ${error.message}` 
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete time entries error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function listTimeEntries(options: { range?: 'today' | 'week' | 'all'; task?: string; includeDeleted?: boolean } = {}): Promise<{ success: boolean; data?: TimeEntry[]; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be logged in to view time entries' 
      };
    }

  const { range = 'all', task, includeDeleted = false } = options;
    
    let query = supabase
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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startOfDay = today.toISOString()

    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)

    query = query
      .gte('occurred_on', startOfDay)
      .lte('occurred_on', endOfDay.toISOString())
  } else if (range === 'week') {
    const now = new Date()
    const startOfWeek = new Date(now)
    const day = startOfWeek.getDay()
    const diff = day === 0 ? -6 : 1 - day
    startOfWeek.setDate(startOfWeek.getDate() + diff)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    query = query
      .gte('occurred_on', startOfWeek.toISOString())
      .lte('occurred_on', endOfWeek.toISOString())
  }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to list time entries:', error);
      return { 
        success: false, 
        error: `Failed to list time entries: ${error.message}` 
      };
    }

    return { 
      success: true, 
      data: data.map(mapSupabaseRowToTimeEntry)
    };
  } catch (error) {
    console.error('List time entries error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
