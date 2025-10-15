import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { pagesRouter } from './routes/pagesRouter'

import '@renderer/assets/css/global.css'

createRoot(document.getElementById('neon-root')!).render(
  <StrictMode>
    <RouterProvider router={pagesRouter} />
  </StrictMode>
)
