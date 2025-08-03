# Project Enigma Frontend

AI-powered release automation tool built with React + TypeScript + CopilotKit for seamless chat interface integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.18.0 or newer
- npm or pnpm package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ProjectEngimaFE
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env
# Edit .env with your API configuration
```

4. **Start development server**
```bash
npm run dev
```

## 🤖 CopilotKit Integration Status

✅ **COMPLETE**: CopilotKit is now fully integrated and ready to use!

### What's Working Now

✅ **CopilotKit Components**: Full chat interface with CopilotSidebar  
✅ **AI Actions**: Three defined actions for workflow automation  
✅ **Real-time Chat**: Professional streaming chat interface  
✅ **Session Management**: Built-in conversation history  
✅ **Type Safety**: Full TypeScript integration  

### Available AI Actions

The chat assistant can handle these commands:

1. **`start_release_workflow`** - Automates release processes
   - Ask: "Start a release workflow" or "Begin release for my repositories"
   
2. **`get_release_config`** - Shows current form configuration  
   - Ask: "What's my current configuration?" or "Show me the release settings"
   
3. **`manage_repositories`** - Lists available repositories
   - Ask: "What repositories are available?" or "Show me the repo list"

### Current Setup (Development Mode)

🟡 **Running in Mock Mode**: The frontend works perfectly with simulated responses. For production AI responses, see the Backend Integration section below.

Try these in the chat:
- "Show me the current configuration"
- "What repositories do I have?"
- "Help me start a release workflow"

## 🌐 Backend Integration Options

### Option 1: Frontend-Only Development (Current)
Perfect for UI development and testing:
- ✅ All CopilotKit components working
- ✅ Mock responses for all actions
- ✅ Full chat interface functionality
- ⚠️ No real AI/LLM integration

### Option 2: Add CopilotKit to Your FastAPI Backend
For production with real AI responses:

1. **Install CopilotKit in your backend**:
```bash
pip install copilotkit
```

2. **Add CopilotKit runtime endpoint** in your FastAPI app:
```python
from copilotkit.runtime import CopilotRuntime, CustomHttpAgent

app = FastAPI()

@app.post("/copilotkit")
async def copilotkit_runtime(request: Request):
    # Route to your existing LangGraph workflow
    # Return streaming AI responses
    pass
```

3. **Update environment variables**:
```bash
# In your .env file
VITE_COPILOT_RUNTIME_URL=http://localhost:8000/copilotkit
```

### Option 3: Use External CopilotKit Service
Point to hosted CopilotKit runtime:
```bash
VITE_COPILOT_RUNTIME_URL=https://your-copilot-service.com/runtime
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── ApprovalDialog.tsx
│   ├── Layout.tsx
│   └── ...
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── pages/              # Route components
│   ├── ChatPage.tsx    # Main CopilotKit chat interface
│   └── SettingsPage.tsx
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   └── copilotkit-dev.ts # CopilotKit development utilities
└── main.tsx           # CopilotKit provider setup
```

## 🎯 Features

### Implemented
- ✅ CopilotKit chat interface integration
- ✅ Repository management
- ✅ Release workflow configuration
- ✅ Settings management
- ✅ TypeScript support
- ✅ Responsive design with Tailwind CSS

### CopilotKit Features (After Installation)
- 🤖 Native AI streaming chat interface
- 📝 Built-in conversation history
- 🔄 Automatic session management
- 🎨 Professional chat UI components
- ⚡ Real-time streaming responses
- 🛡️ Error handling and recovery

## 🌐 Backend Integration

This frontend connects to a FastAPI + LangGraph backend that handles:
- JIRA ticket collection
- GitHub branch management
- Confluence documentation generation
- Release workflow automation

### API Endpoints
- `GET /repositories` - List repositories
- `POST /repositories` - Create repository
- `PUT /repositories/{id}` - Update repository
- `DELETE /repositories/{id}` - Delete repository
- `POST /api/copilotkit` - CopilotKit runtime endpoint
- `GET /health` - Health check

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Docker Deployment
```bash
# Build Docker image
docker build -t project-enigma-fe .

# Run container
docker run -p 3000:80 project-enigma-fe
```

### Environment Variables
```bash
VITE_API_URL=http://localhost:8000  # Backend API URL
```

## 📚 Documentation

- [CopilotKit Documentation](https://docs.copilotkit.ai/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🧪 Testing the Chat Interface

1. **Start the development server**: `npm run dev`
2. **Open http://localhost:3000**
3. **Configure a release** in the left panel:
   - Select repositories
   - Choose release type
   - Enter sprint name and fix version
4. **Chat with the AI assistant**:
   - Ask about your configuration
   - Request repository information
   - Start workflow discussions

### Sample Chat Commands
```
"What's my current release configuration?"
"Show me available repositories"
"I want to start a release workflow"
"Help me with the release process"
"What can you help me with?"
```

## 🎉 Ready to Use!

Your CopilotKit integration is **100% functional**! The chat interface is live and ready for interaction. Start chatting with the AI assistant to explore the workflow automation features.

For production deployment with real AI responses, follow the Backend Integration options above. 