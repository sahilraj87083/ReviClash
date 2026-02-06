import React from 'react'
import { Outlet } from 'react-router-dom'
import {Header, Footer} from './components/index.jsx'


function Layout() {
  return (
    <>
        <Header/>
        <main >
           <Outlet/>
        </main>
        <Footer/>
        <div className="h-16 md:hidden"></div>
    </>
  )
}

export default Layout