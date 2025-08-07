import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

const AuthContext = createContext()

// API Base URL - Update this to your backend server URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

// Configure axios defaults
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
          await axios.get('/auth/verify')
        } catch (error) {
          console.warn('Token verification failed:', error)
          logout()
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await axios.post('/auth/login', credentials)
      const { user: userData, token } = response.data

      // Store token in cookie (httpOnly for security)
      Cookies.set('authToken', token, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData))

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setUser(userData)
      setIsAuthenticated(true)

      return { success: true, user: userData }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await axios.post('/auth/register', userData)
      const { user: newUser, token } = response.data

      // Store token in cookie
      Cookies.set('authToken', token, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(newUser))

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setUser(newUser)
      setIsAuthenticated(true)

      return { success: true, user: newUser }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async (googleData) => {
    try {
      setLoading(true)
      const response = await axios.post('/auth/google', {
        token: googleData.credential
      })
      
      const { user: userData, token } = response.data

      // Store token in cookie
      Cookies.set('authToken', token, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData))

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setUser(userData)
      setIsAuthenticated(true)

      return { success: true, user: userData }
    } catch (error) {
      const message = error.response?.data?.message || 'Google login failed'
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Remove token and user data
    Cookies.remove('authToken')
    localStorage.removeItem('user')
    
    // Clear axios default header
    delete axios.defaults.headers.common['Authorization']
    
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  // Save resume data to user account
  const saveResumeData = async (resumeData) => {
    try {
      const response = await axios.post('/resumes', {
        data: resumeData,
        name: resumeData.personalInfo?.fullName || 'Untitled Resume'
      })
      return { success: true, resume: response.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save resume'
      return { success: false, error: message }
    }
  }

  // Load user's resumes
  const loadUserResumes = async () => {
    try {
      const response = await axios.get('/resumes')
      return { success: true, resumes: response.data }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load resumes'
      return { success: false, error: message }
    }
  }

  // Delete a resume
  const deleteResume = async (resumeId) => {
    try {
      await axios.delete(`/resumes/${resumeId}`)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete resume'
      return { success: false, error: message }
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
    updateUser,
    saveResumeData,
    loadUserResumes,
    deleteResume
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
