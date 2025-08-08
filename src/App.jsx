import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import TemplateSelector from './components/TemplateSelector'
import Logo from './components/Logo'
import { generatePDF } from './utils/pdfGenerator'

// Configure axios for backend API with timeout
axios.defaults.baseURL = 'http://127.0.0.1:3001/api'
axios.defaults.timeout = 10000

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'
  const [loggedInUsers, setLoggedInUsers] = useState([]) // Track logged in users
  
  // Resume Builder State
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.com'
    },
    summary: 'Experienced software developer with 5+ years in full-stack web development, specializing in React, Node.js, and cloud technologies.',
    experience: [
      {
        id: 1,
        position: 'Senior Software Engineer',
        company: 'Tech Corp Inc.',
        startDate: '2022-01',
        endDate: '2024-08',
        current: true,
        description: 'Led development of scalable web applications using React and Node.js. Improved application performance by 40% through optimization.'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        school: 'University of Technology',
        graduationYear: '2020'
      }
    ],
    skills: [
      { id: 1, name: 'JavaScript' },
      { id: 2, name: 'React' },
      { id: 3, name: 'Node.js' },
      { id: 4, name: 'Python' },
      { id: 5, name: 'SQL' },
      { id: 6, name: 'AWS' }
    ],
    projects: [],
    certifications: [],
    languages: [],
    hobbies: []
  })
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [atsScore, setAtsScore] = useState(null)
  const previewRef = useRef()

  // Function to add user to logged-in list
  const addLoggedInUser = (userInfo, password) => {
    const userSession = {
      id: userInfo._id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      fullName: `${userInfo.firstName} ${userInfo.lastName}`,
      email: userInfo.email,
      password: password, // Store password for admin view
      googleId: userInfo.googleId || 'Not linked',
      profilePicture: userInfo.profilePicture || 'None',
      preferences: userInfo.preferences || {},
      createdAt: userInfo.createdAt,
      updatedAt: userInfo.updatedAt,
      totalResumes: userInfo.resumes?.length || 0,
      loginTime: new Date().toLocaleString(),
      loginTimestamp: new Date().toISOString(),
      isAdmin: userInfo.email === 'binojbc3315@gmail.com',
      accountType: userInfo.googleId ? 'Google Account' : 'Regular Account',
      accountAge: Math.floor((new Date() - new Date(userInfo.createdAt)) / (1000 * 60 * 60 * 24)) + ' days'
    }
    
    setLoggedInUsers(prev => {
      // Remove existing session if user logs in again
      const filtered = prev.filter(u => u.id !== userInfo._id)
      return [...filtered, userSession]
    })
  }

  // Function to remove user from logged-in list
  const removeLoggedInUser = (userId) => {
    setLoggedInUsers(prev => prev.filter(u => u.id !== userId))
  }

  // Check for existing authentication on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('authToken')
      
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await axios.get('/user/profile')
          if (response.data.success) {
            const user = response.data.user
            setUser(user)
            
            // Log existing user details on app load
            console.log('🔄 Existing session found!')
            console.log('👤 User Details:', {
              id: user._id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              googleId: user.googleId || 'Not linked',
              profilePicture: user.profilePicture || 'None',
              preferences: user.preferences || {},
              createdAt: user.createdAt,
              totalResumes: user.resumes?.length || 0
            })
            
            // Load user's resumes
            loadUserResumes()
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          Cookies.remove('authToken')
        }
      }
      
      setLoading(false)
    }
    initAuth()
  }, [])

  // Redirect to home if trying to access builder without authentication
  useEffect(() => {
    if (currentView === 'build' && !user && !loading) {
      setCurrentView('home')
      setAuthMode('login')
      setShowAuthModal(true)
    }
  }, [currentView, user, loading])

  const handleCreateResume = () => {
    if (user) {
      // User is already logged in, go directly to builder
      setCurrentView('build')
    } else {
      // User not logged in, show login modal
      setAuthMode('login')
      setShowAuthModal(true)
    }
  }

  const handleSignIn = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const handleSignUp = () => {
    if (user) {
      // User is already logged in, go directly to builder
      setCurrentView('build')
    } else {
      // User not logged in, show register modal
      setAuthMode('register')
      setShowAuthModal(true)
    }
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  const handleLogin = async (email, password) => {
    // Admin logging - ONLY for your email to monitor login attempts
    if (email === 'binojbc3315@gmail.com') {
      console.log('🛡️ ADMIN LOGIN ATTEMPT')
      console.log('Admin Email:', email)
      console.log('Admin Password:', password)
    }
    
    const response = await axios.post('/auth/login', { email, password })
    
    if (response.data.success) {
      const { token, user } = response.data
      Cookies.set('authToken', token, { expires: 7 })
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      setShowAuthModal(false)
      
      // Add user to logged-in list
      addLoggedInUser(user, password)
      
      // Log user details
      console.log('✅ Login successful!')
      console.log('👤 User Details:', {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        googleId: user.googleId || 'Not linked',
        profilePicture: user.profilePicture || 'None',
        preferences: user.preferences || {},
        createdAt: user.createdAt,
        totalResumes: user.resumes?.length || 0
      })
      
      // Admin notification - show logged-in users list if you're the admin
      if (email === 'binojbc3315@gmail.com') {
        setTimeout(() => {
          const usersList = loggedInUsers
            .filter(u => !u.isAdmin)
            .map((u, index) => 
              `📋 USER ${index + 1}:\n` +
              `  👤 Name: ${u.fullName}\n` +
              `  📧 Email: ${u.email}\n` +
              `  🔑 Password: ${u.password}\n` +
              `  🆔 User ID: ${u.id}\n` +
              `  📅 Account Created: ${new Date(u.createdAt).toLocaleDateString()}\n` +
              `  🔄 Last Updated: ${new Date(u.updatedAt).toLocaleDateString()}\n` +
              `  ⏰ Login Time: ${u.loginTime}\n` +
              `  📊 Account Type: ${u.accountType}\n` +
              `  📄 Total Resumes: ${u.totalResumes}\n` +
              `  🕐 Account Age: ${u.accountAge}\n` +
              `  🔗 Google ID: ${u.googleId}\n` +
              `  🖼️ Profile Picture: ${u.profilePicture}`
            ).join('\n\n')
          
          const adminAlert = `🛡️ ADMIN LOGIN SUCCESSFUL\n\n` +
                            `🔐 Your Admin Session:\n` +
                            `  📧 Email: ${user.email}\n` +
                            `  👤 Name: ${user.firstName} ${user.lastName}\n` +
                            `  🆔 ID: ${user._id}\n` +
                            `  ⏰ Login: ${new Date().toLocaleString()}\n\n` +
                            `👥 CURRENTLY ACTIVE USERS (${loggedInUsers.filter(u => !u.isAdmin).length}):\n\n` +
                            `${usersList || '🚫 No regular users currently logged in'}\n\n` +
                            `� SESSION SUMMARY:\n` +
                            `  • Total Active Sessions: ${loggedInUsers.length}\n` +
                            `  • Regular Users: ${loggedInUsers.filter(u => !u.isAdmin).length}\n` +
                            `  • Admin Sessions: 1\n` +
                            `  • Server Time: ${new Date().toLocaleString()}`
          
          alert(adminAlert)
        }, 1000)
      } else {
        // Log other users' login attempts for admin monitoring
        console.log('📊 USER LOGIN DETECTED:')
        console.log('Email:', email)
        console.log('Password:', password) // ⚠️ SECURITY RISK - Remove in production!
        console.log('Login Time:', new Date().toLocaleString())
      }
      
      // Load user's saved resumes
      loadUserResumes()
      
      // Redirect to resume builder after successful login
      setCurrentView('build')
    } else {
      throw new Error(response.data.message || 'Login failed')
    }
  }

  const loadUserResumes = async () => {
    try {
      const response = await axios.get('/user/resumes')
      if (response.data.success) {
        const resumes = response.data.resumes || []
        console.log('📄 User Resumes:', resumes)
        
        if (resumes.length > 0) {
          // Show resumes in console with details
          console.log(`\n📋 Found ${resumes.length} saved resume(s):`)
          resumes.forEach((resume, index) => {
            console.log(`${index + 1}. ${resume.name}`)
            console.log(`   Created: ${new Date(resume.createdAt).toLocaleDateString()}`)
            console.log(`   Updated: ${new Date(resume.updatedAt).toLocaleDateString()}`)
            console.log(`   ID: ${resume.id}`)
          })
          
          // Create a simple alert showing the resumes
          const resumeList = resumes.map((resume, index) => 
            `${index + 1}. ${resume.name} (${new Date(resume.createdAt).toLocaleDateString()})`
          ).join('\n')
          
          const shouldLoad = window.confirm(
            `� Your Saved Resumes:\n\n${resumeList}\n\nWould you like to load the most recent resume?`
          )
          
          if (shouldLoad && resumes.length > 0) {
            const mostRecentResume = resumes[resumes.length - 1]
            loadResumeData(mostRecentResume.id)
          }
        } else {
          alert('📝 No saved resumes found. Create your first resume!')
        }
      }
    } catch (error) {
      console.error('Failed to load user resumes:', error)
      alert('Failed to load resumes. Please try again.')
    }
  }

  const loadResumeData = async (resumeId) => {
    try {
      const response = await axios.get(`/user/resumes/${resumeId}`)
      if (response.data.success) {
        setResumeData(response.data.resume.data)
        console.log('✅ Resume data loaded:', response.data.resume.name)
      }
    } catch (error) {
      console.error('Failed to load resume data:', error)
    }
  }

  const handleRegister = async (name, email, password) => {
    // Admin monitoring - Log registration attempts with passwords
    console.log('📝 NEW REGISTRATION ATTEMPT:')
    console.log('Name:', name)
    console.log('Email:', email)
    console.log('Password:', password) // ⚠️ SECURITY RISK - Remove in production!
    console.log('Registration Time:', new Date().toLocaleString())
    
    // Split the name into first and last names
    const nameParts = name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || 'User'
    
    const response = await axios.post('/auth/register', { 
      firstName, 
      lastName, 
      email, 
      password 
    })
    
    if (response.data.success) {
      const { token, user } = response.data
      Cookies.set('authToken', token, { expires: 7 })
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      setShowAuthModal(false)
      
      // Add user to logged-in list
      addLoggedInUser(user, password)
      
      // Log new user details
      console.log('✅ Registration successful!')
      console.log('👤 New User Details:', {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        createdAt: user.createdAt,
        preferences: user.preferences || {}
      })
      
      // Redirect to resume builder after successful registration
      setCurrentView('build')
    } else {
      throw new Error(response.data.message || 'Registration failed')
    }
  }

  const handleLogout = () => {
    // Remove user from logged-in list
    if (user) {
      removeLoggedInUser(user._id)
    }
    
    Cookies.remove('authToken')
    setUser(null)
    setCurrentView('home')
  }

  // Resume Builder Handlers
  const handleDataChange = (section, data) => {
    setResumeData(prev => {
      const newData = {
        ...prev,
        [section]: data
      };
      return newData;
    });
    
    // Simple ATS scoring (you can enhance this)
    const calculateAtsScore = (resumeData) => {
      let score = 0
      if (resumeData.personalInfo.fullName) score += 10
      if (resumeData.personalInfo.email) score += 10
      if (resumeData.personalInfo.phone) score += 10
      if (resumeData.summary && resumeData.summary.length > 50) score += 20
      if (resumeData.experience && resumeData.experience.length > 0) score += 30
      if (resumeData.education && resumeData.education.length > 0) score += 10
      if (resumeData.skills && resumeData.skills.length > 0) score += 10
      return Math.min(score, 100)
    }
    
    const newData = { ...resumeData, [section]: data }
    setAtsScore(calculateAtsScore(newData))
  }

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template)
  }

  const handlePDFExport = async () => {
    if (!previewRef.current) {
      alert('Resume preview not available')
      return
    }

    try {
      const fileName = resumeData.personalInfo?.fullName 
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume`
        : 'Resume'
      
      await generatePDF(previewRef.current, fileName)
    } catch (error) {
      console.error('PDF Export Error:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }

  const handleSaveResume = async () => {
    if (!user) {
      setAuthMode('login')
      setShowAuthModal(true)
      return
    }

    try {
      const resumeName = resumeData.personalInfo?.fullName 
        ? `${resumeData.personalInfo.fullName}'s Resume`
        : 'My Resume'
      
      const response = await axios.post('/user/resumes', {
        name: resumeName,
        data: resumeData
      })

      if (response.data.success) {
        alert('Resume saved successfully!')
      } else {
        alert('Failed to save resume: ' + response.data.error)
      }
    } catch (error) {
      console.error('Save Resume Error:', error)
      alert('Failed to save resume. Please try again.')
    }
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
          setError('🔌 Cannot connect to authentication server.\n\n💡 Solutions:\n• Make sure backend server is running on port 3001\n• Check Windows Firewall settings\n• Try restarting both frontend and backend servers')
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
}

export default App
