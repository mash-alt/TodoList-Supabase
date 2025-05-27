import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      // If successful, navigate to home
      navigate('/')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  const handleOAuthLogin = async (provider) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log(`Attempting to sign in with ${provider}...`)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`, // Ensure it ends with a slash
          queryParams: {
            // You can add provider-specific parameters here if needed
            // For example, for Google:
            // access_type: 'offline', // Gets refresh token
            // prompt: 'consent',
          },
        },
      })
      
      if (error) {
        console.error(`OAuth error with ${provider}:`, error)
        throw error
      }
      
      console.log(`${provider} OAuth initiated, redirecting...`, data)
      // No need to navigate - Supabase handles the redirect and callback
    } catch (error) {
      console.error(`Error during ${provider} OAuth:`, error)
      setError(`Failed to login with ${provider}: ${error.message}`)
      setLoading(false)
    }
    // Note: setLoading(false) is not called on success because the page will redirect
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <div className="oauth-separator">
        <span>Or continue with</span>
      </div>
      <button 
        type="button" 
        onClick={() => handleOAuthLogin('google')} 
        disabled={loading} 
        className="oauth-button google-button"
      >
        {loading ? 'Loading...' : 'Login with Google'}
      </button>
      <button 
        type="button" 
        onClick={() => handleOAuthLogin('facebook')} 
        disabled={loading} 
        className="oauth-button facebook-button"
      >
        {loading ? 'Loading...' : 'Login with Facebook'}
      </button>
      
      <p className="signup-link">
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  )
}

export default Login