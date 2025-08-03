import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import App from './App.tsx'
import './index.css'

// Debug logging
console.log('Main.tsx: Starting app initialization')
console.log('Main.tsx: Current URL:', window.location.href)
console.log('Main.tsx: Base URL:', window.location.origin)

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Main.tsx: Root element not found!')
  throw new Error('Root element not found')
}

console.log('Main.tsx: Root element found, creating React app')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)

console.log('Main.tsx: React app rendered successfully')