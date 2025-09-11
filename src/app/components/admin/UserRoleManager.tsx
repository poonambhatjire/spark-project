'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { AdminUser, updateUserRole } from '@/lib/actions/admin'

interface UserRoleManagerProps {
  user: AdminUser
  onRoleUpdated: () => void
  onClose: () => void
}

export default function UserRoleManager({ user, onRoleUpdated, onClose }: UserRoleManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleRoleChange = async (newRole: 'user' | 'admin' | 'super_admin') => {
    if (newRole === user.role) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await updateUserRole(user.id, newRole)
      
      if (result.success) {
        setSuccess(`User role updated to ${newRole === 'super_admin' ? 'Super Admin' : newRole === 'admin' ? 'Admin' : 'User'}`)
        onRoleUpdated()
        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setError(result.error || 'Failed to update user role')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error updating user role:', err)
    } finally {
      setIsLoading(false)
    }
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

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'admin':
        return 'Admin'
      default:
        return 'User'
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Manage User Role</span>
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
            <Badge variant={getRoleBadgeVariant(user.role)} className="mt-1">
              Current: {getRoleDisplayName(user.role)}
            </Badge>
          </div>
        </div>

        {/* Role Options */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Change Role To:
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {user.role !== 'user' && (
              <Button
                variant="outline"
                onClick={() => handleRoleChange('user')}
                disabled={isLoading}
                className="justify-start"
              >
                <Badge variant="outline" className="mr-2">User</Badge>
                Regular user access
              </Button>
            )}
            {user.role !== 'admin' && (
              <Button
                variant="outline"
                onClick={() => handleRoleChange('admin')}
                disabled={isLoading}
                className="justify-start"
              >
                <Badge variant="secondary" className="mr-2">Admin</Badge>
                Admin panel access
              </Button>
            )}
            {user.role !== 'super_admin' && (
              <Button
                variant="outline"
                onClick={() => handleRoleChange('super_admin')}
                disabled={isLoading}
                className="justify-start"
              >
                <Badge variant="default" className="mr-2">Super Admin</Badge>
                Full system access
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
            <p className="text-sm text-slate-600 dark:text-slate-400">Updating role...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
