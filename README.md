# Project Enigma Frontend

AI-powered release documentation automation frontend built with React, TypeScript, and Vite.

## 🚀 Features

- **Interactive Chat Interface**: Real-time AI-powered conversation for release documentation
- **Repository Management**: Multi-repository selection and management
- **Workflow Progress Tracking**: Visual progress indicators for ongoing workflows
- **Human Approval System**: Built-in approval workflow for sensitive operations
- **Branch Naming Helper**: Interactive branch naming convention guidance
- **Real-time Streaming**: Server-sent events for live workflow updates
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom hooks

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- Backend API server running (default: http://localhost:8000)

## 🏃‍♂️ Quick Start

### Development Mode

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:3002

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment

```bash
# Development
docker build --target development -t project-enigma-frontend:dev .
docker run -p 3002:3000 project-enigma-frontend:dev

# Production
docker build --target production -t project-enigma-frontend:prod .
docker run -p 80:80 project-enigma-frontend:prod
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components
│   ├── ApprovalDialog.tsx
│   ├── BranchNamingHelper.tsx
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx
│   └── WorkflowProgress.tsx
├── context/             # React Context providers
│   ├── AppContext.tsx
│   └── RepositoryContext.tsx
├── hooks/               # Custom React hooks
│   ├── useApi.ts
│   ├── useApproval.ts
│   ├── useChat.ts
│   └── useLocalStorage.ts
├── pages/               # Page components
│   ├── ChatPage.tsx
│   └── SettingsPage.tsx
├── services/            # API services
│   └── api.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── index.ts
├── App.tsx              # Main app component
└── main.tsx            # Application entry point
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
```

### API Configuration

The frontend expects the backend API to be running on `http://localhost:8000` by default. You can change this in:

1. `vite.config.ts` - proxy configuration for development
2. `src/services/api.ts` - API base URL for production

## 🔌 Backend Integration

This frontend is designed to work with the Project Enigma backend API. Required endpoints:

- `GET /api/repositories` - Repository management
- `POST /api/chat/stream` - Chat streaming
- `GET /api/workflow/{id}/approval` - Approval management
- `POST /api/workflow/approval` - Approval submission

## 📱 Key Components

### Chat Interface (`ChatPage.tsx`)
- Real-time AI conversation
- Repository selection
- Release context forms
- Workflow progress tracking

### Workflow Progress (`WorkflowProgress.tsx`)
- Visual workflow status tracking
- Step-by-step progress indicators
- Error state handling

### Branch Naming Helper (`BranchNamingHelper.tsx`)
- Interactive branch naming guidance
- Pattern validation
- Convention enforcement

### Approval System (`ApprovalDialog.tsx`)
- Human approval workflow
- Context-aware decision making
- Notes and feedback collection

## 🚀 Deployment

### Docker Compose (Recommended)

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      target: production
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:8000
    depends_on:
      - backend
```

### Manual Deployment

1. Build the project: `npm run build`
2. Serve the `dist` folder using any static file server
3. Configure reverse proxy for API calls

## 🛠️ Development

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check
```

### Hot Reloading

The development server supports hot module replacement (HMR) for fast development cycles.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is part of Project Enigma. See the main repository for license information.

## 🔗 Related Projects

- [Project Enigma Backend](https://github.com/ProjectEnigmaHackathon/ProjectEnigma) - Backend API server
- [Project Enigma Main](https://github.com/ProjectEnigmaHackathon/ProjectEnigma) - Main project repository 