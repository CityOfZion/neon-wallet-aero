import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { SentryHelper } from './helpers/SentryHelper'
import { popupRouter } from './routes/popup-router'

import '@renderer/assets/css/styles.css'

chrome.runtime.connect({ name: 'popup' })

createRoot(document.getElementById('root')!, SentryHelper.options).render(
  <StrictMode>
    <RouterProvider router={popupRouter} />
  </StrictMode>
)
