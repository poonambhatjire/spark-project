"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { checkProfileCompletion, updateUserProfile, UserProfileData } from "@/lib/actions/user-profile"
import UserProfileForm from "./UserProfileForm"

interface ProfileCompletionPromptProps {
  onComplete?: () => void
}

export default function ProfileCompletionPrompt({ onComplete }: ProfileCompletionPromptProps) {
  const [showForm, setShowForm] = useState(false)
  const [isComplete, setIsComplete] = useState(true)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkProfileStatus()
  }, [])

  const checkProfileStatus = async () => {
    try {
      const result = await checkProfileCompletion()
      setIsComplete(result.isComplete)
      setMissingFields(result.missingFields)
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
        setShowForm(false)
        setIsComplete(true)
        setMissingFields([])
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

  if (showForm) {
    return (
      <div className="w-full max-w-4xl mx-auto mb-6">
        <UserProfileForm 
          onSubmit={handleProfileSubmit}
          isEditing={false}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
        <div className="p-6">
          {/* Header */}
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
                <h3 className="text-lg font-semibold text-slate-900">Complete Your Profile</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Help us personalize your SPARC experience with professional information
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">
                  {Math.round((missingFields.length / 8) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Missing Fields */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Missing Information:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {missingFields.map((field) => (
                <div key={field} className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                  <span className="capitalize">
                    {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              This will help us provide better insights and recommendations
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsComplete(true)}
                className="border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Skip for Now
              </Button>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Complete Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
