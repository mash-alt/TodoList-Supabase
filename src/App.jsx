import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/App.css'
import supabase from './supabaseClient.js'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import SignIn from '../pages/SignIn.jsx'
import Navbar from './components/Navbar.jsx'
import { ToastProvider } from './components/ToastContainer.jsx'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Set up auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Create a protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>
    if (!session) return <Navigate to="/login" replace />
    return children
  }

  return (
    <ToastProvider>
      <Router>
        <Navbar session={session} />
        <div className="container">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignIn />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  )
}

export default App
