'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { checkAdminAccess, AdminUser } from '@/lib/actions/admin'
import UsersList from '@/app/components/admin/UsersList'
import ActivityAnalytics from '@/app/components/admin/ActivityAnalytics'

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'dashboard' | 'users' | 'analytics' | 'settings'>('dashboard')

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const result = await checkAdminAccess()
        if (result.success) {
          setIsAdmin(result.isAdmin)
          setUser(result.user || null)
          if (!result.isAdmin) {
            setError('You do not have admin privileges to access this panel.')
          }
        } else {
          setError(result.error || 'Failed to check admin access')
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error('Error checking admin access:', err)
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (error || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {error || 'You do not have admin privileges to access this panel.'}
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Admin Panel
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome to the SPARC admin panel, {user?.name || 'Admin'}. Manage users and view system analytics.
          </p>
        </div>

        {activeSection === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    View and manage all registered users.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveSection('users')}
                  >
                    View Users
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Activity Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    View time tracking analytics across all users.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveSection('analytics')}
                  >
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Configure system-wide settings and preferences.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveSection('settings')}
                  >
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400">
                    Admin panel is ready! This is a basic test version. More features will be added incrementally.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeSection === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                User Management
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            <UsersList />
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Activity Analytics
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            <ActivityAnalytics />
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                System Settings
              </h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  System settings will be implemented in the next phase.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
