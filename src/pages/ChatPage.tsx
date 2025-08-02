import React, { useState, useEffect, useRef } from 'react'
import { Send, Zap, AlertCircle, CheckCircle, GitBranch, Package, Calendar, Tag } from 'lucide-react'
import { Button, MultiSelect, LoadingSpinner, Input } from '@/components/ui'
import ApprovalDialog, { ApprovalRequest } from '@/components/ApprovalDialog'
import WorkflowProgress from '@/components/WorkflowProgress'
import BranchNamingHelper from '@/components/BranchNamingHelper'
import { useRepositories } from '@/context'
import { useChat } from '@/hooks'
import useApproval from '@/hooks/useApproval'
import { formatRelativeTime } from '@/utils'
import { SelectOption } from '@/types'

// Helper function to format streaming content with better HTML formatting
const formatStreamingContent = (content: string): string => {
  return content
    // Convert **text** to <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert bullet points
    .replace(/^[\s]*[•·]\s*/gm, '<span class="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>')
    // Convert emoji indicators to styled badges
    .replace(/^(🚀|🎫|🌳|🔀|👤|🌿|📝|🏷️|🔄|📚|🎉)/gm, '<span class="inline-block text-lg mr-2">$1</span>')
    // Convert step headers
    .replace(/^(\*\*Step \d+:.*?\*\*)$/gm, '<div class="font-semibold text-blue-700 mb-2 pb-1 border-b border-blue-200">$1</div>')
    // Convert repository names to badges
    .replace(/📁 ([^:]+):/g, '<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 mr-2">📁 $1</span>:')
    // Convert URLs to links
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    // Convert newlines to HTML breaks
    .replace(/\n/g, '<br>')
}

// Repository status indicators
interface RepositoryStatus {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  currentStep?: string
  completedSteps: string[]
}

// Release form data interface
interface ReleaseFormData {
  releaseType: 'release' | 'hotfix'
  sprintName: string
  fixVersion: string
  description: string
}

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState('')
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null)
  const [pendingApproval, setPendingApproval] = useState<ApprovalRequest | null>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false)
  
  // Structured release context state
  const [releaseForm, setReleaseForm] = useState<ReleaseFormData>({
    releaseType: 'release',
    sprintName: '',
    fixVersion: '',
    description: ''
  })
  
  // Repository status tracking
  const [repositoryStatuses, setRepositoryStatuses] = useState<RepositoryStatus[]>([])
  
  const { repositories, selectedRepositories, setSelectedRepositories, loading: repoLoading } = useRepositories()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  
  const {
    pendingApprovals,
    submitApproval,
    getWorkflowApproval,
    refreshApprovals,
    error: approvalError,
  } = useApproval()
  
  const {
    messages,
    isStreaming,
    currentStreamMessage,
    connectionStatus,
    retryCount,
    sendMessage,
    clearMessages,
  } = useChat({
    sessionId: 'main-session',
    onError: (error) => {
      console.error('Chat error:', error)
    },
    onWorkflowEvent: (event) => {
      // Handle workflow events, including approval requirements
      if (event.workflow_id) {
        setCurrentWorkflowId(event.workflow_id)
      }
      
      // Update repository status based on workflow events
      if (event.step && event.data?.repository_id && event.status) {
        updateRepositoryStatus(event.data.repository_id, event.status, event.step)
      }
      
      // Check if this step requires approval
      if (event.step === 'human_approval' && event.status === 'running') {
        checkForPendingApproval(currentWorkflowId || event.workflow_id || null)
      }
    }
  })

  // Update repository status
  const updateRepositoryStatus = (repoId: string, status: string, step?: string) => {
    setRepositoryStatuses(prev => {
      const existing = prev.find(s => s.id === repoId)
      const repo = repositories.find(r => r.id === repoId)
      
      if (!existing && repo) {
        return [...prev, {
          id: repoId,
          name: repo.name,
          status: status as 'pending' | 'in_progress' | 'completed' | 'error',
          currentStep: step,
          completedSteps: step && status === 'completed' ? [step] : []
        }]
      }
      
      return prev.map(s => {
        if (s.id === repoId) {
          const completedSteps = step && status === 'completed' 
            ? [...s.completedSteps.filter(cs => cs !== step), step]
            : s.completedSteps
          
          return {
            ...s,
            status: status as 'pending' | 'in_progress' | 'completed' | 'error',
            currentStep: step,
            completedSteps
          }
        }
        return s
      })
    })
  }

  // Initialize repository statuses when repositories are selected
  useEffect(() => {
    const newStatuses = selectedRepositories
      .map(repoId => {
        const repo = repositories.find(r => r.id === repoId)
        const existing = repositoryStatuses.find(s => s.id === repoId)
        
        if (repo && !existing) {
          return {
            id: repoId,
            name: repo.name,
            status: 'pending' as const,
            completedSteps: []
          }
        }
        return existing
      })
      .filter(Boolean) as RepositoryStatus[]
    
    setRepositoryStatuses(newStatuses)
  }, [selectedRepositories, repositories])

  // Check for pending approvals when workflow ID changes
  const checkForPendingApproval = async (workflowId: string | null) => {
    if (!workflowId) return
    
    try {
      const approval = await getWorkflowApproval(workflowId)
      if (approval && !approval.is_expired) {
        setPendingApproval(approval)
        setShowApprovalDialog(true)
      }
    } catch (error) {
      console.error('Error checking for pending approval:', error)
    }
  }

  // Handle approval decision
  const handleApprovalDecision = async (approved: boolean, notes: string) => {
    if (!pendingApproval) return

    setIsSubmittingApproval(true)
    try {
      await submitApproval({
        workflow_id: pendingApproval.workflow_id,
        approved,
        notes,
        user_id: 'user'
      })
      
      setPendingApproval(null)
      setShowApprovalDialog(false)
      
      // Refresh the chat to see workflow continuation
      await refreshApprovals()
    } catch (error) {
      console.error('Error submitting approval:', error)
      // Don't close dialog on error, let user retry
    } finally {
      setIsSubmittingApproval(false)
    }
  }

  // Auto-scroll to bottom when new messages arrive or when streaming
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }

    // Scroll when messages change or when streaming
    scrollToBottom()
  }, [messages, currentStreamMessage, isStreaming])

  // Check for pending approvals when component mounts or pending approvals change
  useEffect(() => {
    if (currentWorkflowId && pendingApprovals.length > 0) {
      const workflowApproval = pendingApprovals.find(
        approval => approval.workflow_id === currentWorkflowId
      )
      if (workflowApproval && !workflowApproval.is_expired) {
        setPendingApproval(workflowApproval)
        setShowApprovalDialog(true)
      }
    }
  }, [currentWorkflowId, pendingApprovals])

  // Monitor current streaming message for approval keywords
  useEffect(() => {
    if (currentStreamMessage && currentStreamMessage.includes('Human Approval Required')) {
      // Give the backend a moment to create the approval checkpoint
      setTimeout(() => {
        if (currentWorkflowId) {
          checkForPendingApproval(currentWorkflowId)
        }
      }, 2000)
    }
  }, [currentStreamMessage, currentWorkflowId])

  // Initialize with welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      // This will be handled by the useChat hook's initial state
    }
  }, [])

  const repositoryOptions: SelectOption[] = repositories.map(repo => ({
    value: repo.id,
    label: repo.name,
    disabled: false,
  }))

  const getContextualMessage = (userMessage: string, form: ReleaseFormData): string => {
    // If form has required fields filled, include context
    if (form.sprintName.trim() && form.fixVersion.trim()) {
      return `${userMessage}

Release Context:
- Release Type: ${form.releaseType.toUpperCase()}
- Sprint Name: ${form.sprintName}
- Fix Version: ${form.fixVersion}
${form.description ? `- Description: ${form.description}` : ''}

Selected Repositories: ${selectedRepositories.map(id => 
  repositories.find(r => r.id === id)?.name || id
).join(', ')}`
    }
    
    // Otherwise just return the user message
    return userMessage
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    if (selectedRepositories.length === 0) {
      alert('Please select at least one repository before sending a message.')
      return
    }

    // Combine user message with structured context
    const messageContent = getContextualMessage(message, releaseForm)

    // Reset repository statuses when starting a new workflow
    setRepositoryStatuses(selectedRepositories.map(repoId => {
      const repo = repositories.find(r => r.id === repoId)!
      return {
        id: repoId,
        name: repo.name,
        status: 'pending' as const,
        completedSteps: []
      }
    }))

    await sendMessage(messageContent, selectedRepositories, releaseForm)
    setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const isFormValid = message.trim()

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Project Enigma</h1>
            <p className="text-gray-600">AI-powered release documentation automation</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Approval Status Indicator */}
            {pendingApproval && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApprovalDialog(true)}
                  className="text-orange-600 border-orange-200 hover:bg-orange-50"
                >
                  <CheckCircle size={14} className="mr-1" />
                  Approval Required
                </Button>
              </div>
            )}
            
            {/* Connection Status Indicator */}
            {isStreaming && (
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' :
                  connectionStatus === 'reconnecting' ? 'bg-yellow-500 animate-pulse' :
                  'bg-red-500'
                }`}></div>
                <span className={`font-medium ${
                  connectionStatus === 'connected' ? 'text-green-600' :
                  connectionStatus === 'reconnecting' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {connectionStatus === 'connected' ? 'Connected' :
                   connectionStatus === 'reconnecting' ? 'Reconnecting...' :
                   'Disconnected'}
                </span>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={messages.length === 0}
            >
              Clear Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Repository Selection */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 min-w-0">
            Repositories:
          </label>
          <div className="flex-1">
            {repoLoading ? (
              <div className="flex items-center space-x-2 py-2">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-gray-500">Loading repositories...</span>
              </div>
            ) : (
              <MultiSelect
                options={repositoryOptions}
                value={selectedRepositories}
                onChange={setSelectedRepositories}
                placeholder="Select repositories to include in this workflow..."
                maxDisplayed={2}
              />
            )}
          </div>
          {selectedRepositories.length > 0 && (
            <div className="flex items-center text-sm text-green-600">
              <Zap size={14} className="mr-1" />
              {selectedRepositories.length} selected
            </div>
          )}
        </div>
      </div>

      {/* Repository Status Dashboard */}
      <WorkflowProgress repositories={repositoryStatuses} />

      {/* Release Context Form */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xs font-semibold text-gray-800 mb-2">Release Context</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Package size={12} className="inline mr-1" />
                  Type
                </label>
                <select
                  value={releaseForm.releaseType}
                  onChange={(e) => setReleaseForm(prev => ({ ...prev, releaseType: e.target.value as 'release' | 'hotfix' }))}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  disabled={isStreaming}
                >
                  <option value="release">Release</option>
                  <option value="hotfix">Hotfix</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <GitBranch size={12} className="inline mr-1" />
                  Sprint Name
                </label>
                <input
                  type="text"
                  value={releaseForm.sprintName}
                  onChange={(e) => setReleaseForm(prev => ({ ...prev, sprintName: e.target.value }))}
                  placeholder="sprint-2024-01"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  disabled={isStreaming}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Tag size={12} className="inline mr-1" />
                  Fix Version
                </label>
                <input
                  type="text"
                  value={releaseForm.fixVersion}
                  onChange={(e) => setReleaseForm(prev => ({ ...prev, fixVersion: e.target.value }))}
                  placeholder="v2.1.0"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  disabled={isStreaming}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Calendar size={12} className="inline mr-1" />
                  Description
                </label>
                <input
                  type="text"
                  value={releaseForm.description}
                  onChange={(e) => setReleaseForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional notes..."
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                  disabled={isStreaming}
                />
              </div>
            </div>

            {/* Compact Branch Naming Helper */}
            {(releaseForm.sprintName || releaseForm.fixVersion) && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                <div className="flex items-center space-x-1 mb-1">
                  <GitBranch size={10} className="text-blue-600" />
                  <span className="font-medium text-blue-800">Expected branches:</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Feature:</span>
                    <div className="font-mono text-blue-700">feature/PROJ-123</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Sprint:</span>
                    <div className="font-mono text-blue-700">{releaseForm.sprintName || 'sprint-2024-01'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Release:</span>
                    <div className="font-mono text-blue-700">release/{releaseForm.fixVersion || 'v2.1.0'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Rollback:</span>
                    <div className="font-mono text-blue-700">rollback/v-{releaseForm.fixVersion || '2.1.0'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages Window */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth chat-scrollbar bg-white"
        style={{
          scrollBehavior: 'smooth'
        }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to Start
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              Fill in your release context above, then chat with me below to automate your release documentation.
            </p>
            <div className="text-sm text-gray-500">
              <p>💬 Type your request in the chat box below</p>
              <p>🚀 I'll help you with the entire workflow</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-lg px-4 py-3 ${
                  msg.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 shadow-sm'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  {msg.type === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div 
                      className="text-sm whitespace-pre-wrap markdown-content"
                      dangerouslySetInnerHTML={{
                        __html: formatStreamingContent(msg.content)
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${
                    msg.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {formatRelativeTime(msg.timestamp)}
                  </p>
                  {msg.status === 'error' && (
                    <AlertCircle size={14} className="text-red-500" />
                  )}
                  {msg.status === 'sending' && (
                    <LoadingSpinner size="sm" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Current streaming message */}
        {isStreaming && currentStreamMessage && (
          <div className="flex justify-start">
            <div className="max-w-3xl rounded-lg px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-gray-900 shadow-sm">
              <div className="prose prose-sm max-w-none">
                <div 
                  className="text-sm whitespace-pre-wrap markdown-content"
                  dangerouslySetInnerHTML={{
                    __html: formatStreamingContent(currentStreamMessage)
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span className="text-xs text-blue-600 font-medium">
                    {connectionStatus === 'reconnecting' 
                      ? `Reconnecting... (${retryCount}/3)` 
                      : 'AI is responding...'
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-dot"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-dot"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible element for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chat with AI
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me to create release documentation, or tell me what you'd like to do... (e.g., 'Create release documentation' or 'Help me with the workflow')"
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                disabled={isStreaming}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!isFormValid || selectedRepositories.length === 0 || isStreaming}
              loading={isStreaming}
              icon={<Send size={16} />}
              className="px-6 relative"
            >
              {isStreaming ? 'Generating...' : 'Send'}
            </Button>
          </div>
          
          {selectedRepositories.length === 0 && (
            <p className="text-xs text-amber-600 mt-2 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              Please select at least one repository to proceed
            </p>
          )}
        </div>
      </div>

      {/* Approval Dialog */}
      <ApprovalDialog
        isOpen={showApprovalDialog}
        onClose={() => setShowApprovalDialog(false)}
        approval={pendingApproval}
        onApprove={handleApprovalDecision}
        isSubmitting={isSubmittingApproval}
      />

      {/* Approval Error Display */}
      {approvalError && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} />
            <span className="text-sm">{approvalError}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatPage