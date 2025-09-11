'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'welcome' | 'password_reset' | 'admin_notification' | 'system_alert'
  isActive: boolean
  lastModified: string
}

export default function EmailTemplateEditor() {
  const [templates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to SPARC Calculator',
      body: 'Welcome to the SPARC Calculator! Your account has been created successfully.',
      type: 'welcome',
      isActive: true,
      lastModified: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Password Reset',
      subject: 'Reset Your SPARC Calculator Password',
      body: 'Click the link below to reset your password: {reset_link}',
      type: 'password_reset',
      isActive: true,
      lastModified: '2024-01-15T10:00:00Z'
    },
    {
      id: '3',
      name: 'Admin Notification',
      subject: 'New User Registration',
      body: 'A new user has registered: {user_name} ({user_email})',
      type: 'admin_notification',
      isActive: true,
      lastModified: '2024-01-15T10:00:00Z'
    }
  ])

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'welcome':
        return 'default' as const
      case 'password_reset':
        return 'secondary' as const
      case 'admin_notification':
        return 'outline' as const
      case 'system_alert':
        return 'outline' as const
      default:
        return 'outline' as const
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'welcome':
        return 'Welcome'
      case 'password_reset':
        return 'Password Reset'
      case 'admin_notification':
        return 'Admin Notification'
      case 'system_alert':
        return 'System Alert'
      default:
        return type
    }
  }

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setIsEditing(true)
  }

  const handleSaveTemplate = () => {
    // Save logic would go here
    setIsEditing(false)
    setSelectedTemplate(null)
  }

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Email Templates
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Customize system email templates for user communications
        </p>
      </div>

      {/* Templates List */}
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      {template.name}
                    </h4>
                    <Badge variant={getTypeBadgeVariant(template.type)}>
                      {getTypeLabel(template.type)}
                    </Badge>
                    <Badge variant={template.isActive ? 'default' : 'outline'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    <strong>Subject:</strong> {template.subject}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    <strong>Body:</strong> {template.body}
                  </p>
                  <div className="text-sm text-slate-500 dark:text-slate-500">
                    Last modified: {new Date(template.lastModified).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewTemplate(template)}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Editor Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {isEditing ? 'Edit Template' : 'Preview Template'}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedTemplate(null)
                  setIsEditing(false)
                }}
              >
                Close
              </Button>
            </div>

            {isEditing ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Template Name
                  </label>
                  <Input
                    defaultValue={selectedTemplate.name}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Subject
                  </label>
                  <Input
                    defaultValue={selectedTemplate.subject}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email Body
                  </label>
                  <Textarea
                    defaultValue={selectedTemplate.body}
                    className="w-full"
                    rows={8}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Use variables like {'{user_name}'}, {'{user_email}'}, {'{reset_link}'} for dynamic content
                  </p>
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <Button onClick={handleSaveTemplate} className="flex-1">
                    Save Template
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Subject: {selectedTemplate.subject}
                  </h4>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Email Body:
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                      {selectedTemplate.body}
                    </pre>
                  </div>
                </div>
                <div className="flex items-center space-x-4 pt-4">
                  <Button onClick={() => setIsEditing(true)} className="flex-1">
                    Edit Template
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                  >
                    Send Test Email
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
