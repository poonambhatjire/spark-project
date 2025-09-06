"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import Link from "next/link"
import { demoSignIn } from "@/lib/auth/session"

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full h-12 bg-red-900 hover:bg-red-800 text-white font-semibold text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  )
}

const SignInPage = () => {
  const [state, formAction] = useActionState(demoSignIn, null)
  const hasError = state?.ok === false
  const errorId = hasError ? "signin-error" : undefined

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <form action={formAction} className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6 border border-slate-200">
        <h1 className="text-2xl font-bold text-red-900 mb-4">Sign In</h1>
        {hasError && (
          <div 
            id={errorId}
            className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3"
            role="alert"
          >
            {state.message}
          </div>
        )}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          aria-invalid={hasError}
          aria-describedby={errorId}
          className="h-12 border-2 border-slate-300 text-slate-900 bg-white rounded-lg text-base placeholder:text-slate-400"
          aria-label="Email"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          aria-invalid={hasError}
          aria-describedby={errorId}
          className="h-12 border-2 border-slate-300 text-slate-900 bg-white rounded-lg text-base placeholder:text-slate-400"
          aria-label="Password"
        />
        <SubmitButton />
        <div className="text-sm text-slate-600 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-red-700 hover:underline font-medium">Sign Up</Link>
        </div>
      </form>
    </div>
  )
}

export default SignInPage 