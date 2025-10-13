import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Dropdowns from './dropdowns.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Dropdowns />
  </StrictMode>,
)
