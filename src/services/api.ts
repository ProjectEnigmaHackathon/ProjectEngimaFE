import { Repository, ChatRequest, ApiResponse, ChatResponse } from '@/types'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api'

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error('API request failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Repository API
export const repositoryApi = {
  // Get all repositories
  async getAll(): Promise<ApiResponse<Repository[]>> {
    return apiRequest<Repository[]>('/repositories')
  },

  // Create new repository
  async create(repository: Omit<Repository, 'id'>): Promise<ApiResponse<Repository>> {
    return apiRequest<Repository>('/repositories', {
      method: 'POST',
      body: JSON.stringify(repository),
    })
  },

  // Update repository
  async update(id: string, repository: Partial<Repository>): Promise<ApiResponse<Repository>> {
    return apiRequest<Repository>(`/repositories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(repository),
    })
  },

  // Delete repository
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/repositories/${id}`, {
      method: "DELETE",
    });
  },
};

// CopilotKit-compatible chat API  
export const chatApi = {
  // Send chat message with optional release parameters
  async sendMessage(request: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    return apiRequest<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  // Get chat history
  async getHistory(sessionId: string): Promise<ApiResponse<ChatResponse[]>> {
    return apiRequest<ChatResponse[]>(`/chat/history/${sessionId}`)
  },

  // Health check endpoint
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return apiRequest<{ status: string }>('/health')
  },
}
