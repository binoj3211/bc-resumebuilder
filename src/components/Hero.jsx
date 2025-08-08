import React, { useState } from 'react'
import { ArrowRight, Sparkles, CheckCircle, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from './auth/AuthModal'

const Hero = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleStartBuilding = () => {
    if (isAuthenticated) {
      navigate('/templates')
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-soft"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>100% Free Forever</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 font-display">
            Build Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Resume
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create ATS-friendly resumes that get you hired. Our intelligent builder analyzes your content 
            and suggests improvements to help you stand out from the competition.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">            
            <button
              onClick={handleStartBuilding}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 group"
            >
              <span>Start Building</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">ATS-Friendly</span>
              </div>
              <p className="text-gray-600 text-sm">Optimized for applicant tracking systems</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">10,000+</span>
              </div>
              <p className="text-gray-600 text-sm">Resumes created successfully</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">100%</span>
              </div>
              <p className="text-gray-600 text-sm">Free with no hidden costs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false)
          // After successful auth, redirect to templates
          if (isAuthenticated) {
            navigate('/templates')
          }
        }} 
      />
    </div>
  )
}

export default Hero
