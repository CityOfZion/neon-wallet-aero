import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { SentryHelper } from './helpers/SentryHelper'
import { tabRouter } from './routes/tab-router'

import '@renderer/assets/css/global.css'

chrome.runtime.connect({ name: 'tab' })

createRoot(document.getElementById('neon-root')!, SentryHelper.options).render(
  <StrictMode>
    <RouterProvider router={tabRouter} />
  </StrictMode>
)
