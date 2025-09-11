'use server'

import { createClient } from '@/lib/supabase/server'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  is_active?: boolean
  created_at: string
}

export async function checkAdminAccess(): Promise<{ 
  success: boolean; 
  isAdmin: boolean; 
  user?: AdminUser; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, isAdmin: false, error: 'Not authenticated' }
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, name, role, created_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return { success: false, isAdmin: false, error: 'Profile not found' }
    }

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
    
    return {
      success: true,
      isAdmin,
      user: profile ? {
        id: profile.id,
        email: profile.email || user.email || '',
        name: profile.name || '',
        role: profile.role || 'user',
        created_at: profile.created_at
      } : undefined
    }
  } catch (error) {
    console.error('Error checking admin access:', error)
    return { success: false, isAdmin: false, error: 'An unexpected error occurred' }
  }
}

export async function getAllUsers(): Promise<{ 
  success: boolean; 
  users?: AdminUser[]; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    // First check if user is admin
    const adminCheck = await checkAdminAccess()
    if (!adminCheck.success || !adminCheck.isAdmin) {
      return { success: false, error: 'Admin access required' }
    }

    // Use secure database function to get all users
    const { data: users, error } = await supabase
      .rpc('get_all_users_for_admin')

    if (error) {
      console.error('Error fetching users:', error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      users: users?.map(user => ({
        id: user.id,
        email: user.email || '',
        name: user.name || '',
        role: user.role || 'user',
        is_active: user.is_active ?? true,
        created_at: user.created_at
      })) || []
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export interface ActivityStats {
  totalEntries: number
  totalMinutes: number
  uniqueUsers: number
  activityBreakdown: Record<string, number>
  recentActivity: Array<{
    id: string
    user_name: string
    user_email: string
    task: string
    minutes: number
    occurred_on: string
    created_at: string
  }>
}

export async function getActivityStats(): Promise<{ 
  success: boolean; 
  stats?: ActivityStats; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    // First check if user is admin
    const adminCheck = await checkAdminAccess()
    if (!adminCheck.success || !adminCheck.isAdmin) {
      return { success: false, error: 'Admin access required' }
    }

    // Use secure database function to get activity statistics
    const { data: entries, error } = await supabase
      .rpc('get_activity_stats_for_admin')

    if (error) {
      console.error('Error fetching activity stats:', error)
      return { success: false, error: error.message }
    }

    // Calculate statistics
    const totalEntries = entries?.length || 0
    const totalMinutes = entries?.reduce((sum, entry) => sum + entry.minutes, 0) || 0
    const uniqueUsers = new Set(entries?.map(entry => entry.user_name)).size || 0

    // Activity breakdown by task type
    const activityBreakdown: Record<string, number> = {}
    entries?.forEach(entry => {
      activityBreakdown[entry.task] = (activityBreakdown[entry.task] || 0) + entry.minutes
    })

    // Recent activity
    const recentActivity = entries?.slice(0, 10).map(entry => ({
      id: entry.id,
      user_name: entry.user_name || 'Unknown',
      user_email: entry.user_email || '',
      task: entry.task,
      minutes: entry.minutes,
      occurred_on: entry.occurred_on,
      created_at: entry.created_at
    })) || []

    return {
      success: true,
      stats: {
        totalEntries,
        totalMinutes,
        uniqueUsers,
        activityBreakdown,
        recentActivity
      }
    }
  } catch (error) {
    console.error('Error fetching activity stats:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getUserActivity(userId: string): Promise<{ 
  success: boolean; 
  activities?: Array<{
    id: string
    task: string
    other_task?: string
    minutes: number
    occurred_on: string
    comment?: string
    created_at: string
  }>; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    // First check if user is admin
    const adminCheck = await checkAdminAccess()
    if (!adminCheck.success || !adminCheck.isAdmin) {
      return { success: false, error: 'Admin access required' }
    }

    // Use secure database function to get user activity
    const { data: activities, error } = await supabase
      .rpc('get_user_activity_for_admin', { target_user_id: userId })

    if (error) {
      console.error('Error fetching user activity:', error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      activities: activities || []
    }
  } catch (error) {
    console.error('Error fetching user activity:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateUserRole(userId: string, newRole: 'user' | 'admin' | 'super_admin'): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    // First check if user is admin
    const adminCheck = await checkAdminAccess()
    if (!adminCheck.success || !adminCheck.isAdmin) {
      return { success: false, error: 'Admin access required' }
    }

    // Prevent non-super-admins from creating super-admins
    if (newRole === 'super_admin' && adminCheck.user?.role !== 'super_admin') {
      return { success: false, error: 'Only super admins can create super admins' }
    }

    // Update user role
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateUserStatus(userId: string, isActive: boolean): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    // First check if user is admin
    const adminCheck = await checkAdminAccess()
    if (!adminCheck.success || !adminCheck.isAdmin) {
      return { success: false, error: 'Admin access required' }
    }

    // Update user status
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating user status:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function bulkUpdateUserRoles(
  userIds: string[],
  newRole: 'user' | 'admin' | 'super_admin'
): Promise<{ success: boolean; error?: string; updatedCount?: number }> {
  try {
    const supabase = await createClient()
    
    // First check if user is admin
    const adminCheck = await checkAdminAccess()
    if (!adminCheck.success || !adminCheck.isAdmin) {
      return { success: false, error: 'Admin access required' }
    }

    // Only super_admins can do bulk role changes
    if (adminCheck.user?.role !== 'super_admin') {
      return { success: false, error: 'Only super admins can perform bulk role updates' }
    }

    // Prevent creating super_admins via bulk operation
    if (newRole === 'super_admin') {
      return { success: false, error: 'Cannot create super admins via bulk operation' }
    }

    if (userIds.length === 0) {
      return { success: false, error: 'No users selected' }
    }

    const { error, count } = await supabase
      .from('profiles')
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .in('id', userIds)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, updatedCount: count || 0 }
  } catch (error) {
    console.error('Error in bulkUpdateUserRoles:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function bulkUpdateUserStatus(
  userIds: string[],
  isActive: boolean
): Promise<{ success: boolean; error?: string; updatedCount?: number }> {
  try {
    const supabase = await createClient()
    
    // First check if user is admin
    const adminCheck = await checkAdminAccess()
    if (!adminCheck.success || !adminCheck.isAdmin) {
      return { success: false, error: 'Admin access required' }
    }

    if (userIds.length === 0) {
      return { success: false, error: 'No users selected' }
    }

    const { error, count } = await supabase
      .from('profiles')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .in('id', userIds)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, updatedCount: count || 0 }
  } catch (error) {
    console.error('Error in bulkUpdateUserStatus:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
