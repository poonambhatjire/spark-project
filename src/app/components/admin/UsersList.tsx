'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { getAllUsers, AdminUser } from '@/lib/actions/admin'
import UserDetailView from './UserDetailView'
import UserRoleManager from './UserRoleManager'
import UserStatusManager from './UserStatusManager'
import BulkOperations from './BulkOperations'
import UserSearch from './UserSearch'
import { convertToCSV } from '@/app/lib/utils/csv'

interface UsersListProps {
  currentUserRole?: string
}

export default function UsersList({ currentUserRole = 'user' }: UsersListProps) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [roleManagerUser, setRoleManagerUser] = useState<AdminUser | null>(null)
  const [statusManagerUser, setStatusManagerUser] = useState<AdminUser | null>(null)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])

  const loadUsers = async () => {
    try {
      const result = await getAllUsers()
      if (result.success && result.users) {
        setUsers(result.users)
        setFilteredUsers(result.users)
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

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(users.map(user => user.id))
    }
  }

  const handleBulkSuccess = () => {
    setSelectedUserIds([])
    loadUsers()
  }

  const handleBulkError = (error: string) => {
    setError(error)
  }

  const exportSelectedUsers = () => {
    if (selectedUserIds.length === 0) {
      alert('Please select users to export')
      return
    }

    const selectedUsers = users.filter(user => selectedUserIds.includes(user.id))
    const csvData = selectedUsers.map(user => ({
      'Name': user.name || '',
      'Email': user.email || '',
      'Role': user.role || '',
      'Status': user.is_active ? 'Active' : 'Inactive',
      'Join Date': user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
      'Last Activity': user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
      'Total Entries': 0,
      'Total Minutes': 0,
      'Organization': '',
      'Professional Title': ''
    }))

    const csv = convertToCSV(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAllUsers = () => {
    const csvData = users.map(user => ({
      'Name': user.name || '',
      'Email': user.email || '',
      'Role': user.role || '',
      'Status': user.is_active ? 'Active' : 'Inactive',
      'Join Date': user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
      'Last Activity': user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
      'Total Entries': 0,
      'Total Minutes': 0,
      'Organization': '',
      'Professional Title': ''
    }))

    const csv = convertToCSV(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `all_users_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
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

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? 'default' as const : 'outline' as const
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

  // If a user is selected for status management, show status manager
  if (statusManagerUser) {
    return (
      <div className="flex justify-center">
        <UserStatusManager 
          user={statusManagerUser} 
          onStatusUpdated={loadUsers}
          onClose={() => setStatusManagerUser(null)} 
        />
      </div>
    )
  }

  // If a user is selected for role management, show role manager
  if (roleManagerUser) {
    return (
      <div className="flex justify-center">
        <UserRoleManager 
          user={roleManagerUser} 
          onRoleUpdated={loadUsers}
          onClose={() => setRoleManagerUser(null)} 
        />
      </div>
    )
  }

  // If a user is selected, show their detailed view
  if (selectedUser) {
    return (
      <UserDetailView 
        user={selectedUser} 
        onBack={() => setSelectedUser(null)} 
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            User Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {users.length > 0 && (
            <>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportAllUsers}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export All
                </Button>
                {selectedUserIds.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportSelectedUsers}
                    className="flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Selected ({selectedUserIds.length})
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedUserIds.length === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Select All
                </span>
              </div>
            </>
          )}
          <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
            {users.length} {users.length === 1 ? 'User' : 'Users'}
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <UserSearch
        users={users}
        onFilteredUsers={setFilteredUsers}
      />

      {/* Bulk Operations */}
      <BulkOperations
        selectedUsers={selectedUserIds}
        users={filteredUsers}
        onSuccess={handleBulkSuccess}
        onError={handleBulkError}
        currentUserRole={currentUserRole}
      />

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                {users.length === 0 ? 'No users found' : 'No users match your filters'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {users.length === 0 
                  ? 'Users will appear here once they register for the system.'
                  : 'Try adjusting your search criteria or clearing the filters.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  {/* User Info */}
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        {user.name || 'No name provided'}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-2">
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-500">
                        <span>Joined {formatDate(user.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end space-y-3">
                    {/* Status Badges */}
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={getRoleBadgeVariant(user.role)}
                        className="px-3 py-1 text-xs font-medium"
                      >
                        {user.role === 'super_admin' ? 'Super Admin' : 
                         user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                      <Badge 
                        variant={getStatusBadgeVariant(user.is_active ?? true)}
                        className="px-3 py-1 text-xs font-medium"
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setRoleManagerUser(user)}
                        className="text-xs px-3 py-1 h-auto"
                      >
                        Manage Role
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setStatusManagerUser(user)}
                        className="text-xs px-3 py-1 h-auto"
                      >
                        Manage Status
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                        className="text-xs px-3 py-1 h-auto"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
