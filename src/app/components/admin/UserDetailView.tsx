'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { getUserActivity, AdminUser } from '@/lib/actions/admin'
import { convertToCSV } from '@/app/lib/utils/csv'

interface UserDetailViewProps {
  user: AdminUser
  onBack: () => void
}

interface UserActivity {
  id: string
  task: string
  other_task?: string
  minutes: number
  occurred_on: string
  comment?: string
  created_at: string
}

export default function UserDetailView({ user, onBack }: UserDetailViewProps) {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  const loadUserActivity = useCallback(async () => {
    try {
      setIsLoading(true)
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
  }, [user.id])

  const exportToCSV = () => {
    const filteredActivities = getFilteredActivities()
    const csvData = filteredActivities.map(activity => ({
      'Date': new Date(activity.occurred_on).toLocaleDateString(),
      'Task': activity.task,
      'Other Task': activity.other_task || '',
      'Minutes': activity.minutes,
      'Hours': (activity.minutes / 60).toFixed(2),
      'Comment': activity.comment || '',
      'Created': new Date(activity.created_at).toLocaleString()
    }))
    
    const csv = convertToCSV(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${user.name}_activity_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    // For now, we'll create a simple HTML report that can be printed to PDF
    const filteredActivities = getFilteredActivities()
    const totalMinutes = filteredActivities.reduce((sum, activity) => sum + activity.minutes, 0)
    const totalHours = (totalMinutes / 60).toFixed(2)
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Activity Report - ${user.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Activity Report</h1>
          <h2>${user.name}</h2>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Time Range: ${timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : timeRange === '90d' ? 'Last 90 days' : 'All time'}</p>
        </div>
        
        <div class="summary">
          <h3>Summary</h3>
          <p><strong>Total Entries:</strong> ${filteredActivities.length}</p>
          <p><strong>Total Time:</strong> ${totalHours} hours (${totalMinutes} minutes)</p>
          <p><strong>Average per Entry:</strong> ${filteredActivities.length > 0 ? (totalMinutes / filteredActivities.length).toFixed(1) : 0} minutes</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Task</th>
              <th>Minutes</th>
              <th>Hours</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            ${filteredActivities.map(activity => `
              <tr>
                <td>${new Date(activity.occurred_on).toLocaleDateString()}</td>
                <td>${activity.task}${activity.other_task ? ` (${activity.other_task})` : ''}</td>
                <td>${activity.minutes}</td>
                <td>${(activity.minutes / 60).toFixed(2)}</td>
                <td>${activity.comment || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  useEffect(() => {
    loadUserActivity()
  }, [user.id, loadUserActivity])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'default' as const
      case 'admin':
        return 'secondary' as const
      default:
        return 'outline' as const
    }
  }

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' as const : 'outline' as const
  }

  // Calculate user statistics
  const totalMinutes = activities.reduce((sum, activity) => sum + activity.minutes, 0)
  const totalEntries = activities.length
  const averageMinutesPerEntry = totalEntries > 0 ? Math.round(totalMinutes / totalEntries) : 0
  
  // Activity breakdown by task type
  const taskBreakdown = activities.reduce((acc, activity) => {
    acc[activity.task] = (acc[activity.task] || 0) + activity.minutes
    return acc
  }, {} as Record<string, number>)

  // Recent activity (last 10 entries)
  const recentActivities = activities.slice(0, 10)

  // Filter activities by time range
  const getFilteredActivities = () => {
    if (timeRange === 'all') return activities
    
    const now = new Date()
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    
    return activities.filter(activity => 
      new Date(activity.occurred_on) >= cutoffDate
    )
  }

  const filteredActivities = getFilteredActivities()
  const filteredTotalMinutes = filteredActivities.reduce((sum, activity) => sum + activity.minutes, 0)
  const filteredTotalEntries = filteredActivities.length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              User Details
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Loading user information and activity...
            </p>
          </div>
          <Button variant="outline" onClick={onBack}>
            ← Back to Users
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              User Details
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Error loading user information
            </p>
          </div>
          <Button variant="outline" onClick={onBack}>
            ← Back to Users
          </Button>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Error Loading User Data
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {error}
              </p>
              <Button onClick={loadUserActivity} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            User Details
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Comprehensive view of user profile and activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportToCSV}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportToPDF}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Export PDF
            </Button>
          </div>
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Users
          </Button>
        </div>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-xl mb-2">
                  {user.name || 'No name provided'}
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400 mb-3">
                  {user.email}
                </p>
                <div className="flex items-center space-x-3">
                  <Badge variant={getRoleBadgeVariant(user.role)} className="px-3 py-1">
                    {user.role === 'super_admin' ? 'Super Admin' : 
                     user.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(user.is_active ?? true)} className="px-3 py-1">
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Member since
              </p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {formatDate(user.created_at)}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Time Logged
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalMinutes}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  minutes
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Entries
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {totalEntries}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  activities
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Average per Entry
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {averageMinutesPerEntry}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  minutes
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Days
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {new Set(activities.map(a => a.occurred_on.split('T')[0])).size}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  unique days
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Analytics</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Time Range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | 'all')}
                className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity Breakdown */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
                Activity Breakdown ({timeRange === 'all' ? 'All Time' : `Last ${timeRange}`})
              </h4>
              <div className="space-y-3">
                {Object.entries(taskBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([task, minutes]) => (
                    <div key={task} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1 mr-2">
                        {task}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (minutes / Math.max(...Object.values(taskBreakdown))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 w-12 text-right">
                          {minutes}m
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Filtered Statistics */}
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
                Filtered Statistics
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Time</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {filteredTotalMinutes} minutes
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Entries</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {filteredTotalEntries}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Average per Entry</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {filteredTotalEntries > 0 ? Math.round(filteredTotalMinutes / filteredTotalEntries) : 0} minutes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                No activity found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                This user hasn&apos;t logged any activities yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {activity.task}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {activity.minutes} minutes
                      </Badge>
                    </div>
                    {activity.other_task && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <strong>Other Task:</strong> {activity.other_task}
                      </p>
                    )}
                    {activity.comment && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <strong>Comment:</strong> &ldquo;{activity.comment}&rdquo;
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-500">
                      <span>Date: {formatDate(activity.occurred_on)}</span>
                      <span>Logged: {formatDateTime(activity.created_at)}</span>
                    </div>
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
