"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
// Textarea no longer needed

import { PROFESSIONAL_TITLES, EXPERIENCE_LEVELS } from "@/lib/constants/profile"

// Validation schema for user profile
const userProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  title: z.string().min(1, "Professional title is required"),
  titleOther: z.string().optional(),
  experienceLevel: z.string().min(1, "Experience level is required"),
  institution: z.string().min(2, "Institution is required"),
}).refine((data) => {
  // If "Other" is selected, titleOther must be provided
  if (data.title === 'Other, please specify') {
    return data.titleOther && data.titleOther.length >= 2
  }
  return true
}, {
  message: "Please specify your title",
  path: ["titleOther"]
})

type UserProfileFormData = z.infer<typeof userProfileSchema>

interface UserProfileFormProps {
  onSubmit: (data: UserProfileFormData) => Promise<{ success: boolean; error?: string }>
  initialData?: Partial<UserProfileFormData>
  isEditing?: boolean
}

export default function UserProfileForm({ onSubmit, initialData, isEditing = false }: UserProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      title: initialData?.title || "",
      titleOther: initialData?.titleOther || "",
      experienceLevel: initialData?.experienceLevel || "",
      institution: initialData?.institution || ""
    }
  })

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        title: initialData.title || "",
        titleOther: initialData.titleOther || "",
        experienceLevel: initialData.experienceLevel || "",
        institution: initialData.institution || ""
      })
    }
  }, [initialData, reset])

  // Watch title field to show/hide "Other" input
  const watchedTitle = watch('title')

  const handleFormSubmit = async (data: UserProfileFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    
    try {
      const result = await onSubmit(data)
      
      if (result?.success) {
        setSubmitSuccess(true)
        // Auto-hide success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000)
      } else {
        setSubmitError(result?.error || 'Failed to update profile')
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred')
      console.error("Failed to save profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // No longer using multi-step form

  // Simplified single-step form
  const renderForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Full Name *</label>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your full name"
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email Address *</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                placeholder="Enter your email address"
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Your Job Title *</label>
          <div className="space-y-2">
            {PROFESSIONAL_TITLES.map((title) => (
              <div key={title} className="flex items-center space-x-2">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="radio"
                      id={`title-${title}`}
                      value={title}
                      checked={field.value === title}
                      onChange={field.onChange}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                  )}
                />
                <label htmlFor={`title-${title}`} className="text-sm text-slate-700 cursor-pointer">
                  {title === 'Other, please specify' ? 'Other, please specify:' : title}
                </label>
              </div>
            ))}
            {watchedTitle === 'Other, please specify' && (
              <div className="ml-6 mt-2">
                <Controller
                  name="titleOther"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Specify your title"
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  )}
                />
                {errors.titleOther && (
                  <p className="text-sm text-red-600 mt-1">{errors.titleOther.message}</p>
                )}
              </div>
            )}
          </div>
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Experience Level *</label>
          <Controller
            name="experienceLevel"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.experienceLevel && (
            <p className="text-sm text-red-600">{errors.experienceLevel.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Institution *</label>
          <Controller
            name="institution"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your institution"
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          />
          {errors.institution && (
            <p className="text-sm text-red-600">{errors.institution.message}</p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {isEditing ? "Edit Profile" : "Complete Your Profile"}
              </h1>
              <p className="text-slate-600 mt-1">
                {isEditing 
                  ? "Update your profile information" 
                  : "Help us personalize your SPARC experience with professional information"
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-8 py-6">
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-800 dark:text-green-200 font-medium">
                  Profile updated successfully!
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 dark:text-red-200 font-medium">
                  {submitError}
                </p>
              </div>
            </div>
          )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Form content */}
          {renderForm()}

          {/* Submit button */}
          <div className="flex items-center justify-end pt-8 border-t border-slate-200">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  {isEditing ? "Update Profile" : "Complete Profile"}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

