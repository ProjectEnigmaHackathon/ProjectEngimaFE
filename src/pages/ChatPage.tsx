import React, { useState, useEffect, useRef } from 'react'
import { Button, MultiSelect, Input } from '@/components/ui'
import { repositoryApi } from '@/services/api'
import { Repository } from '@/types'
import { useChat, ReleaseParameters } from '@/hooks/useChat'
import { 
  MessageCircle, 
  Send, 
  Settings2, 
  X, 
  Loader2,
  Rocket,
  GitBranch,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { clsx } from 'clsx'

const ChatPage: React.FC = () => {
  // State for release parameters
  const [useReleaseMode, setUseReleaseMode] = useState(false)
  const [showReleasePanel, setShowReleasePanel] = useState(false)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [selectedRepositories, setSelectedRepositories] = useState<string[]>([])
  const [releaseType] = useState<'release' | 'hotfix'>('release')
  const [sprintName, setSprintName] = useState('')
  const [fixVersion, setFixVersion] = useState('')
  const [loading, setLoading] = useState(true)

  // Chat state
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Helper function to extract org/repo name from repository URL
  const getRepositoryName = (repoId: string): string => {
    const repo = repositories.find(r => r.id === repoId)
    if (!repo) return repoId
    
    // Extract org/repo from URL like https://github.com/org/repo
    try {
      const url = new URL(repo.url)
      const pathParts = url.pathname.split('/').filter(part => part.length > 0)
      if (pathParts.length >= 2) {
        return `${pathParts[0]}/${pathParts[1]}`
      }
    } catch (error) {
      console.warn('Could not parse repository URL:', repo.url)
    }
    
    // Fallback to repository name if URL parsing fails
    return repo.name
  }

  // Release parameters for chat
  const releaseParameters: ReleaseParameters | null = useReleaseMode
    ? {
        repositories: selectedRepositories.map(getRepositoryName),
        release_type: releaseType,
        sprint_name: sprintName,
        fix_version: fixVersion
      }
    : null

  const { messages, isLoading, error, sendMessage, clearMessages, addMessage } = useChat({
    apiUrl: '/chat',
    releaseParameters,
    onError: (error) => console.error('Chat error:', error)
  })

  // Load repositories on component mount
  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const response = await repositoryApi.getAll()
        if (response.success && response.data) {
          setRepositories(response.data)
        }
      } catch (error) {
        console.error('Failed to load repositories:', error)
      } finally {
        setLoading(false)
      }
    }
    loadRepositories()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])



  const repositoryOptions = repositories.map(repo => ({
    value: repo.id,
    label: repo.name,
  }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    
    const message = inputValue.trim()
    setInputValue('')
    await sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const message = inputValue.trim()
      if (message && !isLoading) {
        setInputValue('')
        sendMessage(message)
      }
    }
  }

  const formatMessageContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n/g, '<br />')
  }

  const isReleaseFormValid = selectedRepositories.length > 0 && sprintName && fixVersion

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Enigma</h1>
              <p className="text-sm text-gray-600">AI-Powered Release Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">Mode:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant={!useReleaseMode ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setUseReleaseMode(false)}
                  className="h-9"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Free Chat
                </Button>
                <Button
                  variant={useReleaseMode ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => {
                    setUseReleaseMode(true)
                    setShowReleasePanel(true)
                  }}
                  className="h-9"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Release Mode
                </Button>
              </div>
            </div>

            {/* Release Panel Toggle */}
            {useReleaseMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReleasePanel(!showReleasePanel)}
              >
                <Settings2 className="w-4 h-4 mr-1" />
                {showReleasePanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Release Parameters Panel */}
        {useReleaseMode && showReleasePanel && (
          <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReleasePanel(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 h-5 w-5 p-0"
            >
              <X className="w-3 h-3" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pr-6">
              {/* Repository Selection */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Repositories *
                </label>
                <MultiSelect
                  options={repositoryOptions}
                  value={selectedRepositories}
                  onChange={setSelectedRepositories}
                  placeholder={loading ? "Loading..." : "Select repositories"}
                  disabled={loading}
                />
              </div>

              {/* Sprint Name */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Sprint Name *
                </label>
                <Input
                  value={sprintName}
                  onChange={(e) => setSprintName(e.target.value)}
                  placeholder="e.g., Sprint-2024-01"
                  className="h-7 text-xs"
                />
              </div>

              {/* Fix Version */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Fix Version *
                </label>
                <Input
                  value={fixVersion}
                  onChange={(e) => setFixVersion(e.target.value)}
                  placeholder="e.g., v2.1.0"
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-12">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Start a conversation!</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx(
                'flex w-full',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div className={clsx(
                'max-w-[80%] px-6 py-4 rounded-xl shadow-sm',
                message.role === 'user' 
                  ? 'bg-blue-500 text-white ml-12' 
                  : 'bg-white text-gray-900 mr-12 border border-gray-200'
              )}>
                {message.streaming && (
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm opacity-70">Typing...</span>
                  </div>
                )}
                <div 
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMessageContent(message.content) 
                  }}
                />
                <div className="text-xs opacity-50 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {error && (
            <div className="max-w-4xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">Error: {error}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="w-full p-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end w-full">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                useReleaseMode 
                  ? isReleaseFormValid
                    ? "Ask about your release process..."
                    : "Configure release parameters above to get specialized assistance..."
                  : "Type your message..."
              }
              disabled={isLoading}
              className="flex-1 h-12 text-base px-4 w-full"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              size="md"
              className="px-6 h-12 flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </form>
          
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-xs">Mode:</span>
                <span className={clsx(
                  "font-medium px-2 py-0.5 rounded text-xs",
                  useReleaseMode 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-gray-100 text-gray-800"
                )}>
                  {useReleaseMode ? 'Release' : 'Free Chat'}
                </span>
              </div>
              {useReleaseMode && isReleaseFormValid && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-700 text-xs">Configured</span>
                </div>
              )}
            </div>
            
            {messages.length > 0 && (
              <Button
                onClick={clearMessages}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 text-xs h-6"
              >
                Clear chat
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage