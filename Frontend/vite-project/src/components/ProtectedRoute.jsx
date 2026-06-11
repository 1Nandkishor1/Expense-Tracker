import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import Navbar from './Navbar'

const ProtectedRoute = ({children}) => {
    let context = useContext(AuthContext)
    let{user,loading}=context;

    if(loading) {
      return (
        <div className="spinner-container">
          <div className="spinner"></div>
          <span className="spinner-text">Loading your profile...</span>
        </div>
      )
    }
    if(!user){
       return <Navigate to="/login" replace />
    }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-container">
        {children}
      </main>
    </div>
  )
}

export default ProtectedRoute