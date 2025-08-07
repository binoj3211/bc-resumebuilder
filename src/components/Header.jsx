import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Github, Heart } from 'lucide-react'

const Header = () => {
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
              <Link to="/analyze" className="text-gray-600 hover:text-blue-600 transition-colors">
                Analyze
              </Link>
              <Link to="/ats-generator" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                ATS Generator
              </Link>
            </nav>
            
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
    </header>
  )
}

export default Header
