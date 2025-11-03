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
    'Patient Care - Prospective Audit & Feedback', 
    'Patient Care - Authorization of Restricted Antimicrobials', 
    'Patient Care - Participating in Clinical Rounds',
    // Administrative
    'Administrative - Guidelines/EHR',
    // Tracking
    'Tracking - AMU',
    'Tracking - AMR', 
    'Tracking - Antibiotic Appropriateness',
    'Tracking - Intervention Acceptance',
    // Reporting
    'Reporting - sharing data with prescribers/decision makers',
    // Education
    'Education - Providing Education',
    'Education - Receiving Education (e.g. CE)',
    // Administrative
    'Administrative - Committee Work',
    'Administrative - QI projects/research',
    'Administrative - Emails',
    // Other
    'Other - specify in comments'
  ] as const, {
    required_error: "Please select a task type",
    invalid_type_error: "Please select a valid task type"
  }),
  otherTask: z.string().optional(),
  minutes: z.number()
    .min(1, "Minutes must be at least 1")
    .max(480, "Minutes cannot exceed 480 (8 hours)")
    .int("Please enter a whole number"),
  occurredOn: z.string().min(1, "Date and time are required"),
  comment: z.string().optional(),
}).refine((data) => {
  if (data.task === 'Other - specify in comments' && (!data.otherTask || data.otherTask.trim() === "")) {
    return false
  }
  return true
}, {
  message: "Please specify the task name",
  path: ["otherTask"]
})

type QuickLogFormData = z.infer<typeof quickLogSchema>

// Task options
const TASK_OPTIONS = [
  // Patient Care
  { value: "Patient Care - Prospective Audit & Feedback", label: "Patient Care - Prospective Audit & Feedback" },
  { value: "Patient Care - Authorization of Restricted Antimicrobials", label: "Patient Care - Authorization of Restricted Antimicrobials" },
  { value: "Patient Care - Participating in Clinical Rounds", label: "Patient Care - Participating in Clinical Rounds" },
  // Administrative
  { value: "Administrative - Guidelines/EHR", label: "Administrative - Guidelines/EHR" },
  // Tracking
  { value: "Tracking - AMU", label: "Tracking - AMU" },
  { value: "Tracking - AMR", label: "Tracking - AMR" },
  { value: "Tracking - Antibiotic Appropriateness", label: "Tracking - Antibiotic Appropriateness" },
  { value: "Tracking - Intervention Acceptance", label: "Tracking - Intervention Acceptance" },
  // Reporting
  { value: "Reporting - sharing data with prescribers/decision makers", label: "Reporting - sharing data with prescribers/decision makers" },
  // Education
  { value: "Education - Providing Education", label: "Education - Providing Education" },
  { value: "Education - Receiving Education (e.g. CE)", label: "Education - Receiving Education (e.g. CE)" },
  // Administrative
  { value: "Administrative - Committee Work", label: "Administrative - Committee Work" },
  { value: "Administrative - QI projects/research", label: "Administrative - QI projects/research" },
  { value: "Administrative - Emails", label: "Administrative - Emails" },
  // Other
  { value: "Other - specify in comments", label: "Other - specify in comments" },
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
  
  // Get current datetime in local timezone for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
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
      task: "Patient Care - Prospective Audit & Feedback" as Activity, // Set a default valid task instead of empty string
      otherTask: "",
      minutes: 30,
      occurredOn: getCurrentDateTime(),
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

  const handleMinutesPresetClick = (minutes: number) => {
    setValue("minutes", minutes)
  }

  const handleFormSubmit = async (data: QuickLogFormData) => {
    // Additional safeguard to ensure task is not empty
    if (!data.task || data.task.trim() === '') {
      console.error('Task is required but was empty')
      return
    }

    // Convert datetime-local format to ISO datetime string
    const formattedData = {
      ...data,
      occurredOn: new Date(data.occurredOn).toISOString()
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formattedData)
      
      // Track telemetry
      telemetry.trackEntryCreated(data.task, data.minutes)
      
      setShowSuccess(true)
      // Clear form but keep task for convenience
      reset({
        task: data.task,
        otherTask: "",
        minutes: 30,
        occurredOn: getCurrentDateTime(),
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
            {selectedTask === "Other - specify in comments" && (
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

            {/* Date and Time */}
            <div className="space-y-2">
              <label htmlFor="datetime" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Date & Time *
              </label>
              <Controller
                name="occurredOn"
                control={control}
                render={({ field }) => (
                  <Input
                    id="datetime"
                    type="datetime-local"
                    className={`min-h-11 border-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 rounded-lg ${
                      errors.occurredOn ? 'border-red-300' : 'border-slate-300 dark:border-slate-600'
                    } focus-ring`}
                    aria-describedby={errors.occurredOn ? "datetime-error" : undefined}
                    aria-invalid={!!errors.occurredOn}
                    {...field}
                  />
                )}
              />
              {errors.occurredOn && (
                <p id="datetime-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.occurredOn.message}
                </p>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select the date and time when this activity occurred
              </p>
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
