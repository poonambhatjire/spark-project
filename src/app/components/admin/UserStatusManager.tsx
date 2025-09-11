'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { AdminUser, updateUserStatus } from '@/lib/actions/admin'

interface UserStatusManagerProps {
  user: AdminUser
  onStatusUpdated: () => void
  onClose: () => void
}

export default function UserStatusManager({ user, onStatusUpdated, onClose }: UserStatusManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleStatusChange = async (newStatus: boolean) => {
    if (newStatus === user.is_active) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await updateUserStatus(user.id, newStatus)
      
      if (result.success) {
        setSuccess(`User account ${newStatus ? 'activated' : 'deactivated'} successfully`)
        onStatusUpdated()
        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setError(result.error || 'Failed to update user status')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error updating user status:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' as const : 'outline' as const
  }

  const getStatusDisplayName = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive'
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Manage User Status</span>
          <Button variant="outline" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">
              {user.name || 'No name provided'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {user.email}
            </p>
            <Badge variant={getStatusBadgeVariant(user.is_active ?? true)} className="mt-1">
              Current: {getStatusDisplayName(user.is_active ?? true)}
            </Badge>
          </div>
        </div>

        {/* Status Options */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Change Status To:
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {user.is_active && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange(false)}
                disabled={isLoading}
                className="justify-start border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-900/20"
              >
                <Badge variant="outline" className="mr-2">Inactive</Badge>
                Disable user account
              </Button>
            )}
            {!user.is_active && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange(true)}
                disabled={isLoading}
                className="justify-start border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-700 dark:hover:bg-green-900/20"
              >
                <Badge variant="default" className="mr-2 bg-green-600">Active</Badge>
                Enable user account
              </Button>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Updating status...</p>
          </div>
        )}

        {/* Warning for inactive users */}
        {!user.is_active && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              ⚠️ Inactive users cannot sign in to the system.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
