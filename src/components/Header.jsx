import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Github, Heart, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './auth/AuthModal'
import UserDashboard from './auth/UserDashboard'

const Header = ({ onCreateResume, onLoadResume }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserDashboard, setShowUserDashboard] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BC ATS ResumeBuilder
              </h1>
              <p className="text-xs text-gray-500">100% Free & Open Source</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
            </nav>
            
            {/* Authentication Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user.firstName}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowUserDashboard(true)
                          setShowUserMenu(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Dashboard
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
            
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Made with love for job seekers</span>
              <span className="hidden sm:inline"> @binoj </span>
            </div>
            
            <a
              href="https://github.com/yourusername/ats-resume-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* User Dashboard Modal */}
      {showUserDashboard && (
        <div className="fixed inset-0 bg-white z-50">
          <UserDashboard 
            onCreateResume={() => {
              setShowUserDashboard(false)
              if (onCreateResume) onCreateResume()
            }}
            onLoadResume={(resumeId) => {
              setShowUserDashboard(false)
              if (onLoadResume) onLoadResume(resumeId)
            }}
            onClose={() => setShowUserDashboard(false)}
          />
        </div>
      )}
    </header>
  )
}

export default Header
