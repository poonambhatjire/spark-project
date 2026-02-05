// Server actions for time entries
// These run on the server and have access to the authenticated user session

'use server'

import { createClient } from '@/lib/supabase/server'
import { CreateEntryInput, UpdateEntryInput, TimeEntry, Activity } from '@/app/dashboard/data/client'
import type { SupabaseClient } from '@supabase/supabase-js'

// Helper function to convert Supabase row to TimeEntry
const mapSupabaseRowToTimeEntry = (row: Record<string, unknown>): TimeEntry => {
  // Task is always set (we set it in create/update)
  const task = (row.task as string) || '';
  
  // Create clean object for React serialization
  return {
    id: String(row.id || ''),
    task: task as Activity,
    otherTask: row.other_task ? String(row.other_task) : undefined,
    minutes: Number(row.minutes || 0),
    patientCount: row.patient_count !== null && row.patient_count !== undefined ? Number(row.patient_count) : null,
    isTypicalDay: Boolean(row.is_typical_day ?? true),
    occurredOn: String(row.occurred_on || ''),
    comment: row.comment ? String(row.comment) : undefined,
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || ''),
    deletedAt: row.deleted_at ? String(row.deleted_at) : undefined
  };
};

// Helper function to get activity_id from task name
async function getActivityIdFromTask(supabase: SupabaseClient, taskName: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('activities')
    .select('id')
    .eq('name', taskName)
    .single();
  
  if (error || !data) {
    console.error('Failed to find activity:', taskName, error);
    return null;
  }
  
  return data.id;
}

// Helper function to convert TimeEntry to Supabase row
async function mapTimeEntryToSupabaseRow(supabase: SupabaseClient, entry: CreateEntryInput | UpdateEntryInput) {
  const row: Record<string, unknown> = {};
  
  // If task is provided, look up activity_id and always set task (required by DB constraint)
  if ('task' in entry && entry.task) {
    row.task = entry.task; // Always set task (required by DB constraint, will be removed later)
    const activityId = await getActivityIdFromTask(supabase, entry.task);
    if (activityId) {
      row.activity_id = activityId; // Also set activity_id (normalized structure)
    }
  }
  
  if ('otherTask' in entry) row.other_task = entry.otherTask;
  if ('minutes' in entry) row.minutes = entry.minutes;
  if ('patientCount' in entry) row.patient_count = entry.patientCount ?? null;
  if ('isTypicalDay' in entry) row.is_typical_day = entry.isTypicalDay ?? true;
  if ('occurredOn' in entry) row.occurred_on = entry.occurredOn;
  if ('comment' in entry) row.comment = entry.comment;
  
  return row;
}

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

    // Get activity_id from task name
    const activityId = await getActivityIdFromTask(supabase, input.task);
    
    const insertData: Record<string, unknown> = {
      user_id: user.id,
      task: input.task, // Always set task (required by DB constraint, will be removed later)
      other_task: input.otherTask,
      minutes: input.minutes,
      patient_count: input.patientCount ?? null,
      is_typical_day: input.isTypicalDay ?? true,
      occurred_on: input.occurredOn,
      comment: input.comment
    };
    
    // Also set activity_id if found (normalized structure)
    if (activityId) {
      insertData.activity_id = activityId;
    }
    
    const { data, error } = await supabase
      .from('time_entries')
      .insert(insertData)
      .select('*')
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

    const updateData = await mapTimeEntryToSupabaseRow(supabase, patch);
    
    const { data, error } = await supabase
      .from('time_entries')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only update their own entries
      .select('*')
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
    
    // Select all columns (task is already set, no need for join)
    let query = supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', user.id) // Only show entries for current user
      .order('occurred_on', { ascending: false });

    // Apply deleted filter
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }

    // Apply task filter - support both activity name and old task string
    if (task) {
      // First try to find activity_id by name
      const { data: activity } = await supabase
        .from('activities')
        .select('id')
        .eq('name', task)
        .single();
      
      if (activity?.id) {
        query = query.eq('activity_id', activity.id);
      } else {
        // Fallback to old task column
        query = query.eq('task', task);
      }
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
