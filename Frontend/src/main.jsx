import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'remixicon/fonts/remixicon.css'
import {RouterProvider} from 'react-router-dom'
import {router} from './routes/index.routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider  router={router}/>
  </StrictMode>,
)
