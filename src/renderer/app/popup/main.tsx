import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { setupI18next } from '@renderer/libs/i18next'

import { pagesRouter } from './routes/pagesRouter'

import '@renderer/assets/css/global.css'

setupI18next()

createRoot(document.getElementById('neon-root')!).render(
  <StrictMode>
    <RouterProvider router={pagesRouter} />
  </StrictMode>
)
