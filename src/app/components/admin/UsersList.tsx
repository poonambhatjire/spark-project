'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { getAllUsers, AdminUser } from '@/lib/actions/admin'
import UserActivityView from './UserActivityView'

export default function UsersList() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await getAllUsers()
        if (result.success && result.users) {
          setUsers(result.users)
        } else {
          setError(result.error || 'Failed to load users')
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error('Error loading users:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
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

  // If a user is selected, show their activity
  if (selectedUser) {
    return (
      <UserActivityView 
        user={selectedUser} 
        onBack={() => setSelectedUser(null)} 
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>User Management</span>
          <Badge variant="outline" className="text-sm">
            {users.length} {users.length === 1 ? 'User' : 'Users'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400">No users found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
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
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Joined {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role === 'super_admin' ? 'Super Admin' : 
                     user.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                  >
                    View Activity
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
