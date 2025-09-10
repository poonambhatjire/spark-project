'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { getUserActivity, AdminUser } from '@/lib/actions/admin'

interface UserActivityViewProps {
  user: AdminUser
  onBack: () => void
}

export default function UserActivityView({ user, onBack }: UserActivityViewProps) {
  const [activities, setActivities] = useState<Array<{
    id: string
    task: string
    other_task?: string
    minutes: number
    occurred_on: string
    comment?: string
    created_at: string
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserActivity = async () => {
      try {
        const result = await getUserActivity(user.id)
        if (result.success && result.activities) {
          setActivities(result.activities)
        } else {
          setError(result.error || 'Failed to load user activity')
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error('Error loading user activity:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserActivity()
  }, [user.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const totalMinutes = activities.reduce((sum, activity) => sum + activity.minutes, 0)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Activity - {user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading user activity...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Activity - {user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Info Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {user.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
                <Badge variant="outline" className="mt-1">
                  {user.role === 'super_admin' ? 'Super Admin' : 
                   user.role === 'admin' ? 'Admin' : 'User'}
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              ← Back to Users
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {activities.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Time Tracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatTime(totalMinutes)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-400 dark:text-slate-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-slate-400">No activity recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">
                        {activity.task}
                      </h3>
                      {activity.other_task && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {activity.other_task}
                        </p>
                      )}
                      {activity.comment && (
                        <p className="text-sm text-slate-500 dark:text-slate-500 italic">
                          &ldquo;{activity.comment}&rdquo;
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Logged on {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2">
                      {formatTime(activity.minutes)}
                    </Badge>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {formatDate(activity.occurred_on)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
