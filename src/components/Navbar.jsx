import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'

const Navbar = ({ session }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Todo App</Link>
      </div>
      <div className="nav-links">
        {session ? (
          <>
            <span>Hello, {session.user.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
