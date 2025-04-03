import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { setupI18next } from './libs/i18next.ts'
import { pagesRouter } from './routes/pagesRouter.tsx'

import './assets/css/global.css'

setupI18next()

createRoot(document.getElementById('neon-root')!).render(
  <StrictMode>
    <RouterProvider router={pagesRouter} />
  </StrictMode>
)
