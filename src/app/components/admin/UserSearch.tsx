'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { AdminUser } from '@/lib/actions/admin'

interface UserSearchProps {
  users: AdminUser[]
  onFilteredUsers: (users: AdminUser[]) => void
}

export default function UserSearch({ users, onFilteredUsers }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin' | 'super_admin'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'created_at'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const applyFilters = useCallback(() => {
    let filtered = [...users]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active'
      filtered = filtered.filter(user => (user.is_active ?? true) === isActive)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'name':
          aValue = a.name || ''
          bValue = b.name || ''
          break
        case 'email':
          aValue = a.email
          bValue = b.email
          break
        case 'role':
          aValue = a.role
          bValue = b.role
          break
        case 'created_at':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          aValue = a.name || ''
          bValue = b.name || ''
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    onFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder, onFilteredUsers])

  const clearFilters = () => {
    setSearchTerm('')
    setRoleFilter('all')
    setStatusFilter('all')
    setSortBy('created_at')
    setSortOrder('desc')
    onFilteredUsers(users)
  }

  // Apply filters when component mounts or users change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const getFilterCounts = () => {
    const total = users.length
    const active = users.filter(u => u.is_active ?? true).length
    const inactive = total - active
    const admins = users.filter(u => u.role === 'admin' || u.role === 'super_admin').length
    const regularUsers = total - admins

    return { total, active, inactive, admins, regularUsers }
  }

  const counts = getFilterCounts()

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search & Filter Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Search Users
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                applyFilters()
              }}
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as 'all' | 'user' | 'admin' | 'super_admin')
                applyFilters()
              }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Roles ({counts.total})</option>
              <option value="user">Users ({counts.regularUsers})</option>
              <option value="admin">Admins ({counts.admins})</option>
              <option value="super_admin">Super Admins</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')
                applyFilters()
              }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status ({counts.total})</option>
              <option value="active">Active ({counts.active})</option>
              <option value="inactive">Inactive ({counts.inactive})</option>
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Sort By
            </label>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'name' | 'email' | 'role' | 'created_at')
                  applyFilters()
                }}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="created_at">Join Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  applyFilters()
                }}
                className="px-3"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Showing filtered results
            </span>
            <div className="flex items-center space-x-2">
              {searchTerm && (
                <Badge variant="outline" className="text-xs">
                  Search: &ldquo;{searchTerm}&rdquo;
                </Badge>
              )}
              {roleFilter !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  Role: {roleFilter}
                </Badge>
              )}
              {statusFilter !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  Status: {statusFilter}
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
