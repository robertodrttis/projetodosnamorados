import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { SiteConfigProvider } from './context/SiteConfigContext'
import './styles/global.css'
import './screens/builder.css'
import './screens/screens.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteConfigProvider>
      <App />
    </SiteConfigProvider>
  </StrictMode>,
)
