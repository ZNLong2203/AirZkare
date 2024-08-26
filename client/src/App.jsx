import React, { useState, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ROUTE from './constants/Route'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))

function App() {
  return (
    <BrowserRouter>
      <div className='min-h-screen flex flex-col'>
        <Navbar />
        <Toaster />
        <main className='flex-grow'>
          <Suspense fallback={<div className='items-center justify-center text-6xl'>Loading...</div>}>
            <Routes>
              <Route path={ROUTE.HOME} element={<Home />} />
              <Route path={ROUTE.LOGIN} element={<Login />} />
              <Route path={ROUTE.REGISTER} element={<Register />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
