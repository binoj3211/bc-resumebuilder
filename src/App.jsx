import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import ResumeBuilder from './components/ResumeBuilder'
import SimpleResumeBuilder from './components/SimpleResumeBuilder'
import ResumeAnalyzer from './components/ResumeAnalyzer'
import ATSGeneratorPage from './components/ATSGeneratorPage_Debug'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Hero />
              <Features />
            </>
          } />
          <Route path="/build" element={<ResumeBuilder />} />
          <Route path="/build-simple" element={<SimpleResumeBuilder />} />
          <Route path="/analyze" element={<ResumeAnalyzer />} />
          <Route path="/ats-generator" element={<ATSGeneratorPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
