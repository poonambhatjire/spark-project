"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Textarea } from "@/app/components/ui/textarea"

// Validation schema for user profile
const userProfileSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  professionalTitle: z.string().min(2, "Professional title is required"),
  
  // Professional Information
  institution: z.string().min(2, "Institution is required"),
  department: z.string().min(2, "Department is required"),
  specialty: z.string().min(2, "Specialty is required"),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  licenseNumber: z.string().optional(),
  
  // SPARC-Specific
  workLocation: z.string().min(2, "Work location is required"),
  stewardshipRole: z.string().min(2, "Stewardship role is required"),
  certificationStatus: z.string().optional(),
  timeZone: z.string().optional(),
  
  // Optional
  manager: z.string().optional(),
  team: z.string().optional(),
  notes: z.string().optional()
})

type UserProfileFormData = z.infer<typeof userProfileSchema>

// Professional titles
const PROFESSIONAL_TITLES = [
  "Physician",
  "Pharmacist",
  "Nurse",
  "Microbiologist",
  "Infection Preventionist",
  "Quality Improvement Specialist",
  "Administrator",
  "Researcher",
  "Other"
]

// Specialties
const SPECIALTIES = [
  "Infectious Diseases",
  "Pharmacy",
  "Microbiology",
  "Internal Medicine",
  "Critical Care",
  "Emergency Medicine",
  "Surgery",
  "Pediatrics",
  "Infection Prevention",
  "Quality Improvement",
  "Administration",
  "Research",
  "Other"
]

// Stewardship roles
const STEWARDSHIP_ROLES = [
  "Antimicrobial Stewardship Program Director",
  "Antimicrobial Stewardship Pharmacist",
  "Infectious Diseases Physician",
  "Microbiology Lab Director",
  "Infection Preventionist",
  "Quality Improvement Coordinator",
  "Clinical Pharmacist",
  "Resident/Fellow",
  "Student/Trainee",
  "Administrator",
  "Other"
]

// Work locations
const WORK_LOCATIONS = [
  "Hospital",
  "Clinic",
  "Long-term Care Facility",
  "Outpatient Center",
  "Research Institution",
  "Government Agency",
  "Pharmaceutical Company",
  "Consulting Firm",
  "Other"
]

// Experience levels
const EXPERIENCE_LEVELS = [
  "0-1 years",
  "2-5 years",
  "6-10 years",
  "11-15 years",
  "16-20 years",
  "20+ years"
]

interface UserProfileFormProps {
  onSubmit: (data: UserProfileFormData) => Promise<{ success: boolean; error?: string }>
  initialData?: Partial<UserProfileFormData>
  isEditing?: boolean
}

export default function UserProfileForm({ onSubmit, initialData, isEditing = false }: UserProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const totalSteps = 3

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      phoneNumber: initialData?.phoneNumber || "",
      professionalTitle: initialData?.professionalTitle || "",
      institution: initialData?.institution || "",
      department: initialData?.department || "",
      specialty: initialData?.specialty || "",
      yearsOfExperience: initialData?.yearsOfExperience || "",
      licenseNumber: initialData?.licenseNumber || "",
      workLocation: initialData?.workLocation || "",
      stewardshipRole: initialData?.stewardshipRole || "",
      certificationStatus: initialData?.certificationStatus || "",
      timeZone: initialData?.timeZone || "",
      manager: initialData?.manager || "",
      team: initialData?.team || "",
      notes: initialData?.notes || ""
    }
  })

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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">1</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
      </div>
      
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
          <label className="text-sm font-medium">Phone Number</label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your phone number"
                className="border-2 border-slate-300"
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Professional Title *</label>
          <Controller
            name="professionalTitle"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select your title" />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSIONAL_TITLES.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.professionalTitle && (
            <p className="text-sm text-red-600">{errors.professionalTitle.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Years of Experience *</label>
          <Controller
            name="yearsOfExperience"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-2 border-slate-300">
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
          {errors.yearsOfExperience && (
            <p className="text-sm text-red-600">{errors.yearsOfExperience.message}</p>
          )}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">2</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Professional Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Institution *</label>
          <Controller
            name="institution"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your institution"
                className="border-2 border-slate-300"
              />
            )}
          />
          {errors.institution && (
            <p className="text-sm text-red-600">{errors.institution.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Department *</label>
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your department"
                className="border-2 border-slate-300"
              />
            )}
          />
          {errors.department && (
            <p className="text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Specialty *</label>
          <Controller
            name="specialty"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-2 border-slate-300">
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALTIES.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.specialty && (
            <p className="text-sm text-red-600">{errors.specialty.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">License Number</label>
          <Controller
            name="licenseNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your license number"
                className="border-2 border-slate-300"
              />
            )}
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">3</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">SPARC-Specific Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Work Location *</label>
          <Controller
            name="workLocation"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-2 border-slate-300">
                  <SelectValue placeholder="Select work location" />
                </SelectTrigger>
                <SelectContent>
                  {WORK_LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.workLocation && (
            <p className="text-sm text-red-600">{errors.workLocation.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stewardship Role *</label>
          <Controller
            name="stewardshipRole"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-2 border-slate-300">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {STEWARDSHIP_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.stewardshipRole && (
            <p className="text-sm text-red-600">{errors.stewardshipRole.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Manager/Supervisor</label>
          <Controller
            name="manager"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter manager's name"
                className="border-2 border-slate-300"
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Team/Group</label>
          <Controller
            name="team"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter team name"
                className="border-2 border-slate-300"
              />
            )}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Additional Notes</label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Any additional information..."
                className="border-2 border-slate-300"
                rows={3}
              />
            )}
          />
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

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium text-blue-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Step content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            ) : (
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
            )}
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
