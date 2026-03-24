'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { ADMIN_EXPORT_TABLES } from '@/lib/admin/export-tables'

export default function AdminDataExport() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error'; text: string } | null>(null)

  async function downloadExcel() {
    setMessage(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/export', { credentials: 'include' })
      const cd = res.headers.get('Content-Disposition')
      const fallback = `spark-full-export-${new Date().toISOString().slice(0, 10)}.xlsx`
      const match = cd?.match(/filename="([^"]+)"/)
      const filename = match?.[1] ?? fallback

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        const text = typeof errBody?.error === 'string' ? errBody.error : res.statusText
        setMessage({ type: 'error', text })
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      setMessage({
        type: 'error',
        text: e instanceof Error ? e.message : 'Download failed',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-teal-600 dark:text-teal-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
          <div>
            <CardTitle className="text-lg">Export all data</CardTitle>
            <CardDescription className="mt-1">
              Download every application table in one Excel workbook (same scope as server backup scripts).
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Tables included:{' '}
          <span className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all">
            {ADMIN_EXPORT_TABLES.join(', ')}
          </span>
        </p>
        <Button
          variant="outline"
          className="w-full sm:w-auto h-11 min-w-[200px]"
          disabled={loading}
          onClick={downloadExcel}
        >
          {loading ? 'Preparing…' : 'Download Excel (.xlsx)'}
        </Button>
        {message?.type === 'error' && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {message.text}
          </p>
        )}
        <p className="text-xs text-slate-500 dark:text-slate-500">
          Requires <code className="rounded bg-slate-100 dark:bg-slate-800 px-1">SUPABASE_SERVICE_ROLE_KEY</code>{' '}
          on the server. If export fails with a configuration message, add that env var (Vercel/hosting
          dashboard) and redeploy.
        </p>
      </CardContent>
    </Card>
  )
}
