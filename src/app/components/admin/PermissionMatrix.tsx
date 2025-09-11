'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Checkbox } from '@/app/components/ui/checkbox'

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
}

export default function PermissionMatrix() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'user',
      name: 'User',
      description: 'Standard user with basic access',
      permissions: ['view_dashboard', 'create_time_entry', 'view_own_profile']
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Administrator with user management access',
      permissions: ['view_dashboard', 'create_time_entry', 'view_own_profile', 'view_admin_panel', 'manage_users', 'view_analytics']
    },
    {
      id: 'super_admin',
      name: 'Super Admin',
      description: 'Full system access and configuration',
      permissions: ['view_dashboard', 'create_time_entry', 'view_own_profile', 'view_admin_panel', 'manage_users', 'view_analytics', 'manage_roles', 'system_settings', 'manage_categories']
    }
  ])

  const [permissions] = useState<Permission[]>([
    {
      id: 'view_dashboard',
      name: 'View Dashboard',
      description: 'Access to the main dashboard',
      category: 'Dashboard'
    },
    {
      id: 'create_time_entry',
      name: 'Create Time Entry',
      description: 'Create and manage time entries',
      category: 'Time Tracking'
    },
    {
      id: 'view_own_profile',
      name: 'View Own Profile',
      description: 'View and edit own profile',
      category: 'Profile'
    },
    {
      id: 'view_admin_panel',
      name: 'View Admin Panel',
      description: 'Access to admin panel',
      category: 'Admin'
    },
    {
      id: 'manage_users',
      name: 'Manage Users',
      description: 'View, edit, and manage user accounts',
      category: 'Admin'
    },
    {
      id: 'view_analytics',
      name: 'View Analytics',
      description: 'Access to system analytics and reports',
      category: 'Analytics'
    },
    {
      id: 'manage_roles',
      name: 'Manage Roles',
      description: 'Create, edit, and assign user roles',
      category: 'Admin'
    },
    {
      id: 'system_settings',
      name: 'System Settings',
      description: 'Access to system configuration',
      category: 'System'
    },
    {
      id: 'manage_categories',
      name: 'Manage Categories',
      description: 'Manage activity categories',
      category: 'System'
    }
  ])

  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId)
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId]
        }
      }
      return role
    }))
  }

  const handleEditRole = (role: Role) => {
    setEditingRole(role)
  }

  const getRoleBadgeVariant = (roleId: string) => {
    switch (roleId) {
      case 'super_admin':
        return 'default' as const
      case 'admin':
        return 'secondary' as const
      case 'user':
        return 'outline' as const
      default:
        return 'outline' as const
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Permission Matrix
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Manage user roles and their associated permissions
        </p>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{role.name}</CardTitle>
                <Badge variant={getRoleBadgeVariant(role.id)}>
                  {role.permissions.length} permissions
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {role.description}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditRole(role)}
                className="w-full"
              >
                Edit Permissions
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Check which permissions each role has access to
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                    Permission
                  </th>
                  {roles.map((role) => (
                    <th key={role.id} className="text-center py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <React.Fragment key={category}>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <td colSpan={roles.length + 1} className="py-2 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {category}
                      </td>
                    </tr>
                    {categoryPermissions.map((permission) => (
                      <tr key={permission.id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              {permission.name}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {permission.description}
                            </div>
                          </div>
                        </td>
                        {roles.map((role) => (
                          <td key={role.id} className="text-center py-3 px-4">
                            <Checkbox
                              checked={role.permissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(role.id, permission.id)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Editor Modal */}
      {editingRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Edit {editingRole.name} Permissions
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingRole(null)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <div key={category}>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <Checkbox
                          checked={editingRole.permissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(editingRole.id, permission.id)}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {permission.name}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {permission.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4 pt-6">
              <Button onClick={() => setEditingRole(null)} className="flex-1">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingRole(null)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
