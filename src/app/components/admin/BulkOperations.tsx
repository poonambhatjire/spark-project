'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { bulkUpdateUserRoles, bulkUpdateUserStatus } from '@/lib/actions/admin'
import { AdminUser } from '@/lib/actions/admin'

interface BulkOperationsProps {
  selectedUsers: string[]
  users: AdminUser[]
  onSuccess: () => void
  onError: (error: string) => void
  currentUserRole: string
}

export default function BulkOperations({
  selectedUsers,
  users,
  onSuccess,
  onError,
  currentUserRole
}: BulkOperationsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeOperation, setActiveOperation] = useState<'role' | 'status' | null>(null)

  const selectedUsersData = users.filter(user => selectedUsers.includes(user.id))
  const canManageRoles = currentUserRole === 'super_admin'

  const handleBulkRoleUpdate = async (newRole: 'user' | 'admin') => {
    if (!canManageRoles) {
      onError('Only super admins can perform bulk role updates')
      return
    }

    setIsLoading(true)
    try {
      const result = await bulkUpdateUserRoles(selectedUsers, newRole)
      if (result.success) {
        onSuccess()
        setActiveOperation(null)
      } else {
        onError(result.error || 'Failed to update roles')
      }
    } catch {
      onError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkStatusUpdate = async (isActive: boolean) => {
    setIsLoading(true)
    try {
      const result = await bulkUpdateUserStatus(selectedUsers, isActive)
      if (result.success) {
        onSuccess()
        setActiveOperation(null)
      } else {
        onError(result.error || 'Failed to update status')
      }
    } catch {
      onError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (selectedUsers.length === 0) {
    return null
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Bulk Operations
          <Badge variant="outline" className="ml-2">
            {selectedUsers.length} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Users Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
              Selected Users:
            </h4>
            <div className="space-y-1">
              {selectedUsersData.slice(0, 3).map(user => (
                <div key={user.id} className="text-sm text-slate-600 dark:text-slate-400">
                  • {user.name || user.email}
                </div>
              ))}
              {selectedUsersData.length > 3 && (
                <div className="text-sm text-slate-500 dark:text-slate-500">
                  ... and {selectedUsersData.length - 3} more
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
              Current Status:
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {selectedUsersData.filter(u => u.role === 'user').length} Users
              </Badge>
              <Badge variant="outline">
                {selectedUsersData.filter(u => u.role === 'admin').length} Admins
              </Badge>
              <Badge variant="outline">
                {selectedUsersData.filter(u => u.is_active).length} Active
              </Badge>
              <Badge variant="outline">
                {selectedUsersData.filter(u => !u.is_active).length} Inactive
              </Badge>
            </div>
          </div>
        </div>

        {/* Bulk Operations */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {/* Role Management */}
          {canManageRoles && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveOperation(activeOperation === 'role' ? null : 'role')}
                disabled={isLoading}
              >
                Manage Roles
              </Button>
              {activeOperation === 'role' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkRoleUpdate('user')}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    Make Users
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkRoleUpdate('admin')}
                    disabled={isLoading}
                    className="text-xs"
                  >
                    Make Admins
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Status Management */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveOperation(activeOperation === 'status' ? null : 'status')}
              disabled={isLoading}
            >
              Manage Status
            </Button>
            {activeOperation === 'status' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate(true)}
                  disabled={isLoading}
                  className="text-xs text-green-600 hover:text-green-700"
                >
                  Activate All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate(false)}
                  disabled={isLoading}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Deactivate All
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Processing bulk operation...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
