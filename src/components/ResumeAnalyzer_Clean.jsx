import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react'
import { analyzeResumeFile } from '../utils/atsAnalyzer'

const ResumeAnalyzer = () => {
  const navigate = useNavigate()
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [originalFileName, setOriginalFileName] = useState(null)
  const [backendStatus, setBackendStatus] = useState({ checked: false, available: false })

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
    
    console.log('=== FRONTEND DEBUG START ===')
    console.log('Starting file upload for:', file.name, file.type, file.size)
    
    setIsAnalyzing(true)
    setOriginalFileName(file.name)
    setAnalysisResult(null)
    
    try {
      console.log('=== FRONTEND ANALYSIS DEBUG START ===')
      console.log('Calling analyzeResumeFile...')
      const result = await analyzeResumeFile(file)
      console.log('=== ANALYSIS RESULT RECEIVED ===')
      console.log('Full analysis result:', result)
      console.log('Has extractedData?', !!(result.extractedData))
      console.log('ExtractedData keys:', result.extractedData ? Object.keys(result.extractedData) : 'None')
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
          type: file.type || 'Unknown'
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
    console.log('=== RENDER EXTRACTED DATA ===')
    console.log('Received extractedData:', extractedData)
    console.log('Backend extracted?', extractedData?._backendExtracted)
    console.log('Personal info:', extractedData?.personalInfo)
    
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
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            Your Resume Information
            {extractedData._backendExtracted && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                ✅ AI Extracted
              </span>
            )}
          </h3>
          
          {/* Personal Information */}
          {extractedData.personalInfo && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">👤 Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extractedData.personalInfo.fullName && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium text-blue-800">Name:</span>
                    <p className="text-blue-700 text-lg font-semibold">{extractedData.personalInfo.fullName}</p>
                  </div>
                )}
                {extractedData.personalInfo.email && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <span className="font-medium text-green-800">Email:</span>
                    <p className="text-green-700">{extractedData.personalInfo.email}</p>
                  </div>
                )}
                {extractedData.personalInfo.phone && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <span className="font-medium text-purple-800">Phone:</span>
                    <p className="text-purple-700">{extractedData.personalInfo.phone}</p>
                  </div>
                )}
                {extractedData.personalInfo.location && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <span className="font-medium text-orange-800">Location:</span>
                    <p className="text-orange-700">{extractedData.personalInfo.location}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Professional Summary */}
          {extractedData.summary && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">📝 Professional Summary</h4>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-indigo-800 leading-relaxed">{extractedData.summary}</p>
              </div>
            </div>
          )}

          {/* Skills */}
          {extractedData.skills && extractedData.skills.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">🎯 Skills ({extractedData.skills.length})</h4>
              <div className="flex flex-wrap gap-2">
                {extractedData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {extractedData.experience && extractedData.experience.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">💼 Work Experience ({extractedData.experience.length} entries)</h4>
              <div className="space-y-4">
                {extractedData.experience.map((exp, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-semibold text-gray-900">{exp.position || `Position ${index + 1}`}</h5>
                        <p className="text-gray-600">{exp.company || 'Company not specified'}</p>
                        {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                      </div>
                      <span className="text-sm text-gray-500">
                        {exp.startDate || 'Start date not specified'} - {exp.endDate || (exp.current ? 'Present' : 'End date not specified')}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 whitespace-pre-line text-sm">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {extractedData.education && extractedData.education.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">🎓 Education ({extractedData.education.length} entries)</h4>
              <div className="space-y-3">
                {extractedData.education.map((edu, index) => (
                  <div key={index} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h5 className="font-semibold text-green-900">
                      {edu.degree && edu.field ? `${edu.degree} in ${edu.field}` : (edu.degree || edu.field || `Education ${index + 1}`)}
                    </h5>
                    <p className="text-green-700">{edu.school || 'Institution not specified'}</p>
                    <div className="flex justify-between items-center mt-1">
                      {edu.location && <span className="text-sm text-green-600">{edu.location}</span>}
                      <span className="text-sm text-green-600">{edu.graduationDate || 'Date not specified'}</span>
                    </div>
                    {edu.gpa && <p className="text-sm text-green-600 mt-1">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-2">📊 Extraction Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
              <div>
                <span className="font-medium">Method:</span> {extractedData._backendExtracted ? 'Backend AI Analysis' : 'Frontend Analysis'}
              </div>
              <div>
                <span className="font-medium">Content Length:</span> {extractedData._rawText?.length || 0} characters
              </div>
              <div>
                <span className="font-medium">Backend Status:</span> {backendStatus.available ? '🟢 Online' : '🔴 Offline'}
              </div>
            </div>
          </div>
        </div>
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
