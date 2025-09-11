'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'

interface AnalyticsData {
  totalUsers: number
  totalEntries: number
  totalMinutes: number
  averageMinutesPerEntry: number
  averageMinutesPerUser: number
  activityBreakdown: Array<{
    task: string
    count: number
    totalMinutes: number
    percentage: number
  }>
  timeTrends: Array<{
    date: string
    entries: number
    minutes: number
  }>
  userComparison: Array<{
    userId: string
    userName: string
    totalEntries: number
    totalMinutes: number
    averageMinutes: number
  }>
  activityPatterns: Array<{
    pattern: string
    description: string
    count: number
    percentage: number
  }>
}

// Mock data for demonstration
const mockAnalyticsData: AnalyticsData = {
    totalUsers: 25,
    totalEntries: 342,
    totalMinutes: 12840,
    averageMinutesPerEntry: 37.5,
    averageMinutesPerUser: 513.6,
    activityBreakdown: [
      { task: 'Patient Care - Prospective Audit & Feedback', count: 45, totalMinutes: 1680, percentage: 13.1 },
      { task: 'Antimicrobial Stewardship - Restricted Antimicrobials', count: 32, totalMinutes: 1200, percentage: 9.3 },
      { task: 'Clinical Rounds', count: 28, totalMinutes: 1120, percentage: 8.7 },
      { task: 'Guidelines & EHR Integration', count: 15, totalMinutes: 600, percentage: 4.7 },
      { task: 'Antimicrobial Management Unit (AMU)', count: 22, totalMinutes: 880, percentage: 6.9 },
      { task: 'Antimicrobial Resistance (AMR)', count: 18, totalMinutes: 720, percentage: 5.6 },
      { task: 'Antibiotic Appropriateness Review', count: 35, totalMinutes: 1400, percentage: 10.9 },
      { task: 'Intervention Acceptance', count: 12, totalMinutes: 480, percentage: 3.7 },
      { task: 'Data Sharing & Reporting', count: 8, totalMinutes: 320, percentage: 2.5 },
      { task: 'Providing Education', count: 25, totalMinutes: 1000, percentage: 7.8 },
      { task: 'Receiving Education', count: 14, totalMinutes: 560, percentage: 4.4 },
      { task: 'Committee Work', count: 20, totalMinutes: 800, percentage: 6.2 },
      { task: 'QI Projects & Research', count: 16, totalMinutes: 640, percentage: 5.0 },
      { task: 'Email Communications', count: 42, totalMinutes: 1680, percentage: 13.1 },
      { task: 'Other Activities', count: 5, totalMinutes: 200, percentage: 1.6 }
    ],
    timeTrends: [
      { date: '2024-01-01', entries: 12, minutes: 480 },
      { date: '2024-01-02', entries: 8, minutes: 320 },
      { date: '2024-01-03', entries: 15, minutes: 600 },
      { date: '2024-01-04', entries: 10, minutes: 400 },
      { date: '2024-01-05', entries: 18, minutes: 720 },
      { date: '2024-01-06', entries: 6, minutes: 240 },
      { date: '2024-01-07', entries: 14, minutes: 560 },
      { date: '2024-01-08', entries: 20, minutes: 800 },
      { date: '2024-01-09', entries: 16, minutes: 640 },
      { date: '2024-01-10', entries: 22, minutes: 880 },
      { date: '2024-01-11', entries: 11, minutes: 440 },
      { date: '2024-01-12', entries: 19, minutes: 760 },
      { date: '2024-01-13', entries: 7, minutes: 280 },
      { date: '2024-01-14', entries: 13, minutes: 520 },
      { date: '2024-01-15', entries: 17, minutes: 680 }
    ],
    userComparison: [
      { userId: '1', userName: 'Dr. Sarah Johnson', totalEntries: 45, totalMinutes: 1680, averageMinutes: 37.3 },
      { userId: '2', userName: 'Dr. Michael Chen', totalEntries: 38, totalMinutes: 1520, averageMinutes: 40.0 },
      { userId: '3', userName: 'Dr. Emily Rodriguez', totalEntries: 42, totalMinutes: 1680, averageMinutes: 40.0 },
      { userId: '4', userName: 'Dr. James Wilson', totalEntries: 35, totalMinutes: 1400, averageMinutes: 40.0 },
      { userId: '5', userName: 'Dr. Lisa Thompson', totalEntries: 28, totalMinutes: 1120, averageMinutes: 40.0 },
      { userId: '6', userName: 'Dr. Robert Davis', totalEntries: 31, totalMinutes: 1240, averageMinutes: 40.0 },
      { userId: '7', userName: 'Dr. Jennifer Brown', totalEntries: 26, totalMinutes: 1040, averageMinutes: 40.0 },
      { userId: '8', userName: 'Dr. David Miller', totalEntries: 33, totalMinutes: 1320, averageMinutes: 40.0 }
    ],
    activityPatterns: [
      { pattern: 'High Activity Days', description: 'Days with >15 entries', count: 8, percentage: 53.3 },
      { pattern: 'Weekend Activity', description: 'Entries on weekends', count: 12, percentage: 8.0 },
      { pattern: 'Long Sessions', description: 'Entries >60 minutes', count: 45, percentage: 13.2 },
      { pattern: 'Quick Logs', description: 'Entries <30 minutes', count: 156, percentage: 45.6 },
      { pattern: 'Multi-task Days', description: 'Days with 3+ different tasks', count: 18, percentage: 60.0 }
    ]
  }

export default function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'comparison' | 'patterns'>('overview')

  const loadAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAnalyticsData(mockAnalyticsData)
    } catch (err) {
      setError('Failed to load analytics data')
      console.error('Error loading analytics:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAnalyticsData()
  }, [loadAnalyticsData])


  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  if (error || !analyticsData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                Error Loading Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {error || 'Failed to load analytics data'}
              </p>
              <Button onClick={loadAnalyticsData} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Advanced Analytics
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Comprehensive insights and trends across all user activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | 'all')}
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'trends', label: 'Trends', icon: '📈' },
          { id: 'comparison', label: 'User Comparison', icon: '👥' },
          { id: 'patterns', label: 'Patterns', icon: '🔍' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'trends' | 'comparison' | 'patterns')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{analyticsData.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Entries</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{analyticsData.totalEntries}</p>
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
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Time</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatMinutes(analyticsData.totalMinutes)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg per Entry</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{analyticsData.averageMinutesPerEntry.toFixed(1)}m</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Breakdown</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Distribution of time across different activity types
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.activityBreakdown.slice(0, 10).map((activity) => (
                  <div key={activity.task} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {activity.task}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {activity.count} entries • {formatMinutes(activity.totalMinutes)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${activity.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Trends</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Daily activity patterns over time
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.timeTrends.map((trend) => (
                  <div key={trend.date} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-red-600 dark:text-red-400">
                          {new Date(trend.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {new Date(trend.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {trend.entries} entries
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {formatMinutes(trend.minutes)}
                      </p>
                      <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-red-600 h-1.5 rounded-full"
                          style={{ width: `${(trend.minutes / 1000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Comparison</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Compare activity levels across users
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.userComparison.map((user, index) => (
                  <div key={user.userId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.userName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {user.userName}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {user.totalEntries} entries
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {formatMinutes(user.totalMinutes)}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Total Time</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {user.averageMinutes.toFixed(0)}m
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Avg per Entry</p>
                      </div>
                      <Badge variant={index < 3 ? 'default' : 'outline'}>
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Patterns</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Insights into user behavior patterns
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analyticsData.activityPatterns.map((pattern) => (
                  <div key={pattern.pattern} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {pattern.pattern}
                      </h4>
                      <Badge variant="outline">
                        {pattern.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {pattern.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-500">
                        {pattern.count} occurrences
                      </span>
                      <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-red-600 h-1.5 rounded-full"
                          style={{ width: `${pattern.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
