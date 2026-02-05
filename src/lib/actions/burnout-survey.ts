// Server actions for burnout survey
"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface BurnoutSurveyResponse {
  questionNumber: number
  responseValue: number // 1=Strongly Agree, 2=Agree, 3=Disagree, 4=Strongly Disagree
}

export interface BurnoutSurveyData {
  responses: BurnoutSurveyResponse[]
  completedAt?: string
}

export interface BurnoutSurveyScores {
  exhaustionScore: number
  disengagementScore: number
  exhaustionAverage: number
  disengagementAverage: number
  totalAverage: number
}

// OLBI Scoring: Questions are divided into Exhaustion and Disengagement subscales
// Some questions are reverse-scored (positive statements)
const EXHAUSTION_QUESTIONS = [2, 4, 5, 8, 10, 12] // Questions 2, 4, 8, 12 are direct; 5, 10 are reverse
const DISENGAGEMENT_QUESTIONS = [1, 3, 6, 7, 9, 11] // Questions 3, 6, 9, 11 are direct; 1, 7 are reverse
const REVERSE_SCORED_QUESTIONS = [1, 5, 7, 10] // Positive statements that need reverse scoring

// Reverse score: 1->4, 2->3, 3->2, 4->1
function reverseScore(value: number): number {
  return 5 - value
}

export async function saveBurnoutSurvey(
  responses: BurnoutSurveyResponse[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be logged in to save your survey responses' 
      }
    }

    // Validate responses
    if (!responses || responses.length !== 12) {
      return {
        success: false,
        error: 'Please answer all 12 questions'
      }
    }

    // Validate each response
    for (const response of responses) {
      if (response.questionNumber < 1 || response.questionNumber > 12) {
        return {
          success: false,
          error: 'Invalid question number'
        }
      }
      if (response.responseValue < 1 || response.responseValue > 4) {
        return {
          success: false,
          error: 'Invalid response value'
        }
      }
    }

    // Use individual upserts for each question to handle the unique constraint properly
    // This ensures each question is inserted or updated correctly
    const completedAt = new Date().toISOString()
    
    for (const response of responses) {
      const { error: upsertError } = await supabase
        .from('burnout_survey_responses')
        .upsert({
          user_id: user.id,
          question_number: response.questionNumber,
          response_value: response.responseValue,
          completed_at: completedAt
        }, {
          onConflict: 'user_id,question_number'
        })
      
      if (upsertError) {
        console.error(`Error saving question ${response.questionNumber}:`, upsertError)
        return {
          success: false,
          error: `Failed to save question ${response.questionNumber}: ${upsertError.message}`
        }
      }
    }

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Error in saveBurnoutSurvey:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while saving your survey'
    }
  }
}

export async function getBurnoutSurvey(): Promise<{ 
  success: boolean
  data?: BurnoutSurveyData
  error?: string 
}> {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'You must be logged in to view your survey responses' 
      }
    }

    // Get all responses for this user
    const { data, error } = await supabase
      .from('burnout_survey_responses')
      .select('question_number, response_value, completed_at')
      .eq('user_id', user.id)
      .order('question_number', { ascending: true })

    if (error) {
      console.error('Error fetching survey responses:', error)
      return {
        success: false,
        error: 'Failed to load survey responses'
      }
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        data: {
          responses: [],
          completedAt: undefined
        }
      }
    }

    // Get the most recent completed_at timestamp
    const completedAt = data[0]?.completed_at || undefined

    const responses: BurnoutSurveyResponse[] = data.map(row => ({
      questionNumber: row.question_number as number,
      responseValue: row.response_value as number
    }))

    return {
      success: true,
      data: {
        responses,
        completedAt
      }
    }
  } catch (error) {
    console.error('Error in getBurnoutSurvey:', error)
    return {
      success: false,
      error: 'An unexpected error occurred while loading your survey'
    }
  }
}

export async function calculateBurnoutScores(
  responses: BurnoutSurveyResponse[]
): Promise<BurnoutSurveyScores> {
  // Calculate exhaustion score
  let exhaustionSum = 0
  let exhaustionCount = 0
  
  for (const response of responses) {
    if (EXHAUSTION_QUESTIONS.includes(response.questionNumber)) {
      let score = response.responseValue
      // Reverse score for positive statements
      if (REVERSE_SCORED_QUESTIONS.includes(response.questionNumber)) {
        score = reverseScore(score)
      }
      exhaustionSum += score
      exhaustionCount++
    }
  }

  // Calculate disengagement score
  let disengagementSum = 0
  let disengagementCount = 0
  
  for (const response of responses) {
    if (DISENGAGEMENT_QUESTIONS.includes(response.questionNumber)) {
      let score = response.responseValue
      // Reverse score for positive statements
      if (REVERSE_SCORED_QUESTIONS.includes(response.questionNumber)) {
        score = reverseScore(score)
      }
      disengagementSum += score
      disengagementCount++
    }
  }

  const exhaustionAverage = exhaustionCount > 0 ? exhaustionSum / exhaustionCount : 0
  const disengagementAverage = disengagementCount > 0 ? disengagementSum / disengagementCount : 0
  const totalAverage = (exhaustionAverage + disengagementAverage) / 2

  return {
    exhaustionScore: exhaustionSum,
    disengagementScore: disengagementSum,
    exhaustionAverage: Math.round(exhaustionAverage * 100) / 100,
    disengagementAverage: Math.round(disengagementAverage * 100) / 100,
    totalAverage: Math.round(totalAverage * 100) / 100
  }
}
