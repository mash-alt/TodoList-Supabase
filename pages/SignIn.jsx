import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../src/supabaseClient'

const SignIn = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  
  const navigate = useNavigate()

  const handleOAuthSignUp = async (provider) => {
    setLoading(true)
    setError(null)
    setMessage(null)
    
    try {
      console.log(`Attempting to sign up with ${provider}...`)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
             access_type: 'offline',
             prompt: 'consent',
          },
        },
      })
      
      if (error) {
        console.error(`OAuth error with ${provider}:`, error)
        throw error
      }
      
      console.log(`${provider} OAuth initiated, redirecting...`, data)
      // Supabase handles the redirect and callback
    } catch (error) {
      console.error(`Error during ${provider} OAuth:`, error)
      setError(`Failed to sign up with ${provider}: ${error.message}`)
      setLoading(false)
    }
    // Note: setLoading(false) is not called on success because the page will redirect
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    
    try {
      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      })
      
      if (authError) throw authError
      
      // If email confirmation is required
      if (authData?.user?.identities?.length === 0) {
        setMessage('Check your email for the confirmation link.')
      } else {
        // If auto-confirm is enabled, navigate to home
        navigate('/')
      }
      
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h1>Sign Up</h1>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
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
            minLength="6"
          />
        </div>
        
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="oauth-separator">
        <span>Or sign up with</span>
      </div>
      <button 
        type="button" 
        onClick={() => handleOAuthSignUp('google')} 
        disabled={loading} 
        className="oauth-button google-button"
      >
        {loading ? 'Loading...' : 'Sign up with Google'}
      </button>
      <button 
        type="button" 
        onClick={() => handleOAuthSignUp('facebook')} 
        disabled={loading} 
        className="oauth-button facebook-button"
      >
        {loading ? 'Loading...' : 'Sign up with Facebook'}
      </button>
      
      <p className="login-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  )
}

export default SignIn