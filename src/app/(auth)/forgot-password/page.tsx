"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import Link from "next/link"
import { resetPassword } from "@/lib/auth/supabase-actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full h-12 bg-red-900 hover:bg-red-800 text-white font-semibold text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Sending..." : "Send Reset Email"}
    </Button>
  )
}

const ForgotPasswordPage = () => {
  const [state, formAction] = useActionState(resetPassword, null)
  const hasError = state?.ok === false
  const hasSuccess = state?.ok === true
  const errorId = hasError ? "forgot-password-error" : undefined
  const successId = hasSuccess ? "forgot-password-success" : undefined

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6 border border-slate-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-2">Forgot Password?</h1>
          <p className="text-slate-600 text-sm">
            Enter your email address and we&apos;ll send you a link to reset your password.
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
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              required
              aria-invalid={hasError}
              aria-describedby={errorId}
              className="h-12 border-2 border-slate-300 text-slate-900 bg-white rounded-lg text-base placeholder:text-slate-400"
              aria-label="Email address"
            />
          </div>

          <SubmitButton />
        </form>

        <div className="text-center space-y-2">
          <div className="text-sm text-slate-600">
            Remember your password?{' '}
            <Link href="/sign-in" className="text-red-700 hover:underline font-medium">
              Sign In
            </Link>
          </div>
          <div className="text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-red-700 hover:underline font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
