"use client"

import { useEffect, useRef, useState } from "react"
import { renderAsync } from "docx-preview"

export default function AppendicesPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadDocx() {
      if (!containerRef.current) return

      try {
        const res = await fetch("/Appendices%20List.docx")
        if (!res.ok) throw new Error("Failed to load document")
        const blob = await res.blob()

        // Clear container before rendering; inWrapper: false avoids gray box and shadow overlay
        containerRef.current.innerHTML = ""
        await renderAsync(blob, containerRef.current, undefined, { inWrapper: false })

        setStatus("ready")
      } catch (err) {
        setStatus("error")
        setErrorMessage(err instanceof Error ? err.message : "Failed to display document")
      }
    }

    loadDocx()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
        Antimicrobial Stewardship Program Activity Definitions
      </h1>

      {status === "loading" && (
        <p className="text-slate-600 dark:text-slate-400">Loading document…</p>
      )}

      {status === "error" && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p className="text-red-800 dark:text-red-200">{errorMessage}</p>
          <a
            href="/Appendices%20List.docx"
            download
            className="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Download document instead
          </a>
        </div>
      )}

      <div
        ref={containerRef}
        className={`docx-wrapper bg-white dark:bg-slate-800 rounded-lg ${status === "ready" ? "block" : "hidden"}`}
        style={{ minHeight: status === "ready" ? 400 : 0 }}
      />
    </div>
  )
}
