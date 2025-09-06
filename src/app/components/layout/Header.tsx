"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()
  const isOnDashboard = pathname === "/dashboard"

  return (
    <header className="flex items-center justify-between px-4 py-2 md:px-6 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <Link 
        href="/" 
        className="flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
        aria-label="Go to SPARC homepage"
      >
        <Image
          src="/sparc-logo.png"
          alt="SPARC — Stewardship Personnel Required for ASPs Resource Calculator"
          width={180}
          height={60}
          className="h-10 w-auto md:h-12"
          priority
        />
      </Link>
      
      <nav className="flex items-center gap-4 sm:gap-6" aria-label="Main navigation">
        {isOnDashboard ? (
          <>
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
            >
              Home
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
            >
              Sign Out
            </Link>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  )
}