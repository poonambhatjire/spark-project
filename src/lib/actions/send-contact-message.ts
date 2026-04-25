"use server"

import { Resend } from "resend"
import { z } from "zod"
import { PRIMARY_CONTACT_EMAIL } from "@/lib/contact-emails"
import { getContactTopicLabel } from "@/lib/contact-topics"

const contactPayloadSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().trim().email().max(320),
  topic: z.string().min(1).max(80),
  message: z.string().min(20).max(10000),
})

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export type SendContactMessageResult = { success: true } | { success: false; error: string }

type ContactFormInput = z.infer<typeof contactPayloadSchema> & { _company?: string }

export async function sendContactMessage(input: ContactFormInput): Promise<SendContactMessageResult> {
  if (String(input._company ?? "").trim() !== "") {
    return { success: true }
  }

  const parsed = contactPayloadSchema.safeParse({
    name: input.name,
    email: input.email,
    topic: input.topic,
    message: input.message,
  })
  if (!parsed.success) {
    return { success: false, error: "Please check the form and try again." }
  }

  const data = parsed.data
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("sendContactMessage: RESEND_API_KEY is not set")
    return { success: false, error: "Email is not configured. Add RESEND_API_KEY to .env.local." }
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "SPARC Contact <onboarding@resend.dev>"

  const to = (process.env.CONTACT_TO_EMAIL ?? PRIMARY_CONTACT_EMAIL).trim()
  const topicLabel = getContactTopicLabel(data.topic)
  const subject = `[SPARC Contact] ${topicLabel}`

  const textBody = `New message from the SPARC contact form\n\nName: ${data.name}\nEmail: ${data.email}\nTopic: ${topicLabel}\n\n---\n\n${data.message}`

  const htmlBody = `
  <h2 style="font-family:system-ui,sans-serif;">SPARC — Contact form</h2>
  <table style="font-family:system-ui,sans-serif;font-size:14px;color:#334155;border-collapse:collapse;">
    <tr><td style="padding:4px 12px 4px 0;vertical-align:top;"><strong>Name</strong></td><td style="padding:4px 0;">${escapeHtml(data.name)}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;vertical-align:top;"><strong>Email</strong></td><td style="padding:4px 0;">${escapeHtml(data.email)}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;vertical-align:top;"><strong>Topic</strong></td><td style="padding:4px 0;">${escapeHtml(topicLabel)}</td></tr>
  </table>
  <p style="font-family:system-ui,sans-serif;font-size:14px;color:#334155;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
  `

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: data.email,
    subject,
    text: textBody,
    html: htmlBody,
  })

  if (error) {
    console.error("Resend error:", error)
    const status =
      error && typeof error === "object" && "statusCode" in error
        ? (error as { statusCode: number }).statusCode
        : undefined
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : ""
    if (
      status === 403 ||
      /only send testing emails to your own email/i.test(message) ||
      /verify a domain/i.test(message)
    ) {
      return {
        success: false,
        error:
          "Resend test mode only delivers to the email on your Resend account. In .env.local set CONTACT_TO_EMAIL to that address for local tests, or verify a custom domain at resend.com/domains and set RESEND_FROM_EMAIL to use it in production so you can send to any inbox (e.g. sparc.calculator@gmail.com).",
      }
    }
    return { success: false, error: "We couldn’t send your message. Please try again in a few minutes." }
  }

  return { success: true }
}
