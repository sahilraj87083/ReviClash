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

        {/* 2. SPACER: Visible on Mobile/Tablet, Hidden on Desktop
           This pushes content up so it's not hidden behind your fixed Bottom Navigation.
           Notice I changed 'md:hidden' to 'lg:hidden' to match the Footer breakpoint.
        */}
        <div className="h-16 lg:hidden"></div>
    </>
  )
}

export default Layout