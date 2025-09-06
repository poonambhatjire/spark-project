interface KeywordPillProps {
  label: string
}

export function KeywordPill({ label }: KeywordPillProps) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200">
      {label}
    </span>
  )
}
