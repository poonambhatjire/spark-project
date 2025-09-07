"use client"

import { useState, useRef, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Textarea } from "@/app/components/ui/textarea"

import { Activity, CreateEntryInput } from "@/app/dashboard/data/client"
import { telemetry } from "@/lib/telemetry"

// Validation schema
const quickLogSchema = z.object({
  task: z.enum([
    // Patient Care
    'PAF', 
    'AUTH_RESTRICTED_ANTIMICROBIALS', 
    'CLINICAL_ROUNDS',
    // Administrative
    'GUIDELINES_EHR',
    // Tracking
    'AMU',
    'AMR', 
    'ANTIBIOTIC_APPROPRIATENESS',
    'INTERVENTION_ACCEPTANCE',
    // Reporting
    'SHARING_DATA',
    // Education
    'PROVIDING_EDUCATION',
    'RECEIVING_EDUCATION',
    // Administrative
    'COMMITTEE_WORK',
    'QI_PROJECTS_RESEARCH',
    'EMAILS',
    // Other
    'OTHER'
  ] as const),
  otherTask: z.string().optional(),
  minutes: z.number()
    .min(1, "Minutes must be at least 1")
    .max(480, "Minutes cannot exceed 480 (8 hours)")
    .int("Please enter a whole number"),
  occurredOn: z.string().min(1, "Date is required"),
  comment: z.string().optional(),
}).refine((data) => {
  if (data.task === 'OTHER' && (!data.otherTask || data.otherTask.trim() === "")) {
    return false
  }
  return true
}, {
  message: "Please specify the task name",
  path: ["otherTask"]
})

type QuickLogFormData = z.infer<typeof quickLogSchema>

// Preset templates
const PRESET_TEMPLATES = [
  { label: "PAF 15m", task: "PAF" as Activity, minutes: 15 },
  { label: "PAF 30m", task: "PAF" as Activity, minutes: 30 },
  { label: "Auth Restricted 15m", task: "AUTH_RESTRICTED_ANTIMICROBIALS" as Activity, minutes: 15 },
  { label: "Clinical Rounds 30m", task: "CLINICAL_ROUNDS" as Activity, minutes: 30 },
  { label: "Providing Education 60m", task: "PROVIDING_EDUCATION" as Activity, minutes: 60 },
]

// Task options
const TASK_OPTIONS = [
  // Patient Care
  { value: "PAF", label: "Patient Care - Prospective Audit & Feedback" },
  { value: "AUTH_RESTRICTED_ANTIMICROBIALS", label: "Patient Care - Authorization of Restricted Antimicrobials" },
  { value: "CLINICAL_ROUNDS", label: "Patient Care - Participating in Clinical Rounds" },
  // Administrative
  { value: "GUIDELINES_EHR", label: "Administrative - Guidelines/EHR" },
  // Tracking
  { value: "AMU", label: "Tracking - AMU" },
  { value: "AMR", label: "Tracking - AMR" },
  { value: "ANTIBIOTIC_APPROPRIATENESS", label: "Tracking - Antibiotic Appropriateness" },
  { value: "INTERVENTION_ACCEPTANCE", label: "Tracking - Intervention Acceptance" },
  // Reporting
  { value: "SHARING_DATA", label: "Reporting - sharing data with prescribers/decision makers" },
  // Education
  { value: "PROVIDING_EDUCATION", label: "Education - Providing Education" },
  { value: "RECEIVING_EDUCATION", label: "Education - Receiving Education (e.g. CE)" },
  // Administrative
  { value: "COMMITTEE_WORK", label: "Administrative - Committee Work" },
  { value: "QI_PROJECTS_RESEARCH", label: "Administrative - QI projects/research" },
  { value: "EMAILS", label: "Administrative - Emails" },
  // Other
  { value: "OTHER", label: "Other - specify in comments" },
]

// Minutes presets
const MINUTES_PRESETS = [15, 30, 60]

interface QuickLogProps {
  onSubmit: (data: CreateEntryInput) => Promise<void>
}

export function QuickLog({ onSubmit }: QuickLogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const taskSelectRef = useRef<HTMLButtonElement>(null)
  
  // Get current date in local timezone
  const getCurrentDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<QuickLogFormData>({
    resolver: zodResolver(quickLogSchema),
    defaultValues: {
      task: "" as Activity,
      otherTask: "",
      minutes: 30,
      occurredOn: getCurrentDate(),
      comment: ""
    }
  })

  const selectedTask = watch("task")

  // Focus management after form reset
  useEffect(() => {
    if (showSuccess) {
      // Focus the task select after successful submission
      setTimeout(() => {
        taskSelectRef.current?.focus()
      }, 100)
    }
  }, [showSuccess])

  const handlePresetClick = (template: typeof PRESET_TEMPLATES[0]) => {
    setValue("task", template.task)
    setValue("minutes", template.minutes)
    // Focus the submit button after preset selection
    setTimeout(() => {
      const submitButton = formRef.current?.querySelector('button[type="submit"]') as HTMLButtonElement
      submitButton?.focus()
    }, 100)
  }

  const handleMinutesPresetClick = (minutes: number) => {
    setValue("minutes", minutes)
  }

  const handleFormSubmit = async (data: QuickLogFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      
      // Track telemetry
      telemetry.trackEntryCreated(data.task, data.minutes)
      
      setShowSuccess(true)
      // Clear form but keep task for convenience
      reset({
        task: data.task,
        otherTask: "",
        minutes: 30,
        occurredOn: getCurrentDate(),
        comment: ""
      })
      // Hide success message after 1.5s
      setTimeout(() => setShowSuccess(false), 1500)
    } catch (error) {
      console.error("Failed to submit entry:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle keyboard navigation for presets
  const handlePresetKeyDown = (e: React.KeyboardEvent, template: typeof PRESET_TEMPLATES[0]) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handlePresetClick(template)
    }
  }

  const handleMinutesPresetKeyDown = (e: React.KeyboardEvent, minutes: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleMinutesPresetClick(minutes)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 h-fit">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="page-title font-semibold text-slate-900 dark:text-slate-100">Quick Log</h2>
        </div>

        {/* Preset Templates */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
            Quick Templates
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Quick template options">
            {PRESET_TEMPLATES.map((template) => (
              <Button
                key={template.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick(template)}
                onKeyDown={(e) => handlePresetKeyDown(e, template)}
                className="text-xs px-3 py-2 h-auto min-h-11 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus-ring"
                aria-pressed={watch("task") === template.task && watch("minutes") === template.minutes}
                aria-label={`Select ${template.label} template`}
              >
                {template.label}
              </Button>
            ))}
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Task Selection */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="task-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Task Type *
              </label>
              <Controller
                name="task"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger 
                      ref={taskSelectRef}
                      id="task-select" 
                      className={`min-h-11 border-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 rounded-lg ${
                        errors.task ? 'border-red-300' : 'border-slate-300 dark:border-slate-600'
                      } focus-ring`}
                      aria-describedby={errors.task ? "task-error" : undefined}
                      aria-invalid={!!errors.task}
                    >
                      <SelectValue placeholder="Select Task" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {TASK_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.task && (
                <p id="task-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.task.message}
                </p>
              )}
            </div>

            {/* Other Task Input (conditional) */}
            {selectedTask === "OTHER" && (
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="other-task" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Task Name *
                </label>
                <Controller
                  name="otherTask"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="other-task"
                      placeholder="Specify the task name"
                      className={`min-h-11 border-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 rounded-lg ${
                        errors.otherTask ? 'border-red-300' : 'border-slate-300 dark:border-slate-600'
                      } focus-ring`}
                      aria-describedby={errors.otherTask ? "other-task-error" : undefined}
                      aria-invalid={!!errors.otherTask}
                      {...field}
                    />
                  )}
                />
                {errors.otherTask && (
                  <p id="other-task-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.otherTask.message}
                  </p>
                )}
              </div>
            )}

            {/* Minutes Selection */}
            <div className="space-y-2">
              <label htmlFor="minutes" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Minutes *
              </label>
              <div className="space-y-2">
                {/* Minutes Presets */}
                <div className="flex flex-wrap gap-2" role="group" aria-label="Quick minutes options">
                  {MINUTES_PRESETS.map((minutes) => (
                    <Button
                      key={minutes}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleMinutesPresetClick(minutes)}
                      onKeyDown={(e) => handleMinutesPresetKeyDown(e, minutes)}
                      className="text-xs px-3 py-2 h-auto min-h-11 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus-ring"
                      aria-pressed={watch("minutes") === minutes}
                      aria-label={`Set ${minutes} minutes`}
                    >
                      {minutes}m
                    </Button>
                  ))}
                </div>
                {/* Minutes Input */}
                <Controller
                  name="minutes"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="minutes"
                      type="number"
                      placeholder="Enter minutes"
                      min={1}
                      max={480}
                      className={`min-h-11 border-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg ${
                        errors.minutes ? 'border-red-300' : 'border-slate-300 dark:border-slate-600'
                      } focus-ring`}
                      aria-describedby={errors.minutes ? "minutes-error" : undefined}
                      aria-invalid={!!errors.minutes}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                {errors.minutes && (
                  <p id="minutes-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.minutes.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Date *
              </label>
              <Controller
                name="occurredOn"
                control={control}
                render={({ field }) => (
                  <Input
                    id="date"
                    type="date"
                    className={`min-h-11 border-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 rounded-lg ${
                      errors.occurredOn ? 'border-red-300' : 'border-slate-300 dark:border-slate-600'
                    } focus-ring`}
                    aria-describedby={errors.occurredOn ? "date-error" : undefined}
                    aria-invalid={!!errors.occurredOn}
                    {...field}
                  />
                )}
              />
              {errors.occurredOn && (
                <p id="date-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.occurredOn.message}
                </p>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <label htmlFor="comments" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Comments (optional)
            </label>
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="comments"
                  placeholder="Add any additional details..."
                  className="min-h-[100px] border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus-ring"
                  aria-describedby="comments-help"
                  {...field}
                />
              )}
            />
            <p id="comments-help" className="text-xs text-slate-500 dark:text-slate-400">
              Optional comments to provide additional context about this activity.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto min-h-11 bg-red-900 hover:bg-red-800 text-white font-semibold text-lg rounded-lg focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
            aria-describedby={isSubmitting ? "submitting-status" : undefined}
          >
            {isSubmitting ? "Saving..." : showSuccess ? "Saved ✓" : "Log Entry"}
          </Button>
          {isSubmitting && (
            <p id="submitting-status" className="sr-only" role="status" aria-live="polite">
              Submitting entry, please wait...
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
