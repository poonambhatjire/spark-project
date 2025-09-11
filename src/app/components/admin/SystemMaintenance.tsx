'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'

interface MaintenanceTask {
  id: string
  name: string
  description: string
  status: 'idle' | 'running' | 'completed' | 'error'
  lastRun?: string
  nextRun?: string
  category: 'database' | 'system' | 'backup' | 'cleanup'
}

export default function SystemMaintenance() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    {
      id: '1',
      name: 'Database Cleanup',
      description: 'Remove old log entries and temporary data',
      status: 'idle',
      lastRun: '2024-01-15T10:00:00Z',
      nextRun: '2024-01-22T10:00:00Z',
      category: 'database'
    },
    {
      id: '2',
      name: 'System Health Check',
      description: 'Check system performance and resource usage',
      status: 'idle',
      lastRun: '2024-01-15T09:30:00Z',
      nextRun: '2024-01-15T15:30:00Z',
      category: 'system'
    },
    {
      id: '3',
      name: 'Backup Database',
      description: 'Create a full backup of the database',
      status: 'idle',
      lastRun: '2024-01-14T02:00:00Z',
      nextRun: '2024-01-16T02:00:00Z',
      category: 'backup'
    },
    {
      id: '4',
      name: 'Clean Temporary Files',
      description: 'Remove temporary files and cache',
      status: 'idle',
      lastRun: '2024-01-15T08:00:00Z',
      nextRun: '2024-01-16T08:00:00Z',
      category: 'cleanup'
    }
  ])

  const [systemHealth] = useState({
    database: 'healthy',
    server: 'healthy',
    storage: 'healthy',
    memory: 'healthy'
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default' as const
      case 'running':
        return 'secondary' as const
      case 'error':
        return 'outline' as const
      default:
        return 'outline' as const
    }
  }

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'database':
        return 'default' as const
      case 'system':
        return 'secondary' as const
      case 'backup':
        return 'outline' as const
      case 'cleanup':
        return 'outline' as const
      default:
        return 'outline' as const
    }
  }

  const getHealthBadgeVariant = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'default' as const
      case 'warning':
        return 'secondary' as const
      case 'critical':
        return 'outline' as const
      default:
        return 'outline' as const
    }
  }

  const handleRunTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'running' as const }
        : task
    ))

    // Simulate task execution
    setTimeout(() => {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'completed' as const,
              lastRun: new Date().toISOString()
            }
          : task
      ))
    }, 3000)
  }

  const handleRunAllTasks = () => {
    setTasks(tasks.map(task => ({ ...task, status: 'running' as const })))

    // Simulate all tasks completion
    setTimeout(() => {
      setTasks(tasks.map(task => ({ 
        ...task, 
        status: 'completed' as const,
        lastRun: new Date().toISOString()
      })))
    }, 5000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          System Maintenance
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Monitor system health and run maintenance tasks
        </p>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Database</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Healthy</p>
              </div>
              <Badge variant={getHealthBadgeVariant(systemHealth.database)}>
                {systemHealth.database}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Server</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Healthy</p>
              </div>
              <Badge variant={getHealthBadgeVariant(systemHealth.server)}>
                {systemHealth.server}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Storage</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Healthy</p>
              </div>
              <Badge variant={getHealthBadgeVariant(systemHealth.storage)}>
                {systemHealth.storage}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Memory</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Healthy</p>
              </div>
              <Badge variant={getHealthBadgeVariant(systemHealth.memory)}>
                {systemHealth.memory}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Maintenance Tasks</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Run system maintenance tasks manually or on schedule
              </p>
            </div>
            <Button onClick={handleRunAllTasks} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Run All Tasks
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      {task.name}
                    </h4>
                    <Badge variant={getCategoryBadgeVariant(task.category)}>
                      {task.category}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    {task.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-500">
                    {task.lastRun && (
                      <span>Last run: {new Date(task.lastRun).toLocaleString()}</span>
                    )}
                    {task.nextRun && (
                      <span>Next run: {new Date(task.nextRun).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {task.status === 'running' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRunTask(task.id)}
                    disabled={task.status === 'running'}
                  >
                    {task.status === 'running' ? 'Running...' : 'Run Now'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">System started successfully</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-500">2 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Database connection established</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-500">5 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Admin panel accessed</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-500">10 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Maintenance task completed</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-500">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
