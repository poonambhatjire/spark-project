"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/auth/supabase-actions"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setIsLoading(false)
    }
    
    checkAuth()
  }, [pathname]) // Re-check when pathname changes

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
            aria-label="Go to SPARC homepage"
          >
            <Image
              src="/sparc-logo.png"
              alt="SPARC Calculator"
              width={200}
              height={113}
              className="h-12 w-auto md:h-14"
              priority
            />
          </Link>
          
          <nav className="flex items-center gap-4 sm:gap-6" aria-label="Main navigation">
            {isLoading ? (
              <div className="text-sm text-slate-500">Loading...</div>
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <Link
                  href="/admin"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin
                </Link>
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
                >
                  Home
                </Link>
                <form action={handleSignOut}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/about"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
                >
                  Contact Us
                </Link>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
                >
                  Sign In
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}