import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Upload, FileText, CheckCircle, AlertTriangle, 
  User, Briefcase, GraduationCap, Star, Code, Award, 
  Globe, Trophy, Heart, Users, Sparkles, Zap 
} from 'lucide-react'
import { analyzeResumeFile } from '../utils/atsAnalyzer'
import ATSResumeGenerator from './SimpleATSGenerator'

const ResumeAnalyzer = () => {
  const navigate = useNavigate()
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [originalFileName, setOriginalFileName] = useState(null)
  const [backendStatus, setBackendStatus] = useState({ checked: false, available: false })
  const [showATSGenerator, setShowATSGenerator] = useState(false)

  console.log('=== RESUME ANALYZER RENDER ===')
  console.log('showATSGenerator state:', showATSGenerator)
  
  // SIMPLE TEST: If showATSGenerator is true, show a different page
  if (showATSGenerator) {
    console.log('=== RENDERING ATS GENERATOR ===')
    
    return (
      <div className="min-h-screen bg-green-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-green-800 mb-6">
              🎉 SUCCESS! ATS Generator is Working!
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              If you can see this message, the state change is working correctly.
            </p>
            <button
              onClick={() => {
                console.log('Back button clicked')
                setShowATSGenerator(false)
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              ← Back to Analyzer
            </button>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                Now that we know the state management works, we can load the actual ATS Generator component.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check backend availability on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        console.log('🔍 Checking backend health...')
        
        // Direct health check first
        const directCheck = await fetch('http://localhost:3001/health')
        if (directCheck.ok) {
          const data = await directCheck.json()
          console.log('✅ Direct backend health check success:', data)
          setBackendStatus({ checked: true, available: true })
          return
        }
        
        // Fallback to backendExtractor
        const { backendExtractor } = await import('../utils/backendExtractor')
        const isHealthy = await backendExtractor.checkHealth()
        console.log('Backend extractor health result:', isHealthy)
        setBackendStatus({ checked: true, available: isHealthy })
      } catch (error) {
        console.error('❌ Backend health check failed:', error)
        setBackendStatus({ checked: true, available: false })
      }
    }
    checkBackend()
  }, [])

  const handleGoBack = () => {
    navigate('/')
  }

  const testBackendAPI = async () => {
    try {
      console.log('🧪 Testing backend API directly...')
      
      // First test health
      const response = await fetch('http://localhost:3001/health')
      const data = await response.json()
      console.log('Backend health response:', data)
      
      // Now test with actual PDF file if we have the file
      if (originalFileName && analysisResult) {
        console.log('🧪 Testing with actual analysis result...')
        console.log('Analysis result keys:', Object.keys(analysisResult))
        console.log('Has extractedData:', !!(analysisResult.extractedData))
        console.log('ExtractedData content:', analysisResult.extractedData)
        
        if (analysisResult.extractedData) {
          console.log('✅ Found extracted data!')
          console.log('Personal info:', analysisResult.extractedData.personalInfo)
          console.log('Backend extracted flag:', analysisResult.extractedData._backendExtracted)
        }
      }
      
    } catch (error) {
      console.error('API Test failed:', error)
    }
  }

  const handleFileUpload = async (file) => {
    if (!file) return
    
    console.log('=== DIRECT BACKEND EXTRACTION START ===')
    console.log('Starting file upload for:', file.name, file.type, file.size)
    
    setIsAnalyzing(true)
    setOriginalFileName(file.name)
    setAnalysisResult(null)
    
    try {
      // Try direct backend extraction first
      if (backendStatus.available) {
        console.log('🚀 Attempting DIRECT backend extraction...')
        
        const formData = new FormData()
        formData.append('resume', file)
        
        const response = await fetch('http://localhost:3001/api/extract-pdf-text', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const backendResult = await response.json()
          console.log('✅ DIRECT Backend response:', backendResult)
          console.log('✅ Backend structured data:', backendResult.structuredData)
          console.log('✅ Backend personal info:', backendResult.structuredData?.personalInfo)
          
          if (backendResult.success && backendResult.structuredData) {
            // Use backend data directly with proper structure
            const extractedData = {
              personalInfo: backendResult.structuredData.personalInfo || {},
              summary: backendResult.structuredData.summary || '',
              skills: backendResult.structuredData.skills || [],
              experience: backendResult.structuredData.experience || [],
              education: backendResult.structuredData.education || [],
              projects: backendResult.structuredData.projects || [],
              certifications: backendResult.structuredData.certifications || [],
              languages: backendResult.structuredData.languages || [],
              achievements: backendResult.structuredData.achievements || [],
              hobbies: backendResult.structuredData.hobbies || [],
              references: backendResult.structuredData.references || '',
              sections: backendResult.structuredData.sections || {},
              _backendExtracted: true,
              _rawText: backendResult.extractedText || ''
            }
            
            console.log('🎯 Final extracted data for display:', extractedData)
            console.log('🎯 Personal info for display:', extractedData.personalInfo)
            console.log('🎯 Education for display:', extractedData.education)
            console.log('🎯 Projects for display:', extractedData.projects)
            console.log('🎯 Languages for display:', extractedData.languages)
            
            setAnalysisResult({ 
              extractedData: extractedData,
              fileInfo: {
                name: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB',
                type: file.type,
                method: 'Direct Backend'
              }
            })
            
            setIsAnalyzing(false)
            return // Success - exit early
          }
        }
        
        console.log('⚠️ Direct backend failed, trying fallback...')
      }
      
      // Fallback to the existing analysis method
      console.log('📄 Falling back to analyzeResumeFile...')
      const result = await analyzeResumeFile(file)
      console.log('=== FALLBACK ANALYSIS RESULT ===')
      console.log('Full analysis result:', result)
      console.log('Has extractedData?', !!(result.extractedData))
      console.log('Personal Info from result:', result.extractedData?.personalInfo)
      console.log('Backend extracted?', result.extractedData?._backendExtracted)
      
      setAnalysisResult(result)
      console.log('Analysis result set successfully')
    } catch (error) {
      console.error('Analysis error in component:', error)
      const fallbackResult = {
        extractedData: null,
        fileInfo: {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          type: file.type || 'Unknown',
          error: error.message
        }
      }
      setAnalysisResult(fallbackResult)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const renderExtractedData = (extractedData) => {
    console.log('=== RENDER COMPREHENSIVE EXTRACTED DATA ===')
    console.log('Received extractedData:', extractedData)
    console.log('Backend extracted?', extractedData?._backendExtracted)
    console.log('Personal info:', extractedData?.personalInfo)
    console.log('Summary:', extractedData?.summary)
    console.log('Skills:', extractedData?.skills)
    console.log('Experience:', extractedData?.experience)
    console.log('Education:', extractedData?.education)
    console.log('Projects:', extractedData?.projects)
    console.log('Languages:', extractedData?.languages)
    console.log('Hobbies:', extractedData?.hobbies)
    console.log('All data keys:', Object.keys(extractedData || {}))
    
    if (!extractedData) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">❗ No Data Extracted</h3>
          <p className="text-yellow-700">
            We couldn't extract structured data from your resume.
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            Complete Resume Analysis
            {extractedData._backendExtracted && (
              <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                ✅ AI Enhanced Extraction
              </span>
            )}
          </h3>
        </div>

        {/* Personal Information */}
        {extractedData.personalInfo && Object.keys(extractedData.personalInfo).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="mr-3 text-blue-600" size={24} />
              Personal Information ({Object.keys(extractedData.personalInfo).length} fields)
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {extractedData.personalInfo.fullName && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <strong className="text-blue-800 block text-sm">Full Name</strong>
                  <p className="text-blue-900 text-lg font-semibold">{extractedData.personalInfo.fullName}</p>
                </div>
              )}
              {extractedData.personalInfo.email && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <strong className="text-green-800 block text-sm">Email Address</strong>
                  <p className="text-green-900 font-medium">{extractedData.personalInfo.email}</p>
                </div>
              )}
              {extractedData.personalInfo.phone && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <strong className="text-purple-800 block text-sm">Phone Number</strong>
                  <p className="text-purple-900 font-medium">{extractedData.personalInfo.phone}</p>
                </div>
              )}
              {extractedData.personalInfo.address && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <strong className="text-orange-800 block text-sm">Address</strong>
                  <p className="text-orange-900">{extractedData.personalInfo.address}</p>
                </div>
              )}
              {extractedData.personalInfo.linkedin && (
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <strong className="text-indigo-800 block text-sm">LinkedIn Profile</strong>
                  <p className="text-indigo-900 truncate">
                    <a 
                      href={extractedData.personalInfo.linkedin.startsWith('http') ? 
                        extractedData.personalInfo.linkedin : 
                        `https://${extractedData.personalInfo.linkedin}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {extractedData.personalInfo.linkedin}
                    </a>
                  </p>
                </div>
              )}
              {extractedData.personalInfo.website && (
                <div className="bg-pink-50 p-4 rounded-lg">
                  <strong className="text-pink-800 block text-sm">Website/Portfolio</strong>
                  <p className="text-pink-900 truncate">
                    <a 
                      href={extractedData.personalInfo.website.startsWith('http') ? 
                        extractedData.personalInfo.website : 
                        `https://${extractedData.personalInfo.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {extractedData.personalInfo.website}
                    </a>
                  </p>
                </div>
              )}
              {extractedData.personalInfo.portfolio && (
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <strong className="text-cyan-800 block text-sm">Portfolio</strong>
                  <p className="text-cyan-900 truncate">
                    <a 
                      href={extractedData.personalInfo.portfolio.startsWith('http') ? 
                        extractedData.personalInfo.portfolio : 
                        `https://${extractedData.personalInfo.portfolio}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {extractedData.personalInfo.portfolio}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Professional Summary */}
        {extractedData.summary && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FileText className="mr-3 text-green-600" size={24} />
              Professional Summary
            </h4>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-900 leading-relaxed text-lg">{extractedData.summary}</p>
            </div>
          </div>
        )}

        {/* Skills */}
        {extractedData.skills && extractedData.skills.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Star className="mr-3 text-yellow-600" size={24} />
              Skills ({extractedData.skills.length} found)
            </h4>
            <div className="grid gap-3">
              <div className="flex flex-wrap gap-2">
                {extractedData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-900 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Work Experience */}
        {extractedData.experience && extractedData.experience.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Briefcase className="mr-3 text-purple-600" size={24} />
              Work Experience ({extractedData.experience.length} positions)
            </h4>
            <div className="space-y-6">
              {extractedData.experience.map((exp, index) => (
                <div key={exp.id || index} className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h5 className="text-xl font-bold text-purple-900">{exp.position || exp.title}</h5>
                      <div className="flex items-center mt-1 text-purple-700">
                        <span className="font-semibold">{exp.company}</span>
                        {exp.location && (
                          <span className="ml-2 text-purple-600">• {exp.location}</span>
                        )}
                      </div>
                    </div>
                    {exp.current && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        Current Role
                      </span>
                    )}
                  </div>
                  
                  {exp.duration && (
                    <div className="mb-3">
                      <span className="inline-flex items-center text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                        📅 {exp.duration}
                      </span>
                    </div>
                  )}
                  
                  {exp.description && Array.isArray(exp.description) && exp.description.length > 0 && (
                    <div className="mt-4">
                      <h6 className="text-sm font-semibold text-purple-800 mb-2">Key Responsibilities:</h6>
                      <ul className="list-disc list-inside text-purple-700 space-y-2">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="text-sm leading-relaxed hover:text-purple-900 transition-colors">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Experience Level Indicator */}
                  <div className="mt-4 pt-3 border-t border-purple-200">
                    <div className="flex items-center justify-between text-xs text-purple-600">
                      <span>
                        {(exp.position || exp.title)?.toLowerCase().includes('senior') && '👨‍💼 Senior Level'}
                        {(exp.position || exp.title)?.toLowerCase().includes('junior') && '👦 Junior Level'}
                        {(exp.position || exp.title)?.toLowerCase().includes('lead') && '🎯 Leadership Role'}
                        {(exp.position || exp.title)?.toLowerCase().includes('manager') && '📊 Management Role'}
                        {!(exp.position || exp.title)?.toLowerCase().match(/(senior|junior|lead|manager)/) && '💼 Professional Role'}
                      </span>
                      <span className="text-purple-500">Position #{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Experience Summary */}
            <div className="mt-6 p-4 bg-purple-100 rounded-lg">
              <div className="text-sm text-purple-800 text-center">
                <strong>Career Summary:</strong> {extractedData.experience.length} professional position{extractedData.experience.length !== 1 ? 's' : ''} documented
                {extractedData.experience.filter(exp => exp.current).length > 0 && (
                  <span className="ml-2">
                    ({extractedData.experience.filter(exp => exp.current).length} current role{extractedData.experience.filter(exp => exp.current).length !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Briefcase className="mr-3 text-gray-400" size={24} />
              Work Experience
            </h4>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="text-gray-600 mb-2">
                <Briefcase className="mx-auto mb-2 text-gray-400" size={48} />
              </div>
              <h5 className="text-lg font-semibold text-gray-700 mb-2">No Work Experience Found</h5>
              <p className="text-gray-600 text-sm">
                This could be because you're a recent graduate or the work experience section wasn't clearly identified in your resume.
              </p>
              <div className="mt-3 text-xs text-gray-500">
                💡 Tip: Make sure your experience section uses keywords like "Experience", "Work", "Employment", or "Career"
              </div>
            </div>
          </div>
        )}

        {/* Education */}
        {extractedData.education && extractedData.education.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <GraduationCap className="mr-3 text-indigo-600" size={24} />
              Education ({extractedData.education.length} qualifications)
            </h4>
            
            {/* Education Categories */}
            <div className="space-y-6">
              {/* Higher Education */}
              {extractedData.education.filter(edu => 
                edu.degree && (
                  edu.degree.toLowerCase().includes('master') || 
                  edu.degree.toLowerCase().includes('mca') ||
                  edu.degree.toLowerCase().includes('bachelor') ||
                  edu.degree.toLowerCase().includes('bsc') ||
                  edu.degree.toLowerCase().includes('ba') ||
                  edu.degree.toLowerCase().includes('bca') ||
                  edu.degree.toLowerCase().includes('btech') ||
                  edu.degree.toLowerCase().includes('be') ||
                  edu.degree.toLowerCase().includes('mba') ||
                  edu.degree.toLowerCase().includes('phd')
                )
              ).length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-indigo-900 mb-3 border-b border-indigo-200 pb-1">
                    🎓 Higher Education
                  </h5>
                  <div className="space-y-3">
                    {extractedData.education
                      .filter(edu => 
                        edu.degree && (
                          edu.degree.toLowerCase().includes('master') || 
                          edu.degree.toLowerCase().includes('mca') ||
                          edu.degree.toLowerCase().includes('bachelor') ||
                          edu.degree.toLowerCase().includes('bsc') ||
                          edu.degree.toLowerCase().includes('ba') ||
                          edu.degree.toLowerCase().includes('bca') ||
                          edu.degree.toLowerCase().includes('btech') ||
                          edu.degree.toLowerCase().includes('be') ||
                          edu.degree.toLowerCase().includes('mba') ||
                          edu.degree.toLowerCase().includes('phd')
                        )
                      )
                      .map((edu, index) => (
                        <div key={edu.id || `higher-${index}`} className="bg-indigo-50 p-5 rounded-lg border-l-4 border-indigo-500">
                          <h6 className="text-lg font-bold text-indigo-900">{edu.degree}</h6>
                          {edu.field && <p className="text-indigo-800 font-medium">Field: {edu.field}</p>}
                          {edu.institution && <p className="text-indigo-700">{edu.institution}</p>}
                          <div className="flex justify-between items-center mt-2 text-sm">
                            <div className="flex gap-4">
                              {edu.year && <span className="text-indigo-600">Year: {edu.year}</span>}
                              {edu.gpa && <span className="text-indigo-600">GPA: {edu.gpa}</span>}
                            </div>
                            {edu.location && <span className="text-indigo-500">{edu.location}</span>}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* School Education */}
              {extractedData.education.filter(edu => 
                edu.degree && (
                  edu.degree.toLowerCase().includes('higher secondary') ||
                  edu.degree.toLowerCase().includes('12th') ||
                  edu.degree.toLowerCase().includes('intermediate') ||
                  edu.degree.toLowerCase().includes('pre-university') ||
                  edu.degree.toLowerCase().includes('puc') ||
                  edu.degree.toLowerCase().includes('+2') ||
                  edu.degree.toLowerCase().includes('plus two')
                )
              ).length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-blue-900 mb-3 border-b border-blue-200 pb-1">
                    📚 Higher Secondary Education (12th Grade)
                  </h5>
                  <div className="space-y-3">
                    {extractedData.education
                      .filter(edu => 
                        edu.degree && (
                          edu.degree.toLowerCase().includes('higher secondary') ||
                          edu.degree.toLowerCase().includes('12th') ||
                          edu.degree.toLowerCase().includes('intermediate') ||
                          edu.degree.toLowerCase().includes('pre-university') ||
                          edu.degree.toLowerCase().includes('puc') ||
                          edu.degree.toLowerCase().includes('+2') ||
                          edu.degree.toLowerCase().includes('plus two')
                        )
                      )
                      .map((edu, index) => (
                        <div key={edu.id || `secondary-${index}`} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <h6 className="text-lg font-bold text-blue-900">{edu.degree}</h6>
                          {edu.field && (
                            <p className="text-blue-800 font-medium">
                              Stream: <span className="bg-blue-200 px-2 py-1 rounded text-sm">{edu.field}</span>
                            </p>
                          )}
                          {edu.institution && <p className="text-blue-700">{edu.institution}</p>}
                          {edu.year && <span className="text-blue-600 text-sm">Year: {edu.year}</span>}
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Matriculation */}
              {extractedData.education.filter(edu => 
                edu.degree && (
                  edu.degree.toLowerCase().includes('matriculation') ||
                  edu.degree.toLowerCase().includes('10th') ||
                  edu.degree.toLowerCase().includes('sslc') ||
                  edu.degree.toLowerCase().includes('secondary') ||
                  edu.degree.toLowerCase().includes('high school')
                )
              ).length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-green-900 mb-3 border-b border-green-200 pb-1">
                    📖 Matriculation (10th Grade)
                  </h5>
                  <div className="space-y-3">
                    {extractedData.education
                      .filter(edu => 
                        edu.degree && (
                          edu.degree.toLowerCase().includes('matriculation') ||
                          edu.degree.toLowerCase().includes('10th') ||
                          edu.degree.toLowerCase().includes('sslc') ||
                          edu.degree.toLowerCase().includes('secondary') ||
                          edu.degree.toLowerCase().includes('high school')
                        )
                      )
                      .map((edu, index) => (
                        <div key={edu.id || `matriculation-${index}`} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                          <h6 className="text-lg font-bold text-green-900">{edu.degree}</h6>
                          {edu.field && <p className="text-green-800 font-medium">Subjects: {edu.field}</p>}
                          {edu.institution && <p className="text-green-700">{edu.institution}</p>}
                          {edu.year && <span className="text-green-600 text-sm">Year: {edu.year}</span>}
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Other/Uncategorized Education */}
              {extractedData.education.filter(edu => {
                const degree = edu.degree?.toLowerCase() || '';
                return !degree.includes('master') && !degree.includes('mca') &&
                       !degree.includes('bachelor') && !degree.includes('bsc') &&
                       !degree.includes('ba') && !degree.includes('bca') &&
                       !degree.includes('btech') && !degree.includes('be') &&
                       !degree.includes('mba') && !degree.includes('phd') &&
                       !degree.includes('higher secondary') && !degree.includes('12th') &&
                       !degree.includes('intermediate') && !degree.includes('pre-university') &&
                       !degree.includes('puc') && !degree.includes('+2') &&
                       !degree.includes('plus two') && !degree.includes('matriculation') &&
                       !degree.includes('10th') && !degree.includes('sslc') &&
                       !degree.includes('secondary') && !degree.includes('high school');
              }).length > 0 && (
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                    📜 Other Qualifications
                  </h5>
                  <div className="space-y-3">
                    {extractedData.education
                      .filter(edu => {
                        const degree = edu.degree?.toLowerCase() || '';
                        return !degree.includes('master') && !degree.includes('mca') &&
                               !degree.includes('bachelor') && !degree.includes('bsc') &&
                               !degree.includes('ba') && !degree.includes('bca') &&
                               !degree.includes('btech') && !degree.includes('be') &&
                               !degree.includes('mba') && !degree.includes('phd') &&
                               !degree.includes('higher secondary') && !degree.includes('12th') &&
                               !degree.includes('intermediate') && !degree.includes('pre-university') &&
                               !degree.includes('puc') && !degree.includes('+2') &&
                               !degree.includes('plus two') && !degree.includes('matriculation') &&
                               !degree.includes('10th') && !degree.includes('sslc') &&
                               !degree.includes('secondary') && !degree.includes('high school');
                      })
                      .map((edu, index) => (
                        <div key={edu.id || `other-${index}`} className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                          <h6 className="text-lg font-bold text-gray-900">{edu.degree || `Education ${index + 1}`}</h6>
                          {edu.field && <p className="text-gray-800 font-medium">Field: {edu.field}</p>}
                          {edu.institution && <p className="text-gray-700">{edu.institution}</p>}
                          {edu.year && <span className="text-gray-600 text-sm">Year: {edu.year}</span>}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        {extractedData.projects && extractedData.projects.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Code className="mr-3 text-orange-600" size={24} />
              Projects ({extractedData.projects.length} projects)
            </h4>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {extractedData.projects.map((project, index) => (
                <div key={project.id || index} className="bg-orange-50 p-5 rounded-lg border-l-4 border-orange-500 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h5 className="text-lg font-bold text-orange-900 flex-1">{project.title}</h5>
                    {project.technologies && project.technologies.length > 0 && (
                      <span className="ml-2 text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
                        {project.technologies.length} tech{project.technologies.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  
                  {project.description && project.description !== project.title && (
                    <p className="text-orange-800 mt-2 leading-relaxed text-sm mb-3">{project.description}</p>
                  )}
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-orange-800 block mb-2">Technologies Used:</span>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-orange-200 text-orange-900 rounded text-xs font-medium hover:bg-orange-300 transition-colors"
                            title={`Technology: ${tech}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {project.url && (
                    <div className="mt-3 pt-3 border-t border-orange-200">
                      <a 
                        href={project.url.startsWith('http') ? project.url : `https://${project.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-700 hover:text-orange-800 text-sm underline inline-flex items-center gap-1"
                      >
                        <span>View Project</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                  
                  {/* Project Type Indicator */}
                  {project.title && (
                    <div className="mt-2 pt-2 border-t border-orange-200">
                      <span className="text-xs text-orange-600">
                        {project.title.toLowerCase().includes('website') && '🌐 Website'}
                        {project.title.toLowerCase().includes('app') && '📱 Application'}
                        {project.title.toLowerCase().includes('system') && '⚙️ System'}
                        {project.title.toLowerCase().includes('management') && '📊 Management Tool'}
                        {project.title.toLowerCase().includes('dashboard') && '📈 Dashboard'}
                        {project.title.toLowerCase().includes('game') && '🎮 Game'}
                        {project.title.toLowerCase().includes('tool') && '🔧 Tool'}
                        {!project.title.toLowerCase().match(/(website|app|system|management|dashboard|game|tool)/) && '💻 Software'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Projects Summary */}
            {extractedData.projects.length > 2 && (
              <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                <div className="text-sm text-orange-800 text-center">
                  <strong>Portfolio Overview:</strong> {extractedData.projects.length} projects showcasing diverse technical skills
                  {extractedData.projects.reduce((acc, p) => acc + (p.technologies?.length || 0), 0) > 0 && (
                    <span className="ml-2">
                      ({extractedData.projects.reduce((acc, p) => acc + (p.technologies?.length || 0), 0)} technologies total)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Certifications */}
        {extractedData.certifications && extractedData.certifications.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="mr-3 text-red-600" size={24} />
              Certifications ({extractedData.certifications.length} certifications)
            </h4>
            <div className="space-y-3">
              {extractedData.certifications.map((cert, index) => (
                <div key={cert.id || index} className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <h5 className="font-bold text-red-900">{cert.name}</h5>
                  <p className="text-red-800 font-medium">{cert.organization}</p>
                  {cert.year && (
                    <span className="text-sm text-red-700">Issued: {cert.year}</span>
                  )}
                  {cert.expiry && (
                    <span className="text-sm text-red-600 block">Expires: {cert.expiry}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {extractedData.languages && extractedData.languages.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Globe className="mr-3 text-teal-600" size={24} />
              Languages ({extractedData.languages.length} languages)
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {extractedData.languages.map((lang, index) => (
                <div key={lang.id || index} className="bg-teal-50 p-3 rounded-lg flex justify-between items-center">
                  <span className="font-bold text-teal-900">{lang.language}</span>
                  <span className="text-teal-700 text-sm bg-teal-100 px-2 py-1 rounded">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {extractedData.achievements && extractedData.achievements.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Trophy className="mr-3 text-yellow-600" size={24} />
              Achievements & Awards ({extractedData.achievements.length})
            </h4>
            <div className="space-y-3">
              {extractedData.achievements.map((achievement, index) => (
                <div key={achievement.id || index} className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <h5 className="font-bold text-yellow-900">{achievement.title}</h5>
                  {achievement.description && (
                    <p className="text-yellow-800 mt-1">{achievement.description}</p>
                  )}
                  {achievement.year && (
                    <span className="text-sm text-yellow-700">{achievement.year}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hobbies/Interests */}
        {extractedData.hobbies && extractedData.hobbies.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Heart className="mr-3 text-pink-600" size={24} />
              Hobbies & Interests ({extractedData.hobbies.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {extractedData.hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-pink-100 text-pink-900 rounded-full text-sm font-medium"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {extractedData.references && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Users className="mr-3 text-gray-600" size={24} />
              References
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 font-medium">{extractedData.references}</p>
            </div>
          </div>
        )}

        {/* Extraction Debug Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4">📊 Section Analysis</h4>
          
          {/* Section Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className={`p-3 rounded-lg text-center ${
              Object.keys(extractedData.personalInfo || {}).length > 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className={`font-bold text-lg ${
                Object.keys(extractedData.personalInfo || {}).length > 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {Object.keys(extractedData.personalInfo || {}).length}
              </div>
              <div className={Object.keys(extractedData.personalInfo || {}).length > 0 ? 'text-green-700' : 'text-red-700'}>
                Personal Fields
              </div>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              (extractedData.skills || []).length > 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className={`font-bold text-lg ${
                (extractedData.skills || []).length > 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {(extractedData.skills || []).length}
              </div>
              <div className={(extractedData.skills || []).length > 0 ? 'text-green-700' : 'text-red-700'}>
                Skills Found
              </div>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              (extractedData.experience || []).length > 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className={`font-bold text-lg ${
                (extractedData.experience || []).length > 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {(extractedData.experience || []).length}
              </div>
              <div className={(extractedData.experience || []).length > 0 ? 'text-green-700' : 'text-red-700'}>
                Work Positions
              </div>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              (extractedData.education || []).length > 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className={`font-bold text-lg ${
                (extractedData.education || []).length > 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {(extractedData.education || []).length}
              </div>
              <div className={(extractedData.education || []).length > 0 ? 'text-green-700' : 'text-red-700'}>
                Education Records
              </div>
              {/* Education Breakdown */}
              {extractedData.education && extractedData.education.length > 0 && (
                <div className="text-xs text-green-600 mt-1 space-y-1">
                  {extractedData.education.filter(edu => 
                    edu.degree?.toLowerCase().includes('master') || 
                    edu.degree?.toLowerCase().includes('bachelor') ||
                    edu.degree?.toLowerCase().includes('mca') ||
                    edu.degree?.toLowerCase().includes('bsc') ||
                    edu.degree?.toLowerCase().includes('ba')
                  ).length > 0 && (
                    <div>🎓 College: {extractedData.education.filter(edu => 
                      edu.degree?.toLowerCase().includes('master') || 
                      edu.degree?.toLowerCase().includes('bachelor') ||
                      edu.degree?.toLowerCase().includes('mca') ||
                      edu.degree?.toLowerCase().includes('bsc') ||
                      edu.degree?.toLowerCase().includes('ba')
                    ).length}</div>
                  )}
                  {extractedData.education.filter(edu => 
                    edu.degree?.toLowerCase().includes('12th') ||
                    edu.degree?.toLowerCase().includes('higher secondary') ||
                    edu.degree?.toLowerCase().includes('intermediate')
                  ).length > 0 && (
                    <div>📚 12th: {extractedData.education.filter(edu => 
                      edu.degree?.toLowerCase().includes('12th') ||
                      edu.degree?.toLowerCase().includes('higher secondary') ||
                      edu.degree?.toLowerCase().includes('intermediate')
                    ).length}</div>
                  )}
                  {extractedData.education.filter(edu => 
                    edu.degree?.toLowerCase().includes('10th') ||
                    edu.degree?.toLowerCase().includes('matriculation') ||
                    edu.degree?.toLowerCase().includes('sslc')
                  ).length > 0 && (
                    <div>📖 10th: {extractedData.education.filter(edu => 
                      edu.degree?.toLowerCase().includes('10th') ||
                      edu.degree?.toLowerCase().includes('matriculation') ||
                      edu.degree?.toLowerCase().includes('sslc')
                    ).length}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Sections Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className={`p-2 rounded text-center text-sm ${
              (extractedData.projects || []).length > 0 ? 'bg-orange-50 text-orange-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <strong>{(extractedData.projects || []).length}</strong> Projects
            </div>
            <div className={`p-2 rounded text-center text-sm ${
              (extractedData.languages || []).length > 0 ? 'bg-teal-50 text-teal-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <strong>{(extractedData.languages || []).length}</strong> Languages
            </div>
            <div className={`p-2 rounded text-center text-sm ${
              (extractedData.hobbies || []).length > 0 ? 'bg-pink-50 text-pink-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <strong>{(extractedData.hobbies || []).length}</strong> Hobbies
            </div>
            <div className={`p-2 rounded text-center text-sm ${
              (extractedData.certifications || []).length > 0 ? 'bg-red-50 text-red-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <strong>{(extractedData.certifications || []).length}</strong> Certifications
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
              <div>
                <span className="font-semibold">Extraction Method:</span> 
                <span className="ml-1">
                  {extractedData._backendExtracted ? 'AI Backend Analysis' : 'Frontend Analysis'}
                </span>
              </div>
              <div>
                <span className="font-semibold">Content Size:</span> 
                <span className="ml-1">{(extractedData._rawText?.length || 0).toLocaleString()} characters</span>
              </div>
              <div>
                <span className="font-semibold">Backend Status:</span> 
                <span className={`ml-1 ${backendStatus.available ? 'text-green-600' : 'text-red-600'}`}>
                  {backendStatus.available ? '🟢 Online' : '🔴 Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Raw Text Preview */}
        {extractedData._rawText && (
          <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <FileText className="mr-2 text-gray-600" size={20} />
              Raw Extracted Text Preview
            </h4>
            <div className="bg-white rounded-lg border p-4 max-h-60 overflow-y-auto">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed">
                {extractedData._rawText.substring(0, 2000)}
                {extractedData._rawText.length > 2000 && '\n\n... (text truncated for display)'}
              </pre>
            </div>
            <div className="mt-3 text-sm text-gray-500 flex justify-between">
              <span>Full text length: {extractedData._rawText.length.toLocaleString()} characters</span>
              <span>Showing first 2,000 characters</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">Resume Analyzer</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* DEBUG: Quick ATS Generator Test Button */}
              <button
                onClick={() => {
                  console.log('=== HEADER DEBUG BUTTON CLICKED ===')
                  navigate('/ats-generator')
                }}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700"
              >
                DEBUG ATS
              </button>
              
              {/* Backend Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  !backendStatus.checked ? 'bg-gray-400' :
                  backendStatus.available ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {!backendStatus.checked ? 'Checking...' :
                   backendStatus.available ? 'Backend Online' : 'Backend Offline'}
                </span>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={testBackendAPI}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Test API
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysisResult ? (
          // Upload Section
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Extract Your Resume Data</h2>
              <p className="text-gray-600">
                Upload your resume to extract and display structured information
              </p>
              
              {/* Backend Status Indicator */}
              {backendStatus.checked && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm mt-3 ${
                  backendStatus.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {backendStatus.available ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Advanced AI Extraction Active
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Using Basic Extraction (Backend Offline)
                    </>
                  )}
                </div>
              )}
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isAnalyzing ? 'Extracting resume data...' : 'Drop your resume here'}
              </h3>
              <p className="text-gray-500 mb-4">
                {isAnalyzing ? 'Please wait while we extract your resume data' : 'or click to browse files'}
              </p>
              
              {!isAnalyzing && (
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="btn-primary cursor-pointer inline-flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports PDF, DOC, DOCX, and TXT files (Max 5MB)
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600">Extracting...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Extracted Data Display
          <div className="space-y-6">
            {/* Show extracted data if available */}
            {analysisResult.extractedData && (
              renderExtractedData(analysisResult.extractedData)
            )}
            
            {/* If no extracted data available, show fallback */}
            {!analysisResult.extractedData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Extract Data</h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't extract structured information from your resume. This might be due to:
                  </p>
                  <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>PDF is image-based or scanned (no selectable text)</li>
                      <li>Complex formatting that interferes with text extraction</li>
                      <li>File may be corrupted or password-protected</li>
                      <li>Backend server connection issues</li>
                    </ul>
                  </div>
                  <div className="text-sm text-gray-500">
                    <strong>File:</strong> {originalFileName || 'Unknown'} | 
                    <strong> Backend:</strong> {backendStatus.available ? '🟢 Online' : '🔴 Offline'}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Generate ATS Resume Button - Only show if we have extracted data */}
              {analysisResult.extractedData && (
                <button
                  onClick={() => {
                    console.log('=== GENERATE ATS RESUME BUTTON CLICKED ===')
                    console.log('analysisResult.extractedData:', analysisResult.extractedData)
                    // Store the data for the ATS generator
                    localStorage.setItem('extractedResumeData', JSON.stringify(analysisResult.extractedData))
                    console.log('Data stored in localStorage')
                    setShowATSGenerator(true)
                    console.log('showATSGenerator set to true')
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Sparkles size={20} />
                  Generate ATS Resume
                  <Zap size={16} className="ml-1" />
                </button>
              )}
              
              {/* Test ATS Generator Button - Always visible for debugging */}
              <button
                onClick={() => {
                  console.log('=== BUTTON CLICKED ===')
                  console.log('Navigating to ATS Generator page...')
                  navigate('/ats-generator')
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <FileText size={16} />
                🚀 Test ATS Generator (Navigate)
              </button>
              
              <button
                onClick={() => {
                  setAnalysisResult(null)
                  setOriginalFileName(null)
                }}
                className="btn-secondary"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeAnalyzer
