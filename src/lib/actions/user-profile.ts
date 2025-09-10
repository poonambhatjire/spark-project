// Server actions for user profile management
"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UserProfileData {
  fullName: string
  phoneNumber?: string
  professionalTitle: string
  institution: string
  department: string
  specialty: string
  yearsOfExperience: string
  licenseNumber?: string
  workLocation: string
  stewardshipRole: string
  certificationStatus?: string
  timeZone?: string
  manager?: string
  team?: string
  notes?: string
}

export async function updateUserProfile(data: UserProfileData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be logged in to update your profile' 
      }
    }

    // Update the profile
    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.fullName,
        phone_number: data.phoneNumber,
        professional_title: data.professionalTitle,
        organization: data.institution,
        department: data.department,
        specialty: data.specialty,
        years_of_experience: data.yearsOfExperience,
        license_number: data.licenseNumber,
        work_location: data.workLocation,
        stewardship_role: data.stewardshipRole,
        certification_status: data.certificationStatus,
        time_zone: data.timeZone,
        manager: data.manager,
        team: data.team,
        notes: data.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      return { 
        success: false, 
        error: error.message 
      }
    }

    // Revalidate the dashboard to show updated profile
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred while updating your profile' 
    }
  }
}

export async function getUserProfile(): Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }> {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be logged in to view your profile' 
      }
    }

    // Get the profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      return { 
        success: false, 
        error: error.message 
      }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred while fetching your profile' 
    }
  }
}

export async function checkProfileCompletion(): Promise<{ isComplete: boolean; missingFields: string[] }> {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { isComplete: false, missingFields: [] }
    }

    // Get the profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !data) {
      return { isComplete: false, missingFields: [] }
    }

    // Check required fields
    const requiredFields = [
      'name',
      'professional_title',
      'organization',
      'department',
      'specialty',
      'years_of_experience',
      'work_location',
      'stewardship_role'
    ]

    const missingFields = requiredFields.filter(field => !data[field] || data[field] === '')

    return {
      isComplete: missingFields.length === 0,
      missingFields
    }
  } catch (error) {
    console.error('Error checking profile completion:', error)
    return { isComplete: false, missingFields: [] }
  }
}
