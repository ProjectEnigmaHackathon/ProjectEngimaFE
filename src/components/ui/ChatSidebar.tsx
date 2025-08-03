import React, { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle, Loader2 } from 'lucide-react'
import Button from './Button'
import Input from './Input'
import { useChat, ChatMessage } from '@/hooks/useChat'
import { clsx } from 'clsx'

interface ChatSidebarProps {
  defaultOpen?: boolean
  title?: string
  initialMessage?: string
  instructions?: string
  className?: string
  clickOutsideToClose?: boolean
  onClose?: () => void
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  defaultOpen = false,
  title = "Chat Assistant",
  initialMessage = "Hello! How can I help you today?",
  instructions = "I'm your AI assistant. Ask me anything!",
  className = "",
  clickOutsideToClose = true,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  
  const { messages, isLoading, error, sendMessage, clearMessages, addMessage } = useChat({
    apiUrl: '/api/chat',
    onError: (error) => console.error('Chat error:', error)
  })
  
  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0 && initialMessage) {
      // Add initial message without triggering API call
      setTimeout(() => {
        addMessage({
          role: 'assistant',
          content: initialMessage
        })
      }, 100)
    }
  }, [messages.length, initialMessage, addMessage])
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])
  
  // Handle click outside to close
  useEffect(() => {
    if (!clickOutsideToClose) return
    
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onClose?.()
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, clickOutsideToClose, onClose])
  
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
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      onClose?.()
    }
  }
  
  const formatMessageContent = (content: string) => {
    // Basic markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n/g, '<br />')
  }
  
  const MessageComponent: React.FC<{ message: ChatMessage }> = ({ message }) => (
    <div className={clsx(
      'flex w-full mb-4',
      message.role === 'user' ? 'justify-end' : 'justify-start'
    )}>
      <div className={clsx(
        'max-w-[80%] px-4 py-2 rounded-lg',
        message.role === 'user' 
          ? 'bg-blue-500 text-white ml-4' 
          : 'bg-gray-100 text-gray-900 mr-4'
      )}>
        {message.streaming && (
          <div className="flex items-center gap-1 mb-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-xs opacity-70">Typing...</span>
          </div>
        )}
        <div 
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: formatMessageContent(message.content) 
          }}
        />
        <div className="text-xs opacity-50 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
  
  if (!isOpen) {
    return (
      <Button
        onClick={toggleSidebar}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-blue-500 hover:bg-blue-600 text-white z-50"
        size="sm"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }
  
  return (
    <div
      ref={sidebarRef}
      className={clsx(
        'fixed right-0 top-0 h-full bg-white shadow-2xl z-40 flex flex-col',
        'w-96 border-l border-gray-200',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {title}
        </h3>
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Instructions */}
      {instructions && (
        <div className="p-3 bg-blue-50 border-b border-gray-200">
          <p className="text-sm text-blue-800">{instructions}</p>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start a conversation!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">Error: {error}</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        
        {messages.length > 0 && (
          <Button
            onClick={clearMessages}
            variant="ghost"
            size="sm"
            className="mt-2 text-xs"
          >
            Clear chat
          </Button>
        )}
      </div>
    </div>
  )
} 