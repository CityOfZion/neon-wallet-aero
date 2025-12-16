import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { tabRouter } from './routes/tab-router'

import '@renderer/assets/css/global.css'

createRoot(document.getElementById('neon-root')!).render(
  <StrictMode>
    <RouterProvider router={tabRouter} />
  </StrictMode>
)
