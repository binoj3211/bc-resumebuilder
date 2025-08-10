import React, { useState } from 'react'
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

function App() {
  // Example state and logic (add your actual logic here)
  const [currentView, setCurrentView] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [loggedInUsers, setLoggedInUsers] = useState([]);

  // Dummy handlers (replace with your actual handlers)
  const handleLogin = async (email, password) => {};
  const handleRegister = async (name, email, password) => {};
  const closeAuthModal = () => setShowAuthModal(false);
  const handleLogout = () => setUser(null);
  const handleSignIn = () => setShowAuthModal(true);
  const handleSignUp = () => setShowAuthModal(true);
  const handleCreateResume = () => setCurrentView('build');

  // Auth Modal Component
  const AuthModal = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);
      try {
        if (authMode === 'login') {
          await handleLogin(email, password);
        } else {
          await handleRegister(name, email, password);
        }
      } catch (err) {
        if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || err.message.includes('Network Error') || err.message.includes('connect')) {
          setError('🔌 Cannot connect to the server. Please check your internet connection or try again later. If the problem persists, our server may be temporarily unavailable.');
        } else {
          setError(err.message || 'Authentication failed');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!showAuthModal) return null;

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
    );
  };

  // Resume Builder View
  if (currentView === 'build') {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Header */}
        {/* ...existing code for builder view... */}
      </div>
    );
  }

  // Main Landing Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header with Dark Theme */}
      <header className="bg-gray-900/50 backdrop-blur-xl shadow-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              {/* Logo component should be imported above */}
              {/* <Logo size="default" /> */}
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
                  {/* Admin button logic here */}
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
          {/* <Logo size="large" /> */}
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
  );
}

export default App;
