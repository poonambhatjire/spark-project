import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
          <Link 
            href="/" 
            className="opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
            aria-label="Go to SPARC homepage"
          >
            <Image
              src="/sparc-logo.png"
              alt="SPARC — Stewardship Personnel Required for ASPs Resource Calculator"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </Link>
          
          <nav className="flex gap-4 sm:gap-6" aria-label="Footer navigation">
            <Link 
              href="#" 
              className="text-xs hover:underline underline-offset-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              className="text-xs hover:underline underline-offset-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
            >
              Terms of Service
            </Link>
            <Link 
              href="#" 
              className="text-xs hover:underline underline-offset-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-2 focus-visible:rounded"
            >
              Help Center
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}