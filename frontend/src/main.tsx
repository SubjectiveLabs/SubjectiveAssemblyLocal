import './index.css'
import App from 'App'
import { Agent, AgentContext } from 'backend'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AgentContext.Provider value={new Agent('/api/v1')}>
      <App />
    </AgentContext.Provider>
  </StrictMode>
)
