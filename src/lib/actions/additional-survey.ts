"use server"

import { createClient } from "@/lib/supabase/server"

export interface AdditionalSurveyData {
  licensedBeds?: number | null
  occupiedBedsCount?: number | null
  occupiedBedsPercent?: number | null
  icuBeds?: number | null
  aspFte?: number | null
  pharmacistFte?: number | null
  physicianFte?: number | null
  other1Specify?: string | null
  other1Fte?: number | null
  other2Specify?: string | null
  other2Fte?: number | null
  other3Specify?: string | null
  other3Fte?: number | null
  saarValue?: number | null
  saarCategory?: string | null
  effectivenessOptions?: string[]
  effectivenessOther?: string | null
}

export async function getAdditionalSurvey(): Promise<{
  success: boolean
  data?: AdditionalSurveyData
  error?: string
}> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const { data, error } = await supabase
      .from("additional_survey_responses")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return { success: true, data: undefined }
      }
      return { success: false, error: error.message }
    }

    const map: AdditionalSurveyData = {
      licensedBeds: data?.licensed_beds ?? null,
      occupiedBedsCount: data?.occupied_beds_count ?? null,
      occupiedBedsPercent: data?.occupied_beds_percent ?? null,
      icuBeds: data?.icu_beds ?? null,
      aspFte: data?.asp_fte ?? null,
      pharmacistFte: data?.pharmacist_fte ?? null,
      physicianFte: data?.physician_fte ?? null,
      other1Specify: data?.other1_specify ?? null,
      other1Fte: data?.other1_fte ?? null,
      other2Specify: data?.other2_specify ?? null,
      other2Fte: data?.other2_fte ?? null,
      other3Specify: data?.other3_specify ?? null,
      other3Fte: data?.other3_fte ?? null,
      saarValue: data?.saar_value ?? null,
      saarCategory: data?.saar_category ?? null,
      effectivenessOptions: Array.isArray(data?.effectiveness_options)
        ? data.effectiveness_options
        : [],
      effectivenessOther: data?.effectiveness_other ?? null,
    }

    return { success: true, data: map }
  } catch (err) {
    console.error("getAdditionalSurvey error:", err)
    return { success: false, error: "Failed to load survey" }
  }
}

export async function saveAdditionalSurvey(
  input: AdditionalSurveyData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    const row: Record<string, unknown> = {
      user_id: user.id,
      licensed_beds: input.licensedBeds ?? null,
      occupied_beds_count: input.occupiedBedsCount ?? null,
      occupied_beds_percent: input.occupiedBedsPercent ?? null,
      icu_beds: input.icuBeds ?? null,
      asp_fte: input.aspFte ?? null,
      pharmacist_fte: input.pharmacistFte ?? null,
      physician_fte: input.physicianFte ?? null,
      other1_specify: input.other1Specify?.trim() || null,
      other1_fte: input.other1Fte ?? null,
      other2_specify: input.other2Specify?.trim() || null,
      other2_fte: input.other2Fte ?? null,
      other3_specify: input.other3Specify?.trim() || null,
      other3_fte: input.other3Fte ?? null,
      saar_value: input.saarValue ?? null,
      saar_category: input.saarCategory || null,
      effectiveness_options: input.effectivenessOptions ?? [],
      effectiveness_other: input.effectivenessOther?.trim() || null,
    }

    const { error } = await supabase.from("additional_survey_responses").upsert(row, {
      onConflict: "user_id",
      ignoreDuplicates: false,
    })

    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err) {
    console.error("saveAdditionalSurvey error:", err)
    return { success: false, error: "Failed to save survey" }
  }
}
