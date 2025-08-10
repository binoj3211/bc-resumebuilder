import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import ResumeBuilder from './components/ResumeBuilder'
import ResumeAnalyzer from './components/ResumeAnalyzer'
import ResumeTemplateGallery from './components/ResumeTemplateGallery'
import ProtectedRoute from './components/auth/ProtectedRoute'

const HomePage = () => (
  <>
    <Hero />
    <Features />
  </>
)


// ...existing code...

  // Resume Builder View
  if (currentView === 'build') {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('home')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span>←</span>
                  <span>Back to Home</span>
                </button>
                <div className="h-6 w-px bg-gray-300" />
                <Logo size="small" />
              </div>
              
              <div className="flex items-center space-x-4">
                {/* ATS Score */}
                {atsScore !== null && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">ATS Score:</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      atsScore >= 80 ? 'bg-green-100 text-green-800' :
                      atsScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {atsScore}/100
                    </div>
                  </div>
                )}
                
                {/* View Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPreviewMode(false)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      !isPreviewMode ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setIsPreviewMode(true)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      isPreviewMode ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Preview
                  </button>
                </div>
                
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Welcome, {user.firstName} {user.lastName}</span>
                  <button 
                    onClick={() => loadUserResumes()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    📂 My Resumes
                  </button>
                  <button 
                    onClick={handleSaveResume}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    💾 Save Resume
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {!isPreviewMode ? (
            <div className="h-full flex flex-col xl:flex-row">
              {/* Left Side - Form */}
              <div className="w-full xl:w-1/2 overflow-y-auto p-4 space-y-4 max-h-screen xl:max-h-none">
                {/* Template Selector */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
                  <TemplateSelector 
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={handleTemplateChange}
                  />
                </div>
                
                {/* Resume Form */}
                <div className="bg-white rounded-lg shadow">
                  <ResumeForm
                    data={resumeData}
                    onChange={handleDataChange}
                    atsScore={atsScore}
                  />
                </div>
              </div>

              {/* Right Side - Live Preview */}
              <div className="w-full xl:w-1/2 bg-white shadow-lg border-l border-gray-200 hidden xl:flex xl:flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setIsPreviewMode(true)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      📱 Preview
                    </button>
                    <button 
                      onClick={handlePDFExport}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      📄 PDF
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <div ref={previewRef} className="h-full">
                    <ResumePreview
                      data={resumeData}
                      template={selectedTemplate}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Preview Button */}
              <div className="xl:hidden fixed bottom-4 right-4 z-50">
                <button 
                  onClick={() => setIsPreviewMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
                >
                  👁️ Preview
                </button>
              </div>
            </div>
          ) : (
            /* Full Preview Mode */
            <div className="h-full bg-white">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-xl xl:text-2xl font-bold text-gray-900">Resume Preview</h2>
                  <div className="flex space-x-2 xl:space-x-3">
                    <button 
                      onClick={() => setIsPreviewMode(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 xl:px-4 xl:py-2 rounded-lg font-medium text-sm xl:text-base"
                    >
                      ← Back
                    </button>
                    <button 
                      onClick={handlePDFExport}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 xl:px-4 xl:py-2 rounded-lg font-medium text-sm xl:text-base"
                    >
                      📄 PDF
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 xl:px-4 xl:py-2 rounded-lg font-medium text-sm xl:text-base hidden md:block">
                      🎯 Analysis
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="h-full">
                    <ResumePreview
                      data={resumeData}
                      template={selectedTemplate}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
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
          setError('🔌 Cannot connect to the server. Please check your internet connection or try again later. If the problem persists, our server may be temporarily unavailable.')
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
              {authMode === 'login' ? 'Sign In to Continue' : 'Create Your Account'}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {authMode === 'login' 
                ? 'Sign in to start building your professional resume' 
                : 'Create a free account to access the resume builder'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header with Dark Theme */}
      <header className="bg-gray-900/50 backdrop-blur-xl shadow-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Logo size="default" />
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-purple-400 px-3 py-2 transition-colors duration-200">
                Templates
              </button>
              <button className="text-gray-300 hover:text-purple-400 px-3 py-2 transition-colors duration-200">
                Features
              </button>
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Welcome, {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}</span>
                  {user.email === 'binojbc3315@gmail.com' && (
                    <button 
                      onClick={() => {
                        const usersList = loggedInUsers
                          .filter(u => !u.isAdmin) // Exclude admin from the list
                          .map((u, index) => 
                            `━━━ USER ${index + 1} DETAILS ━━━\n\n` +
                            `👤 PERSONAL INFO:\n` +
                            `  • Full Name: ${u.fullName}\n` +
                            `  • First Name: ${u.firstName}\n` +
                            `  • Last Name: ${u.lastName}\n` +
                            `  • Email: ${u.email}\n` +
                            `  • Password: ${u.password}\n\n` +
                            `🔐 SECURITY INFO:\n` +
                            `  • User ID: ${u.id}\n` +
                            `  • Account Type: ${u.accountType}\n` +
                            `  • Google ID: ${u.googleId}\n` +
                            `  • Profile Picture: ${u.profilePicture}\n\n` +
                            `📅 ACCOUNT TIMELINE:\n` +
                            `  • Created: ${new Date(u.createdAt).toLocaleString()}\n` +
                            `  • Updated: ${new Date(u.updatedAt).toLocaleString()}\n` +
                            `  • Current Login: ${u.loginTime}\n` +
                            `  • Account Age: ${u.accountAge}\n\n` +
                            `📊 ACTIVITY DATA:\n` +
                            `  • Total Resumes: ${u.totalResumes}\n` +
                            `  • Preferences: ${JSON.stringify(u.preferences)}\n` +
                            `  • Login Timestamp: ${u.loginTimestamp}`
                          ).join('\n\n')
                        
                        const adminInfo = `🛡️ COMPREHENSIVE ADMIN PANEL\n\n` +
                                         `🔥 LIVE USER DATABASE ACCESS\n` +
                                         `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                                         `👥 ACTIVE USER SESSIONS (${loggedInUsers.filter(u => !u.isAdmin).length}):\n\n` +
                                         `${usersList || '� NO REGULAR USERS LOGGED IN\n\nAll users have logged out or no registrations yet.'}\n\n` +
                                         `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                                         `� SESSION STATISTICS:\n` +
                                         `  🔢 Total Active Users: ${loggedInUsers.filter(u => !u.isAdmin).length}\n` +
                                         `  � Admin Sessions: 1 (You)\n` +
                                         `  🌐 Total Sessions: ${loggedInUsers.length}\n` +
                                         `  ⏰ Current Time: ${new Date().toLocaleString()}\n` +
                                         `  🔄 Last Refresh: ${new Date().toLocaleString()}\n\n` +
                                         `💡 This data refreshes automatically.\n` +
                                         `🚨 Remember: Remove password logging before production!`
                        
                        alert(adminInfo)
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                    >
                      🛡️ Admin
                    </button>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleSignIn}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Dark Theme */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Large Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="large" />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-8">
            Build Professional 
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"> ATS-Friendly</span> Resumes
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create stunning resumes that pass Applicant Tracking Systems and get you hired. 
            Choose from professional templates and get real-time ATS compatibility scores.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleCreateResume}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              Create Resume Free
            </button>
            <button 
              onClick={handleSignUp}
              className="border border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 px-8 py-3 rounded-lg font-semibold text-lg transform transition-all duration-200 hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section with Dark Theme */}
      <section className="py-16 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Our ATS Resume Builder?</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Our resume builder is specifically designed to help you create resumes that both humans and ATS systems love.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">ATS Optimized</h3>
              <p className="text-gray-300">
                All templates are designed to pass Applicant Tracking Systems with flying colors.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Analysis</h3>
              <p className="text-gray-300">
                Get instant feedback on your resume's ATS compatibility and improvement suggestions.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional Templates</h3>
              <p className="text-gray-300">
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

export default App
