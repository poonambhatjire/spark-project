"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Textarea } from "@/app/components/ui/textarea"
import { Checkbox } from "@/app/components/ui/checkbox"

import { PROFESSIONAL_TITLES, EXPERIENCE_LEVELS, INSTITUTIONS } from "@/lib/constants/profile"
import {
  getAdditionalSurvey,
  saveAdditionalSurvey,
  type AdditionalSurveyData,
} from "@/lib/actions/additional-survey"
import type { UserProfileData } from "@/lib/actions/user-profile"

const SAAR_OPTIONS = [
  { value: "much_lower", label: "Much lower than predicted (<0.7)" },
  { value: "slightly_lower", label: "Slightly lower than predicted (0.7 to <1)" },
  { value: "about_predicted", label: "About as predicted (around 1.0)" },
  { value: "slightly_higher", label: "Slightly higher than predicted (>1 to 1.3)" },
  { value: "much_higher", label: "Much higher than predicted (>1.3)" },
  { value: "dont_know", label: "Don't know" },
  { value: "not_available", label: "SAAR not available" },
]

const EFFECTIVENESS_OPTIONS = [
  { value: "cost_savings", label: "Cost savings/cost avoidance" },
  { value: "decreased_utilization", label: "Decreased antibiotic utilization" },
  { value: "decreased_cdiff", label: "Decreased Clostridium difficile infection" },
  { value: "decreased_resistance", label: "Decreased rate of drug-resistant organisms" },
  { value: "none", label: "Our ASP has not demonstrated any of the above" },
  { value: "other", label: "Other (please specify)" },
]

// Validation schema for user profile + additional survey
const userProfileSchema = z.object({
  // Profile
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email address"),
  title: z.string().min(1, "Professional title is required"),
  titleOther: z.string().optional(),
  experienceLevel: z.string().min(1, "Experience level is required"),
  institution: z.string().min(1, "Institution is required"),
  institutionOther: z.string().optional(),
  // Additional survey (all optional)
  licensedBeds: z.number().optional().nullable(),
  occupiedBedsCount: z.number().optional().nullable(),
  occupiedBedsPercent: z.number().optional().nullable(),
  icuBeds: z.number().optional().nullable(),
  aspFte: z.number().optional().nullable(),
  pharmacistFte: z.number().optional().nullable(),
  physicianFte: z.number().optional().nullable(),
  other1Specify: z.string().optional().nullable(),
  other1Fte: z.number().optional().nullable(),
  other2Specify: z.string().optional().nullable(),
  other2Fte: z.number().optional().nullable(),
  other3Specify: z.string().optional().nullable(),
  other3Fte: z.number().optional().nullable(),
  saarValue: z.number().optional().nullable(),
  saarCategory: z.string().optional().nullable(),
  effectivenessOptions: z.array(z.string()).optional(),
  effectivenessOther: z.string().optional().nullable(),
}).refine((data) => {
  if (data.title === 'Other, please specify') {
    return data.titleOther && data.titleOther.length >= 2
  }
  return true
}, {
  message: "Please specify your title",
  path: ["titleOther"]
}).refine((data) => {
  if (data.institution === "Other") {
    return data.institutionOther && data.institutionOther.trim().length >= 2
  }
  return true
}, {
  message: "Please specify your institution",
  path: ["institutionOther"]
})

type UserProfileFormData = z.infer<typeof userProfileSchema>

interface UserProfileFormProps {
  onSubmit: (data: UserProfileData) => Promise<{ success: boolean; error?: string }>
  initialData?: Partial<UserProfileFormData>
  isEditing?: boolean
}

export default function UserProfileForm({ onSubmit, initialData, isEditing = false }: UserProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [surveyLoaded, setSurveyLoaded] = useState(false)
  const [occupiedMode, setOccupiedMode] = useState<"exact" | "percent">("exact")

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      title: initialData?.title || "",
      titleOther: initialData?.titleOther || "",
      experienceLevel: initialData?.experienceLevel || "",
      institution: initialData?.institution || "",
      institutionOther: initialData?.institutionOther || "",
      licensedBeds: null,
      occupiedBedsCount: null,
      occupiedBedsPercent: null,
      icuBeds: null,
      aspFte: null,
      pharmacistFte: null,
      physicianFte: null,
      other1Specify: null,
      other1Fte: null,
      other2Specify: null,
      other2Fte: null,
      other3Specify: null,
      other3Fte: null,
      saarValue: null,
      saarCategory: null,
      effectivenessOptions: [],
      effectivenessOther: null,
    }
  })

  useEffect(() => {
    if (initialData) {
      reset((prev) => ({
        ...prev,
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        title: initialData.title || "",
        titleOther: initialData.titleOther || "",
        experienceLevel: initialData.experienceLevel || "",
        institution: initialData.institution || "",
        institutionOther: initialData.institutionOther || "",
      }))
    }
  }, [initialData, reset])

  useEffect(() => {
    let mounted = true
    getAdditionalSurvey().then((result) => {
      if (!mounted) return
      if (result.success && result.data) {
        const d = result.data
        setOccupiedMode(d.occupiedBedsPercent != null ? "percent" : "exact")
        setDecimalRawInput({})
        reset((prev) => ({
          ...prev,
          licensedBeds: d.licensedBeds ?? null,
          occupiedBedsCount: d.occupiedBedsCount ?? null,
          occupiedBedsPercent: d.occupiedBedsPercent ?? null,
          icuBeds: d.icuBeds ?? null,
          aspFte: d.aspFte ?? null,
          pharmacistFte: d.pharmacistFte ?? null,
          physicianFte: d.physicianFte ?? null,
          other1Specify: d.other1Specify ?? null,
          other1Fte: d.other1Fte ?? null,
          other2Specify: d.other2Specify ?? null,
          other2Fte: d.other2Fte ?? null,
          other3Specify: d.other3Specify ?? null,
          other3Fte: d.other3Fte ?? null,
          saarValue: d.saarValue ?? null,
          saarCategory: d.saarCategory ?? null,
          effectivenessOptions: d.effectivenessOptions ?? [],
          effectivenessOther: d.effectivenessOther ?? null,
        }))
      }
      setSurveyLoaded(true)
    })
    return () => { mounted = false }
  }, [reset])

  // Watch fields to show/hide conditional inputs
  const watchedTitle = watch("title")
  const watchedInstitution = watch("institution")
  const watchedEffectiveness = watch("effectivenessOptions") ?? []

  const handleIntegerInput = (value: string) => {
    const filtered = value.replace(/[^0-9]/g, "")
    return filtered === "" ? null : parseInt(filtered, 10)
  }

  const [decimalRawInput, setDecimalRawInput] = useState<Record<string, string>>({})

  const handleDecimalInput = (
    value: string,
    fieldName: string,
    onChange: (v: number | null) => void
  ) => {
    const filtered = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")
    setDecimalRawInput((prev) => ({ ...prev, [fieldName]: filtered }))
    if (filtered === "" || filtered === ".") {
      onChange(null)
      return
    }
    if (filtered.endsWith(".")) {
      return
    }
    const num = parseFloat(filtered)
    onChange(isNaN(num) ? null : num)
  }

  const getDecimalDisplayValue = (fieldName: string, fieldValue: number | null | undefined): string => {
    const raw = decimalRawInput[fieldName]
    if (raw !== undefined && raw !== "") return raw
    return fieldValue != null ? String(fieldValue) : ""
  }

  const handleFormSubmit = async (data: UserProfileFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    const profileData = {
      fullName: data.fullName,
      email: data.email,
      title: data.title,
      titleOther: data.titleOther,
      experienceLevel: data.experienceLevel,
      institution: data.institution,
      institutionOther: data.institutionOther,
    }
    const surveyData: AdditionalSurveyData = {
      licensedBeds: data.licensedBeds ?? null,
      occupiedBedsCount: occupiedMode === "exact" ? data.occupiedBedsCount ?? null : null,
      occupiedBedsPercent: occupiedMode === "percent" ? data.occupiedBedsPercent ?? null : null,
      icuBeds: data.icuBeds ?? null,
      aspFte: data.aspFte ?? null,
      pharmacistFte: data.pharmacistFte ?? null,
      physicianFte: data.physicianFte ?? null,
      other1Specify: data.other1Specify ?? null,
      other1Fte: data.other1Fte ?? null,
      other2Specify: data.other2Specify ?? null,
      other2Fte: data.other2Fte ?? null,
      other3Specify: data.other3Specify ?? null,
      other3Fte: data.other3Fte ?? null,
      saarValue: data.saarValue ?? null,
      saarCategory: data.saarCategory ?? null,
      effectivenessOptions: data.effectivenessOptions ?? [],
      effectivenessOther: data.effectivenessOther ?? null,
    }

    try {
      const [profileResult, surveyResult] = await Promise.all([
        onSubmit(profileData),
        saveAdditionalSurvey(surveyData),
      ])

      if (profileResult?.success && surveyResult?.success) {
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 3000)
      } else {
        setSubmitError(profileResult?.error || surveyResult?.error || "Failed to save")
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred")
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
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select your institution" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {INSTITUTIONS.map((institution) => (
                    <SelectItem key={institution} value={institution}>
                      {institution}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.institution && (
            <p className="text-sm text-red-600">{errors.institution.message}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Institution comments {watchedInstitution === "Other" ? "*" : "(optional)"}
          </label>
          <p className="text-xs text-slate-500">
            If &quot;Other&quot; is selected, or if only your umbrella health system is listed and not your specific hospital,
            please specify the name of your individual hospital here:
          </p>
          <Controller
            name="institutionOther"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Enter your hospital or institution details"
                className="min-h-[90px] border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          />
          {errors.institutionOther && (
            <p className="text-sm text-red-600">{errors.institutionOther.message}</p>
          )}
        </div>
      </div>

      {/* Additional survey questions - same styling as profile */}
      {surveyLoaded && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              How many licensed beds does your hospital have?
            </label>
            <div className="flex items-center gap-2">
              <Controller
                name="licensedBeds"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(handleIntegerInput(e.target.value))}
                    className="w-28"
                  />
                )}
              />
              <span className="text-slate-500 text-sm">beds</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              On a typical day in your hospital, how many beds are occupied?
            </label>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-2">If you know the exact number:</p>
                <div className="flex items-center gap-2">
                  <Controller
                    name="occupiedBedsCount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={occupiedMode === "exact" ? (field.value ?? "") : ""}
                        onChange={(e) => {
                          setOccupiedMode("exact")
                          field.onChange(handleIntegerInput(e.target.value))
                          setValue("occupiedBedsPercent", null)
                        }}
                        className="w-28"
                      />
                    )}
                  />
                  <span className="text-slate-500 text-sm">beds</span>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                <p className="text-xs text-slate-500 mb-2">Or, if you don&apos;t know the exact number, enter your best estimate:</p>
                <div className="flex items-center gap-2">
                  <Controller
                    name="occupiedBedsPercent"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={occupiedMode === "percent" ? getDecimalDisplayValue("occupiedBedsPercent", field.value ?? null) : ""}
                        onChange={(e) => {
                          setOccupiedMode("percent")
                          handleDecimalInput(e.target.value, "occupiedBedsPercent", field.onChange)
                          setValue("occupiedBedsCount", null)
                        }}
                        onBlur={() => setDecimalRawInput((prev) => ({ ...prev, occupiedBedsPercent: "" }))}
                        className="w-28"
                      />
                    )}
                  />
                  <span className="text-slate-500 text-sm">% of licensed beds</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              How many ICU beds does your hospital have?
            </label>
            <div className="flex items-center gap-2">
              <Controller
                name="icuBeds"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(handleIntegerInput(e.target.value))}
                    className="w-28"
                  />
                )}
              />
              <span className="text-slate-500 text-sm">beds</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              What is your current FTE (full‑time equivalent) dedicated to antimicrobial stewardship? (Enter a number between 0 and 1)
            </label>
            <div className="flex items-center gap-2">
              <Controller
                name="aspFte"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 0.5"
                    value={getDecimalDisplayValue("aspFte", field.value)}
                    onChange={(e) => handleDecimalInput(e.target.value, "aspFte", field.onChange)}
                    onBlur={() => setDecimalRawInput((prev) => ({ ...prev, aspFte: "" }))}
                    className="w-28"
                  />
                )}
              />
              <span className="text-slate-500 text-sm">FTE</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              What are the TOTAL current FTEs for each position dedicated to antimicrobial stewardship in your hospital (including yourself)?
            </label>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600">
                    <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                    <th className="text-left py-2 pr-2 text-xs font-medium text-slate-500 uppercase tracking-wider w-24">FTE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr>
                    <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">Pharmacist</td>
                    <td className="py-2">
                      <Controller
                        name="pharmacistFte"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="0"
                            value={getDecimalDisplayValue("pharmacistFte", field.value)}
                            onChange={(e) => handleDecimalInput(e.target.value, "pharmacistFte", field.onChange)}
                            onBlur={() => setDecimalRawInput((prev) => ({ ...prev, pharmacistFte: "" }))}
                            className="w-full"
                          />
                        )}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">Physician</td>
                    <td className="py-2">
                      <Controller
                        name="physicianFte"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="0"
                            value={getDecimalDisplayValue("physicianFte", field.value)}
                            onChange={(e) => handleDecimalInput(e.target.value, "physicianFte", field.onChange)}
                            onBlur={() => setDecimalRawInput((prev) => ({ ...prev, physicianFte: "" }))}
                            className="w-full"
                          />
                        )}
                      />
                    </td>
                  </tr>
                  {[1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td className="py-2 pr-4">
                        <Controller
                          name={i === 1 ? "other1Specify" : i === 2 ? "other2Specify" : "other3Specify"}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              placeholder="Other (specify)"
                              className="w-full placeholder:text-slate-400"
                            />
                          )}
                        />
                      </td>
                      <td className="py-2">
                        <Controller
                          name={i === 1 ? "other1Fte" : i === 2 ? "other2Fte" : "other3Fte"}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              inputMode="decimal"
                              placeholder="0"
                              value={getDecimalDisplayValue(`other${i}Fte`, field.value)}
                              onChange={(e) => handleDecimalInput(e.target.value, `other${i}Fte`, field.onChange)}
                              onBlur={() => setDecimalRawInput((prev) => ({ ...prev, [`other${i}Fte`]: "" }))}
                              className="w-full"
                            />
                          )}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Considering your hospital&apos;s overall inpatient antibacterial use (all antibacterial agents)
            </label>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-2">If you have your most recent SAAR value:</p>
                <Controller
                  name="saarValue"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="Enter SAAR value"
                      value={getDecimalDisplayValue("saarValue", field.value)}
                      onChange={(e) => {
                        handleDecimalInput(e.target.value, "saarValue", field.onChange)
                        if (e.target.value) setValue("saarCategory", null)
                      }}
                      onBlur={() => setDecimalRawInput((prev) => ({ ...prev, saarValue: "" }))}
                      className="w-40"
                    />
                  )}
                />
              </div>
              <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                <p className="text-xs text-slate-500 mb-2">
                  If you do not know the exact SAAR number then select from the dropdown:
                </p>
                <Controller
                  name="saarCategory"
                  control={control}
                  render={({ field }) => {
                    const selectedOption = SAAR_OPTIONS.find((opt) => opt.value === (field.value ?? ""))
                    return (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(v) => {
                          field.onChange(v || null)
                          if (v) setValue("saarValue", null)
                        }}
                      >
                        <SelectTrigger className="w-full max-w-md">
                          <span className={field.value ? "text-slate-900 dark:text-slate-100" : "text-slate-400"}>
                            {selectedOption ? selectedOption.label : "Select option"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {SAAR_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              In the past two years, has your program demonstrated effectiveness in any of the following areas? (Select all that apply)
            </label>
            <div className="space-y-2">
              {EFFECTIVENESS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer"
                >
                  <Controller
                    name="effectivenessOptions"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`eff-${opt.value}`}
                        checked={watchedEffectiveness.includes(opt.value)}
                        onCheckedChange={(checked) => {
                          const next = checked
                            ? [...watchedEffectiveness, opt.value]
                            : watchedEffectiveness.filter((v) => v !== opt.value)
                          field.onChange(next)
                        }}
                      />
                    )}
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{opt.label}</span>
                </label>
              ))}
              {watchedEffectiveness.includes("other") && (
                <div className="mt-3 ml-1">
                  <Controller
                    name="effectivenessOther"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Please specify..."
                        className="w-full max-w-md"
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
              <p className="text-slate-500 text-sm mt-1">* indicates required field</p>
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

