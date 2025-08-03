import { useState, useCallback, useRef, useEffect } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  streaming?: boolean
}

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  isConnected: boolean
}

export interface ReleaseParameters {
  repositories: string[]
  release_type: 'release' | 'hotfix'
  sprint_name: string
  fix_version: string
}

export interface UseChatOptions {
  apiUrl?: string
  onMessage?: (message: ChatMessage) => void
  onError?: (error: string) => void
  releaseParameters?: ReleaseParameters | null
}

export function useChat(options: UseChatOptions = {}) {
  const { apiUrl = '/api/chat/', onMessage, onError, releaseParameters } = options
  const API_BASE_URL = `${(import.meta as any).env?.VITE_API_URL}/api`
  
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    isConnected: true
  })
  
  const abortControllerRef = useRef<AbortController | null>(null)
  
  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }))
    
    onMessage?.(newMessage)
    return newMessage
  }, [onMessage])
  
  const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    setState(prev => {
      const existingMessage = prev.messages.find(msg => msg.id === id)
      // Only update if content has actually changed or streaming status changed
      if (existingMessage && 
          existingMessage.content === updates.content && 
          existingMessage.streaming === updates.streaming) {
        return prev
      }
      
      return {
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === id ? { ...msg, ...updates } : msg
        )
      }
    })
  }, [])
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return
    
    // Add user message
    addMessage({ role: 'user', content: content.trim() })
    
    // Add placeholder assistant message for streaming
    const assistantMessage = addMessage({ 
      role: 'assistant', 
      content: '', 
      streaming: true 
    })
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    // Poll messages from workflow endpoint
    const pollWorkflowMessages = async (workflowId: string, messageId: string) => {
      let processedMessageCount = 0
      let accumulatedContent = ''
      let consecutiveErrors = 0
      const maxConsecutiveErrors = 5
      let lastUpdateTime = 0
      const updateThrottle = 500 // Update UI every 500ms max
      
      while (true) {
        try {
          // Check if request was aborted
          if (abortControllerRef.current?.signal.aborted) {
            console.log('Polling aborted by user')
            break
          }
          
          const response = await fetch(`${API_BASE_URL}/chat/status/${workflowId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: abortControllerRef.current?.signal
          })
          
          if (!response.ok) {
            throw new Error(`Status error! status: ${response.status}`)
          }
          
          const data = await response.json()
          console.log('Workflow status:', data)
          
          // Reset error counter on successful fetch
          consecutiveErrors = 0
          
          // Process new messages
          if (data.messages && Array.isArray(data.messages)) {
            const newMessages = data.messages.slice(processedMessageCount)
            for (const message of newMessages) {
              // Only append AI messages and relevant tool messages to the chat
              if (message.type === 'AIMessage' || 
                  (message.type === 'ToolMessage' && message.content)) {
                if (message.content) {
                  // For ToolMessage, try to parse and format the content
                  let content = message.content
                  if (message.type === 'ToolMessage') {
                    try {
                      const parsed = JSON.parse(content)
                      // Format tool message content nicely if possible
                      if (parsed.error) {
                        content = `Error: ${parsed.error}`
                      } else if (parsed.found === false) {
                        content = 'Resource not found'
                      }
                    } catch {
                      // Keep original content if parsing fails
                    }
                  }
                  
                  accumulatedContent += content + '\n\n'
                }
              }
            }
            
            processedMessageCount = data.messages.length
            
            // Throttle UI updates to reduce flickering
            const currentTime = Date.now()
            if (accumulatedContent.trim() && (currentTime - lastUpdateTime > updateThrottle)) {
              updateMessage(messageId, { content: accumulatedContent.trim() })
              lastUpdateTime = currentTime
            }
          }
          
          // Check if workflow is definitely complete
          // Only exit when status is explicitly completed/failed AND is_running is false
          if ((data.status === 'completed' || data.status === 'failed') && data.is_running === false) {
            // Make sure to update with final content when streaming ends
            updateMessage(messageId, { 
              content: accumulatedContent.trim() || 'No response received',
              streaming: false 
            })
            console.log('Workflow completed with status:', data.status)
            break // Exit the polling loop
          }
          
          // Always wait between polls to prevent overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 2000))
          
        } catch (error) {
          consecutiveErrors++
          console.error(`Polling error (${consecutiveErrors}/${maxConsecutiveErrors}):`, error)
          
                     // If we hit too many consecutive errors, stop polling
           if (consecutiveErrors >= maxConsecutiveErrors) {
             console.error('Too many consecutive errors, stopping polling')
             updateMessage(messageId, { 
               content: accumulatedContent.trim() || 'Error: Failed to poll workflow messages after multiple attempts',
               streaming: false 
             })
             break
           }
          
          // If it's an abort error, stop immediately
          if (error instanceof Error && error.name === 'AbortError') {
            console.log('Polling aborted')
            break
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 3000))
        }
      }
    }
    
    try {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      abortControllerRef.current = new AbortController()
      
      // Prepare payload
      const payload: any = {
        message: content,
        session_id: crypto.randomUUID(), // Generate session ID for tracking
      }
      
      // Add release parameters if they exist
      if (releaseParameters) {
        payload.repositories = releaseParameters.repositories
        payload.release_type = releaseParameters.release_type
        payload.sprint_name = releaseParameters.sprint_name
        payload.fix_version = releaseParameters.fix_version
      }
      
      console.log('Sending chat request:', payload) // Debug log
      
      const response = await fetch(`${API_BASE_URL}${apiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Get initial response with workflow_id
      const initialData = await response.json()
      console.log('Initial chat response:', initialData)
      
      // Extract workflow_id
      const workflowId = initialData.data?.workflow_id
      
      if (workflowId) {
        // Start polling from workflow endpoint
        await pollWorkflowMessages(workflowId, assistantMessage.id)
      } else {
        // Fallback to direct message
        updateMessage(assistantMessage.id, { 
          content: initialData.message || 'No response received',
          streaming: false 
        })
      }
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled
        return
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setState(prev => ({ ...prev, error: errorMessage }))
      onError?.(errorMessage)
      
      // Update the assistant message with error
      updateMessage(assistantMessage.id, { 
        content: `Error: ${errorMessage}`,
        streaming: false 
      })
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
      abortControllerRef.current = null
    }
  }, [state.messages, state.isLoading, apiUrl, addMessage, updateMessage, onError, releaseParameters, API_BASE_URL])
  
  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }))
  }, [])
  
  const stopOperation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])
  
  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    isConnected: state.isConnected,
    sendMessage,
    clearMessages,
    stopOperation,
    addMessage
  }
} 