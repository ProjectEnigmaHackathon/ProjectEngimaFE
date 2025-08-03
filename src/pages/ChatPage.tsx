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
  ChevronUp,
  Bot,
  Lightbulb,
  Code,
  Zap
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

  const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
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

  // Auto-scroll to bottom when new messages arrive (but not during streaming updates)
  useEffect(() => {
    // Only auto-scroll when messages length changes (new messages added)
    // Don't scroll during streaming content updates
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && !lastMessage.streaming) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else if (messages.length > 0 && !messages.some(m => m.streaming)) {
      // Scroll when no messages are currently streaming
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length]) // Only depend on messages.length, not messages content

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

  // Suggested prompts
  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt)
    inputRef.current?.focus()
  }

  const suggestedPrompts = useReleaseMode ? [
    {
      icon: <GitBranch className="w-5 h-5" />,
      title: "Release Planning",
      description: "Help me plan the next release",
      prompt: "Help me plan the next release for my repositories"
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Code Review",
      description: "Review my recent changes",
      prompt: "Can you review the recent changes in my repositories?"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Deployment",
      description: "Guide me through deployment",
      prompt: "Guide me through the deployment process for this release"
    }
  ] : [
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Get Started",
      description: "How can I use this assistant?",
      prompt: "How can I use this assistant to help with my development workflow?"
    },
    {
      icon: <Rocket className="w-5 h-5" />,
      title: "Release Mode",
      description: "What is Release Mode?",
      prompt: "What is Release Mode and how does it work?"
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Best Practices",
      description: "Development best practices",
      prompt: "What are some development and release best practices you can recommend?"
    }
  ]

  return (
    <div className="h-screen w-full relative overflow-hidden flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Futuristic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 animate-pulse"></div>
        
        {/* Geometric Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-40 right-32 w-48 h-48 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl animate-ping"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-xl animate-bounce"></div>
      </div>
              {/* Header */}
        <div className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20 px-6 py-2 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Project Enigma</h1>
              <p className="text-sm text-gray-200">AI-Powered Release Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">Mode:</span>
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
                className="text-white hover:text-gray-200"
              >
                <Settings2 className="w-4 h-4 mr-1" />
                {showReleasePanel ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
              </Button>
            )}
          </div>
        </div>

        {/* Release Parameters Panel */}
        {useReleaseMode && showReleasePanel && (
          <div className="mt-2 p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Repository Selection */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-white">
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
                <label className="block text-xs font-medium text-white">
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
                <label className="block text-xs font-medium text-white">
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
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
          {messages.length === 0 && (
            <div className="max-w-3xl mx-auto">
              {/* Welcome Message */}
              <div className="text-center mb-12">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  Hi! I am your assistant
                </h2>
                <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                  {useReleaseMode 
                    ? "I'm here to help you with release planning, code reviews, and deployment processes." 
                    : "I'm here to help you with development workflows, best practices, and any questions you have."
                  }
                </p>
              </div>

              {/* Suggested Prompts */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white text-center mb-6">
                  Try asking me about:
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedPrompt(prompt.prompt)}
                      className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-left"
                    >
                      <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-3 text-white group-hover:shadow-md transition-shadow">
                          {prompt.icon}
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {prompt.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {prompt.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
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
                'max-w-[80%] px-6 py-4 rounded-xl shadow-sm transition-all duration-200',
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
                  className="leading-relaxed min-h-[1.5rem]"
                  style={{ 
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: formatMessageContent(message.content || '') 
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

      {/* Chat Input - Fixed to bottom */}
      <div className="shrink-0 bg-white/10 backdrop-blur-md border-t border-white/20 shadow-lg">
        <div className="w-full max-w-4xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-center w-full">
            <div className="flex-1 min-w-0">
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
                className="h-12 text-base px-4 w-full border-white/20 bg-white/90 text-gray-900 placeholder-gray-500"
                containerClassName="w-full"
              />
            </div>
            
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              size="md"
              className="px-4 h-12 flex-shrink-0 min-w-[80px] bg-blue-600 hover:bg-blue-700"
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
            
            {/* Clear Chat Button - After send button */}
            {messages.length > 0 && (
              <Button
                onClick={clearMessages}
                variant="ghost"
                size="md"
                className="px-3 h-12 flex-shrink-0 text-white hover:text-gray-200 bg-red-500/80 hover:bg-red-600/80 border border-red-400/50"
                title="Clear chat history"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatPage