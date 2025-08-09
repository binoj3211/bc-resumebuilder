import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const AuthContext = createContext()

// API Base URL (Vite environment variable)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Configure Google OAuth (Vite environment variable)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id'

// Google OAuth function
const initializeGoogleSignIn = () => {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback
    })
  }
}

const handleGoogleCallback = (response) => {
  // This will be called when user signs in with Google
  console.log('Google response:', response)
}
axios.defaults.baseURL = API_BASE_URL
axios.defaults.withCredentials = true

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = Cookies.get('authToken')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Verify token is still valid
        try {
          const response = await axios.get('/auth/verify')
          if (response.data.success) {
            setUser(response.data.user)
          } else {
            logout()
          }
        } catch (error) {
          console.warn('Token verification failed:', error)
          logout()
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password })
      
      if (response.data.success) {
        const { user, token } = response.data
        
        // Store token and user data
        Cookies.set('authToken', token, { expires: 7 })
        localStorage.setItem('user', JSON.stringify(user))
        
        // Set axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Update state
        setUser(user)
        setIsAuthenticated(true)
        
        return { success: true, user }
      } else {
        return { success: false, error: response.data.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData)
      
      if (response.data.success) {
        const { user, token } = response.data
        
        // Store token and user data
        Cookies.set('authToken', token, { expires: 7 })
        localStorage.setItem('user', JSON.stringify(user))
        
        // Set axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Update state
        setUser(user)
        setIsAuthenticated(true)
        
        return { success: true, user }
      } else {
        return { success: false, error: response.data.error }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      }
    }
  }

  const googleLogin = async (credential) => {
    try {
      const response = await axios.post('/auth/google', { credential })
      
      if (response.data.success) {
        const { user, token } = response.data
        
        // Store token and user data
        Cookies.set('authToken', token, { expires: 7 })
        localStorage.setItem('user', JSON.stringify(user))
        
        // Set axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Update state
        setUser(user)
        setIsAuthenticated(true)
        
        return { success: true, user }
      } else {
        return { success: false, error: response.data.error }
      }
    } catch (error) {
      console.error('Google login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Google login failed' 
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post('/auth/logout')
    } catch (error) {
      console.warn('Logout endpoint error:', error)
    } finally {
      // Clear local data
      Cookies.remove('authToken')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      
      // Update state
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const saveResume = async (name, resumeData) => {
    try {
      const response = await axios.post('/user/resumes', { name, data: resumeData })
      return response.data.success ? 
        { success: true, resume: response.data.resume } : 
        { success: false, error: response.data.error }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to save resume' }
    }
  }

  const getResumes = async () => {
    try {
      const response = await axios.get('/user/resumes')
      return response.data.success ? 
        { success: true, resumes: response.data.resumes } : 
        { success: false, error: response.data.error }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch resumes' }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    googleLogin,
    logout,
    saveResume,
    getResumes
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
