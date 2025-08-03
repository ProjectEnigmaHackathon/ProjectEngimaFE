import React from 'react'
import { CheckCircle, Clock, AlertCircle, Loader, GitBranch, FileText, Package, Tag } from 'lucide-react'

interface RepositoryStatus {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  currentStep?: string
  completedSteps: string[]
}

interface WorkflowProgressProps {
  repositories: RepositoryStatus[]
  className?: string
}

const WORKFLOW_STEPS = [
  { id: 'jira_collection', label: 'JIRA Tickets', icon: FileText },
  { id: 'branch_discovery', label: 'Feature Branches', icon: GitBranch },
  { id: 'merge_validation', label: 'Merge Status', icon: GitBranch },
  { id: 'sprint_merge', label: 'Sprint Merge', icon: Package },
  { id: 'release_creation', label: 'Release Branch', icon: Tag },
  { id: 'documentation', label: 'Documentation', icon: FileText },
]

const getStatusIcon = (status: RepositoryStatus['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={12} className="text-green-600" />
    case 'in_progress':
      return <Loader size={12} className="text-blue-600 animate-spin" />
    case 'error':
      return <AlertCircle size={12} className="text-red-600" />
    default:
      return <Clock size={12} className="text-gray-400" />
  }
}

const getStatusColor = (status: RepositoryStatus['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-50 border-green-200 text-green-800'
    case 'in_progress':
      return 'bg-blue-50 border-blue-200 text-blue-800'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800'
    default:
      return 'bg-gray-50 border-gray-200 text-gray-600'
  }
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ repositories, className = '' }) => {
  if (repositories.length === 0) {
    return null
  }

  const completedCount = repositories.filter(r => r.status === 'completed').length
  const inProgressCount = repositories.filter(r => r.status === 'in_progress').length
  const errorCount = repositories.filter(r => r.status === 'error').length

  return (
    <div className={`bg-gray-50 border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Workflow Progress</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700">{completedCount} completed</span>
          </div>
          {inProgressCount > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-700">{inProgressCount} running</span>
            </div>
          )}
          {errorCount > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-700">{errorCount} errors</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {repositories.map((repo) => (
          <div
            key={repo.id}
            className={`p-3 rounded-lg border transition-all ${getStatusColor(repo.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(repo.status)}
                <span className="font-medium text-sm">{repo.name}</span>
              </div>
              <div className="text-xs font-medium">
                {repo.completedSteps.length}/{WORKFLOW_STEPS.length}
              </div>
            </div>

            {repo.currentStep && (
              <div className="text-xs mb-2 p-1 bg-white bg-opacity-50 rounded">
                <span className="font-medium">Current: </span>
                {WORKFLOW_STEPS.find(s => s.id === repo.currentStep)?.label || repo.currentStep}
              </div>
            )}

            <div className="grid grid-cols-3 gap-1">
              {WORKFLOW_STEPS.map((step) => {
                const StepIcon = step.icon
                const isCompleted = repo.completedSteps.includes(step.id)
                const isCurrent = repo.currentStep === step.id
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center justify-center p-1 rounded text-xs ${
                      isCompleted
                        ? 'bg-green-100 text-green-700'
                        : isCurrent
                        ? 'bg-blue-100 text-blue-700 animate-pulse'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    title={step.label}
                  >
                    <StepIcon size={10} />
                  </div>
                )
              })}
            </div>

            {repo.status === 'error' && (
              <div className="mt-2 text-xs text-red-700 bg-red-100 p-1 rounded">
                Workflow failed. Check logs for details.
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          {WORKFLOW_STEPS.map((step) => {
            const StepIcon = step.icon
            return (
              <div key={step.id} className="flex items-center space-x-1">
                <StepIcon size={10} />
                <span>{step.label}</span>
              </div>
            )
          })}
        </div>
        <div className="text-gray-400">
          Overall: {completedCount}/{repositories.length} repositories
        </div>
      </div>
    </div>
  )
}

export default WorkflowProgress 