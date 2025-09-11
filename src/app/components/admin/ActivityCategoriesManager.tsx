'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'

interface ActivityCategory {
  id: string
  name: string
  description?: string
  isActive: boolean
  usageCount: number
  createdAt: string
  updatedAt: string
}

export default function ActivityCategoriesManager() {
  const [categories, setCategories] = useState<ActivityCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ActivityCategory | null>(null)
  const [searchTerm, setSearchTerm] = useState('')


  useEffect(() => {
    // Simulate loading
    const mockCategories: ActivityCategory[] = [
      {
        id: '1',
        name: 'Patient Care - Prospective Audit & Feedback',
        description: 'Reviewing patient cases and providing feedback on antimicrobial use',
        isActive: true,
        usageCount: 45,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Antimicrobial Stewardship - Restricted Antimicrobials',
        description: 'Managing restricted antimicrobial approvals and consultations',
        isActive: true,
        usageCount: 32,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '3',
        name: 'Clinical Rounds',
        description: 'Participating in clinical rounds and patient discussions',
        isActive: true,
        usageCount: 28,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '4',
        name: 'Guidelines & EHR Integration',
        description: 'Developing and implementing clinical guidelines in EHR systems',
        isActive: true,
        usageCount: 15,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '5',
        name: 'Antimicrobial Management Unit (AMU)',
        description: 'Managing antimicrobial management unit operations',
        isActive: true,
        usageCount: 22,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '6',
        name: 'Antimicrobial Resistance (AMR)',
        description: 'Monitoring and managing antimicrobial resistance patterns',
        isActive: true,
        usageCount: 18,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '7',
        name: 'Antibiotic Appropriateness Review',
        description: 'Reviewing antibiotic appropriateness and making recommendations',
        isActive: true,
        usageCount: 35,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '8',
        name: 'Intervention Acceptance',
        description: 'Tracking and managing intervention acceptance rates',
        isActive: true,
        usageCount: 12,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '9',
        name: 'Data Sharing & Reporting',
        description: 'Sharing data and generating reports for stakeholders',
        isActive: true,
        usageCount: 8,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '10',
        name: 'Providing Education',
        description: 'Providing education to healthcare staff on antimicrobial stewardship',
        isActive: true,
        usageCount: 25,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '11',
        name: 'Receiving Education',
        description: 'Participating in educational activities and training',
        isActive: true,
        usageCount: 14,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '12',
        name: 'Committee Work',
        description: 'Participating in antimicrobial stewardship committees',
        isActive: true,
        usageCount: 20,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '13',
        name: 'QI Projects & Research',
        description: 'Quality improvement projects and research activities',
        isActive: true,
        usageCount: 16,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '14',
        name: 'Email Communications',
        description: 'Email communications related to antimicrobial stewardship',
        isActive: true,
        usageCount: 42,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '15',
        name: 'Other Activities',
        description: 'Other antimicrobial stewardship activities not covered above',
        isActive: true,
        usageCount: 5,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      }
    ]

    setTimeout(() => {
      setCategories(mockCategories)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCategory = () => {
    setShowAddForm(true)
    setEditingCategory(null)
  }

  const handleEditCategory = (category: ActivityCategory) => {
    setEditingCategory(category)
    setShowAddForm(false)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setCategories(categories.filter(cat => cat.id !== categoryId))
    }
  }

  const handleToggleActive = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, isActive: !cat.isActive, updatedAt: new Date().toISOString() }
        : cat
    ))
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Activity Categories
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage task types and activity categories used in time tracking
          </p>
        </div>
        <Button onClick={handleAddCategory} className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="w-full px-4 py-2 pl-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {categories.length}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Categories</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {categories.filter(cat => cat.isActive).length}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Active</p>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="grid gap-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      {category.name}
                    </h4>
                    <Badge variant={category.isActive ? 'default' : 'outline'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {category.usageCount} uses
                    </Badge>
                  </div>
                  {category.description && (
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-500">
                    <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(category.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(category.id)}
                    className={category.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                  >
                    {category.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                No categories found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first activity category.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingCategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category Name
                </label>
                <Input
                  defaultValue={editingCategory?.name || ''}
                  placeholder="Enter category name..."
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description (Optional)
                </label>
                <Textarea
                  defaultValue={editingCategory?.description || ''}
                  placeholder="Enter category description..."
                  className="w-full"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingCategory(null)
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
