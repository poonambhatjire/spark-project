"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { checkProfileCompletion, updateUserProfile, getUserProfile, UserProfileData } from "@/lib/actions/user-profile"
import { PROFESSIONAL_TITLES } from "@/lib/constants/profile"
import UserProfileForm from "./UserProfileForm"

interface ProfileCompletionPromptProps {
  onComplete?: () => void
}

export default function ProfileCompletionPrompt({ onComplete }: ProfileCompletionPromptProps) {
  const [isComplete, setIsComplete] = useState(true)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [profileInitialData, setProfileInitialData] = useState<Partial<UserProfileData> | undefined>()

  const TOTAL_REQUIRED_FIELDS = 5

  useEffect(() => {
    checkProfileStatus()
  }, [])

  const checkProfileStatus = async () => {
    setIsLoading(true)
    try {
      const result = await checkProfileCompletion()
      setIsComplete(result.isComplete)
      setMissingFields(result.missingFields)
      if (!result.isComplete) {
        const profileResponse = await getUserProfile()
        if (profileResponse.success && profileResponse.data) {
          const profile = profileResponse.data
          const rawTitle = (profile?.title as string) || (profile?.professional_title as string) || ""
          const isKnownTitle = rawTitle !== "" && PROFESSIONAL_TITLES.includes(rawTitle as typeof PROFESSIONAL_TITLES[number])

          setProfileInitialData({
            fullName: (profile?.name as string) || "",
            email: (profile?.email as string) || "",
            title: isKnownTitle ? rawTitle : rawTitle ? "Other, please specify" : "",
            titleOther: isKnownTitle ? undefined : rawTitle || undefined,
            experienceLevel: (profile?.experience_level as string) || (profile?.years_of_experience as string) || "",
            institution: (profile?.institution as string) || (profile?.organization as string) || ""
          })
        } else {
          setProfileInitialData(undefined)
        }
      } else {
        setProfileInitialData(undefined)
      }
    } catch (error) {
      console.error('Error checking profile completion:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSubmit = async (data: UserProfileData) => {
    try {
      const result = await updateUserProfile(data)
      if (result.success) {
        await checkProfileStatus()
        onComplete?.()
      } else {
        console.error('Failed to update profile:', result.error)
      }
      return result
    } catch (error) {
      console.error('Error updating profile:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Checking profile...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isComplete) {
    return null // Don't show anything if profile is complete
  }
  const completionPercent = Math.max(0, Math.round(((TOTAL_REQUIRED_FIELDS - missingFields.length) / TOTAL_REQUIRED_FIELDS) * 100))
  const friendlyFieldName = (field: string) => field
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Complete Your Profile to Continue</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Profile information is required before you can log stewardship activities.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white border border-blue-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">{completionPercent}%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3">Still needed:</h4>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {missingFields.map((field) => (
                <div key={field} className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span>{friendlyFieldName(field)}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Completing your profile helps us link calculator outputs with survey responses and provide accurate insights.
            </p>
          </div>
        </div>
      </div>

      <UserProfileForm 
        onSubmit={handleProfileSubmit}
        initialData={profileInitialData}
        isEditing={false}
      />
    </div>
  )
}
