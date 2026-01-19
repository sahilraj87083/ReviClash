import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import {RouterProvider} from 'react-router-dom'
import {router} from './routes/index.routes.jsx'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserContextProvider } from './contexts/UserContext.jsx'
gsap.registerPlugin(ScrollTrigger);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider  router={router}/>
    </UserContextProvider>
  </StrictMode>,
)
