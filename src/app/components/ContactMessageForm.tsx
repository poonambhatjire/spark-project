"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { sendContactMessage } from "@/lib/actions/send-contact-message"
import { CONTACT_TOPICS } from "@/lib/contact-topics"
import { PRIMARY_CONTACT_EMAIL } from "@/lib/contact-emails"

const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email"),
  topic: z.string().min(1, "Choose a topic"),
  message: z
    .string()
    .min(20, "Please add a bit more detail (at least 20 characters)"),
  _company: z.string().optional(),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function ContactMessageForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "",
      message: "",
      _company: "",
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setFormError(null)
    setFormSuccess(false)
    setIsSubmitting(true)
    try {
      const result = await sendContactMessage(data)
      if (result.success) {
        setFormSuccess(true)
        reset({
          name: "",
          email: "",
          topic: "",
          message: "",
          _company: "",
        })
      } else {
        setFormError(result.error)
      }
    } catch {
      setFormError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 md:p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Send us a message
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Submit the form and we&apos;ll email your message directly to our team. We usually reply
          within a few business days.
        </p>
      </div>

      {formSuccess && (
        <div
          className="mb-5 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/40 px-4 py-3 text-sm text-green-800 dark:text-green-200"
          role="status"
        >
          Thank you — your message was sent. We&apos;ll get back to you soon.
        </div>
      )}

      {formError && (
        <div
          className="mb-5 rounded-lg border border-red-200 bg-red-50 dark:border-red-900/40 px-4 py-3 text-sm text-red-800 dark:text-red-200"
          role="alert"
        >
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="hidden" aria-hidden>
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("_company")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Your name <span className="text-[#D25555]">*</span>
            </label>
            <Input
              id="contact-name"
              autoComplete="name"
              placeholder="Jane Doe"
              className="border-slate-300 dark:border-slate-600 dark:bg-slate-900"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="contact-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Your email <span className="text-[#D25555]">*</span>
            </label>
            <Input
              id="contact-email"
              type="email"
              autoComplete="email"
              placeholder="you@hospital.org"
              className="border-slate-300 dark:border-slate-600 dark:bg-slate-900"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-topic" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Topic <span className="text-[#D25555]">*</span>
          </label>
          <Controller
            name="topic"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="contact-topic"
                  className="w-full border-slate-300 dark:border-slate-600 dark:bg-slate-900"
                >
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_TOPICS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.topic && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.topic.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-message" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Message <span className="text-[#D25555]">*</span>
          </label>
          <Textarea
            id="contact-message"
            rows={5}
            placeholder="How can we help?"
            className="min-h-[120px] resize-y border-slate-300 dark:border-slate-600 dark:bg-slate-900"
            {...register("message")}
          />
          {errors.message && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-[#D25555] hover:bg-[#B84444] text-white border-0 shadow-md focus-visible:ring-2 focus-visible:ring-[#D25555] focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Delivered to{" "}
            <span className="font-mono text-slate-600 dark:text-slate-400">{PRIMARY_CONTACT_EMAIL}</span>
          </p>
        </div>
      </form>
    </div>
  )
}
