import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { FontProvider } from '@/providers/font-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="finite-ui-theme">
      <FontProvider defaultFont="jetbrains-mono" storageKey="finite-ui-font">
        <App />
      </FontProvider>
    </ThemeProvider>
  </StrictMode>,
)
