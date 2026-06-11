import React from 'react'
import { RouterProvider } from "react-router-dom";
import routes from './Router'
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
    <RouterProvider router={routes} />
    </AuthProvider>
  )
}

export default App