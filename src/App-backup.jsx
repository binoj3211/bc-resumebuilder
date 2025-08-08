import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

// Configure axios for backend API with timeout
axios.defaults.baseURL = 'http://localhost:3001/api'
axios.defaults.timeout = 10000

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'

  // Check for existing authentication on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('authToken')
      const demoMode = localStorage.getItem('demoMode')
      
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await axios.get('/user/profile')
          if (response.data.success) {
            setUser(response.data.user)
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          Cookies.remove('authToken')
        }
      } else if (demoMode === 'true') {
        // Enable demo mode
        setUser({ name: 'Demo User', email: 'demo@example.com' })
      }
      
      setLoading(false)
    }
    initAuth()
  }, [])

  const handleCreateResume = () => {
    setCurrentView('build')
  }

  const handleSignIn = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const handleSignUp = () => {
    setAuthMode('register')
    setShowAuthModal(true)
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  const handleLogin = async (email, password) => {
    const response = await axios.post('/auth/login', { email, password })
    
    if (response.data.success) {
      const { token, user } = response.data
      Cookies.set('authToken', token, { expires: 7 })
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      setShowAuthModal(false)
      console.log('✅ Login successful:', user.name)
    } else {
      throw new Error(response.data.message || 'Login failed')
    }
  }

  const handleRegister = async (name, email, password) => {
    const response = await axios.post('/auth/register', { name, email, password })
    
    if (response.data.success) {
      const { token, user } = response.data
      Cookies.set('authToken', token, { expires: 7 })
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      setShowAuthModal(false)
      console.log('✅ Registration successful:', user.name)
    } else {
      throw new Error(response.data.message || 'Registration failed')
    }
  }

  const handleLogout = () => {
    Cookies.remove('authToken')
    localStorage.removeItem('demoMode')
    setUser(null)
    setCurrentView('home')
  }

  const enableDemoMode = () => {
    localStorage.setItem('demoMode', 'true')
    setUser({ name: 'Demo User', email: 'demo@example.com' })
    setShowAuthModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Resume Builder View
  if (currentView === 'build') {
    return <div className="p-8"><h1 className="text-2xl font-bold">Resume Builder Coming Soon!</h1></div>
  }

  // Authentication Modal Component
  const AuthModal = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')
      setIsLoading(true)

      console.log('🚀 Authentication attempt:', { authMode, email })

      try {
        if (authMode === 'login') {
          await handleLogin(email, password)
        } else {
          await handleRegister(name, email, password)
        }
      } catch (err) {
        console.error('❌ Authentication error:', err)
        
        // Check if it's a network connectivity issue
        if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.message.includes('Network Error') || err.message.includes('connect')) {
          setError('🔌 Cannot connect to authentication server.\n\n💡 Quick solutions:\n• Try refreshing the page\n• Use Demo Mode below to skip authentication\n• Check if backend server is running')
        } else {
          setError(err.message || 'Authentication failed')
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (!showAuthModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {authMode === 'login' 
                ? 'Welcome back! Sign in to your account' 
                : 'Create a new account to get started'
              }
            </p>
            <button 
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-medium">Authentication Error:</p>
              <p style={{ whiteSpace: 'pre-line' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg font-semibold"
            >
              {isLoading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Demo Mode Button */}
          <div className="mt-4">
            <button
              onClick={enableDemoMode}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium border border-gray-300"
            >
              🚀 Continue with Demo Mode
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Skip authentication and try the resume builder immediately
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-600">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Main Landing Page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ATS Resume Builder</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-blue-600 px-3 py-2">
                Templates
              </button>
              <button className="text-gray-600 hover:text-blue-600 px-3 py-2">
                Features
              </button>
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Welcome, {user.name || user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleSignIn}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            Build Professional 
            <span className="text-blue-600"> ATS-Friendly</span> Resumes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create stunning resumes that pass Applicant Tracking Systems and get you hired. 
            Choose from professional templates and get real-time ATS compatibility scores.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleCreateResume}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
            >
              Create Resume Free
            </button>
            <button 
              onClick={handleSignUp}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our ATS Resume Builder?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our resume builder is specifically designed to help you create resumes that both humans and ATS systems love.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ATS Optimized</h3>
              <p className="text-gray-600">
                All templates are designed to pass Applicant Tracking Systems with flying colors.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-600 font-bold">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Analysis</h3>
              <p className="text-gray-600">
                Get instant feedback on your resume's ATS compatibility and improvement suggestions.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-600 font-bold">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Templates</h3>
              <p className="text-gray-600">
                Choose from a variety of modern, clean templates designed by professionals.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Auth Modal */}
      <AuthModal />
    </div>
  )
}

export default App
