"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import Link from "next/link"
import { updatePassword } from "@/lib/auth/supabase-actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full h-12 bg-red-900 hover:bg-red-800 text-white font-semibold text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Updating..." : "Update Password"}
    </Button>
  )
}

const ResetPasswordPage = () => {
  const [state, formAction] = useActionState(updatePassword, null)
  const router = useRouter()
  const hasError = state?.ok === false
  const hasSuccess = state?.ok === true
  const errorId = hasError ? "reset-password-error" : undefined
  const successId = hasSuccess ? "reset-password-success" : undefined

  // Redirect to dashboard on successful password update
  useEffect(() => {
    if (hasSuccess) {
      const timer = setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasSuccess, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6 border border-slate-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-2">Reset Password</h1>
          <p className="text-slate-600 text-sm">
            Enter your new password below.
          </p>
        </div>

        {hasError && (
          <div 
            id={errorId}
            className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3"
            role="alert"
          >
            {state.message}
          </div>
        )}

        {hasSuccess && (
          <div 
            id={successId}
            className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3"
            role="alert"
          >
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              New Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Enter new password"
              required
              minLength={6}
              aria-invalid={hasError}
              aria-describedby={errorId}
              className="h-12 border-2 border-slate-300 text-slate-900 bg-white rounded-lg text-base placeholder:text-slate-400"
              aria-label="New password"
            />
            <p className="text-xs text-slate-500">
              Password must be at least 6 characters long.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
              Confirm New Password
            </label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm new password"
              required
              minLength={6}
              aria-invalid={hasError}
              aria-describedby={errorId}
              className="h-12 border-2 border-slate-300 text-slate-900 bg-white rounded-lg text-base placeholder:text-slate-400"
              aria-label="Confirm new password"
            />
          </div>

          <SubmitButton />
        </form>

        <div className="text-center">
          <div className="text-sm text-slate-600">
            Remember your password?{' '}
            <Link href="/sign-in" className="text-red-700 hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
