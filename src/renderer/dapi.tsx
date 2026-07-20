import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { dapiRouter } from './routes/dapi-router'

import '@renderer/assets/css/styles.css'

chrome.runtime.connect({ name: 'dapi' })

createRoot(document.getElementById('neon-root')!).render(
  <StrictMode>
    <RouterProvider router={dapiRouter} />
  </StrictMode>
)
