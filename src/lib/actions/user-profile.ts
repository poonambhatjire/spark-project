// Server actions for user profile management
"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UserProfileData {
  fullName: string
  email: string
  title: string
  titleOther?: string // For "Other, please specify" option
  experienceLevel: string
  institution: string
  institutionOther?: string
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

    // Use "Other" title if provided, otherwise use selected title
    const finalTitle = data.title === 'Other, please specify' && data.titleOther 
      ? data.titleOther 
      : data.title
    const normalizedName = data.fullName.trim()
    const normalizedEmail = data.email.trim()
    const normalizedExperience = data.experienceLevel.trim()
    const normalizedInstitution = data.institution.trim()
    const normalizedInstitutionOther = data.institutionOther?.trim() || ""
    const normalizedTitle = finalTitle.trim()
    const finalInstitution =
      normalizedInstitution === "Other" && normalizedInstitutionOther
        ? normalizedInstitutionOther
        : normalizedInstitution
    const institutionNotes =
      normalizedInstitution !== "Other" && normalizedInstitutionOther
        ? normalizedInstitutionOther
        : null

    // Update the profile
    const { error } = await supabase
      .from('profiles')
      .update({
        name: normalizedName,
        email: normalizedEmail,
        title: normalizedTitle,
        experience_level: normalizedExperience,
        institution: finalInstitution,
        notes: institutionNotes,
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
      'email',
      'title',
      'experience_level',
      'institution'
    ]

    const missingFields = requiredFields.filter(field => {
      const value = data[field as keyof typeof data]
      if (typeof value === 'string') {
        return value.trim() === ''
      }
      return !value
    })

    return {
      isComplete: missingFields.length === 0,
      missingFields
    }
  } catch (error) {
    console.error('Error checking profile completion:', error)
    return { isComplete: false, missingFields: [] }
  }
}
