'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import ActivityCategoriesManager from './ActivityCategoriesManager'
import EmailTemplateEditor from './EmailTemplateEditor'
import PermissionMatrix from './PermissionMatrix'
import SystemMaintenance from './SystemMaintenance'

export default function SystemSettings() {
  const [activeSection, setActiveSection] = useState<'overview' | 'categories' | 'emails' | 'permissions' | 'maintenance'>('overview')

  const settingsSections = [
    {
      id: 'overview' as const,
      title: 'System Overview',
      description: 'General system information and status',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      id: 'categories' as const,
      title: 'Activity Categories',
      description: 'Manage task types and activity categories',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'green'
    },
    {
      id: 'emails' as const,
      title: 'Email Templates',
      description: 'Customize system email templates',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'purple'
    },
    {
      id: 'permissions' as const,
      title: 'Permissions & Roles',
      description: 'Manage user permissions and access control',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'orange'
    },
    {
      id: 'maintenance' as const,
      title: 'System Maintenance',
      description: 'Database tools and system health monitoring',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
      color: 'red'
    }
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
      case 'green':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
      case 'orange':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
      case 'red':
        return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
    }
  }

  const handleNavigate = (section: string) => {
    setActiveSection(section as 'overview' | 'categories' | 'emails' | 'permissions' | 'maintenance')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <SystemOverview onNavigate={handleNavigate} />
      case 'categories':
        return <ActivityCategoriesManager />
      case 'emails':
        return <EmailTemplateEditor />
      case 'permissions':
        return <PermissionMatrix />
      case 'maintenance':
        return <SystemMaintenance />
      default:
        return <SystemOverview onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          System Settings
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Configure system settings, manage categories, and maintain the application
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {settingsSections.map((section) => (
          <Card 
            key={section.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              activeSection === section.id 
                ? 'ring-2 ring-red-500 shadow-md' 
                : 'hover:shadow-sm'
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(section.color)}`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {section.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {section.description}
                  </p>
                </div>
                {activeSection === section.id && (
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Area */}
      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  )
}

// System Overview Component
function SystemOverview({ onNavigate }: { onNavigate: (section: string) => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Total Users</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">-</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Registered users</p>
            </div>

            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Activity Categories</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">12</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Task types available</p>
            </div>

            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">System Uptime</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">99.9%</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Availability</p>
            </div>

            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Database Size</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">-</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Storage used</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">System started</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-500">Just now</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Database connected</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-500">2 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Admin panel accessed</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-500">5 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('categories')}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Manage Activity Categories
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('emails')}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Edit Email Templates
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('maintenance')}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                System Maintenance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
