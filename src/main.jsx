import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LearningProvider } from './context/LearningContext.jsx'
import { VaultProvider } from './context/VaultContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'
import { PresenceProvider } from './context/PresenceContext.jsx'
import { GamesProvider } from './context/GamesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LearningProvider>
            <VaultProvider>
              <AdminProvider>
                <PresenceProvider>
                  <GamesProvider>
                    <App />
                  </GamesProvider>
                </PresenceProvider>
              </AdminProvider>
            </VaultProvider>
          </LearningProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
