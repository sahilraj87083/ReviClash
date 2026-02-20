import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header, Footer } from './components/index.jsx'

function Layout() {
  return (
    <>
        <Header/>
        
        <main>
           <Outlet/>
        </main>

        {/* 1. FOOTER: Hidden on Mobile/Tablet, Visible on Large Screens (lg) 
           This container wraps the Footer and controls its visibility from the outside.
        */}
        <div className="hidden lg:block">
            <Footer/>
        </div>
    </>
  )
}

export default Layout