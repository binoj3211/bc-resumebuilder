import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Eye, Save, RotateCcw, Users } from 'lucide-react'
import ResumeForm from './ResumeForm'
import ResumePreview from './ResumePreview'
import TemplateSelector from './TemplateSelector'
import { generatePDF } from '../utils/pdfGenerator'
import { analyzeResumeContent } from '../utils/atsAnalyzer'
import PDFTemplate from '../templates/PDFTemplate'
// import { useAuth } from '../context/AuthContext'

const ResumeBuilder = () => {
  const navigate = useNavigate()
  const { resumeId } = useParams()
  // const { isAuthenticated, user, saveResume, loadResume } = useAuth()
  const isAuthenticated = false
  const user = null
  const saveResume = () => {}
  const loadResume = () => {}
  
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    hobbies: []
  })

  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [atsScore, setAtsScore] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [sectionOrder, setSectionOrder] = useState([])
  const previewRef = useRef()

  // Load existing resume if resumeId is provided
  useEffect(() => {
    if (resumeId && isAuthenticated) {
      const loadedResume = loadResume(resumeId)
      if (loadedResume) {
        setResumeData(loadedResume.data)
        setSelectedTemplate(loadedResume.template)
      }
    }
  }, [resumeId, isAuthenticated, loadResume])

  const handleDataChange = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }))
    
    // Analyze ATS score when data changes
    const score = analyzeResumeContent({ ...resumeData, [section]: data })
    setAtsScore(score)
  }

  const handleSaveResume = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to save your resume')
      return
    }

    setIsSaving(true)
    try {
      const resumeName = resumeData.personalInfo.fullName 
        ? `${resumeData.personalInfo.fullName}'s Resume`
        : 'Untitled Resume'
      
      await saveResume({
        name: resumeName,
        data: resumeData,
        template: selectedTemplate
      }, resumeId)
      
      setSaveMessage('Resume saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error saving resume:', error)
      setSaveMessage('Failed to save resume')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (previewRef.current) {
      try {
        await generatePDF(previewRef.current, resumeData.personalInfo.fullName || 'resume')
      } catch (error) {
        console.error('PDF generation error:', error)
        alert('Failed to generate PDF. Please try again.')
      }
    }
  }

  const handleGoBack = () => {
    navigate('/')
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      setResumeData({
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          website: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        hobbies: []
      })
      setAtsScore(null)
    }
  }

  const handleLoadDemo = () => {
    if (window.confirm('This will replace your current data with demo content. Continue?')) {
      setResumeData({
        personalInfo: {
          fullName: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'https://linkedin.com/in/johnsmith',
          website: 'https://johnsmith.dev'
        },
        summary: 'Results-driven Software Engineer with 5+ years of experience developing scalable web applications and leading cross-functional teams. Proven track record of increasing system performance by 40% and reducing deployment time by 60%. Passionate about clean code, user experience, and mentoring junior developers.',
        experience: [
          {
            id: 1,
            position: 'Senior Software Engineer',
            company: 'Tech Solutions Inc.',
            location: 'San Francisco, CA',
            startDate: '2022-01',
            endDate: '',
            current: true,
            description: '• Led development of microservices architecture serving 1M+ users\n• Improved system performance by 40% through code optimization\n• Mentored team of 5 junior developers\n• Implemented CI/CD pipeline reducing deployment time by 60%'
          },
          {
            id: 2,
            position: 'Software Engineer',
            company: 'StartupCo',
            location: 'San Francisco, CA',
            startDate: '2020-06',
            endDate: '2021-12',
            current: false,
            description: '• Built responsive web applications using React and Node.js\n• Collaborated with designers to implement pixel-perfect UIs\n• Reduced page load time by 50% through optimization\n• Participated in agile development process'
          }
        ],
        education: [
          {
            id: 1,
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            institution: 'University of California, Berkeley',
            location: 'Berkeley, CA',
            graduationDate: '2020-05',
            gpa: '3.8'
          }
        ],
        skills: [
          { id: 1, name: 'JavaScript', category: 'Programming', level: 'Expert' },
          { id: 2, name: 'React', category: 'Technical', level: 'Expert' },
          { id: 3, name: 'Node.js', category: 'Technical', level: 'Advanced' },
          { id: 4, name: 'Python', category: 'Programming', level: 'Advanced' },
          { id: 5, name: 'AWS', category: 'Tools', level: 'Intermediate' },
          { id: 6, name: 'Leadership', category: 'Soft Skills', level: 'Advanced' },
          { id: 7, name: 'Problem Solving', category: 'Soft Skills', level: 'Expert' }
        ],
        projects: [
          {
            id: 1,
            name: 'E-Commerce Platform',
            description: 'Full-stack e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and admin dashboard.',
            technologies: 'React, Node.js, PostgreSQL, Stripe',
            link: 'https://github.com/johnsmith/ecommerce',
            startDate: '2023-01',
            endDate: '2023-06'
          }
        ],
        certifications: [
          {
            id: 1,
            name: 'AWS Solutions Architect Associate',
            issuer: 'Amazon Web Services',
            date: '2023-03',
            credentialId: 'AWS-SAA-123456',
            link: 'https://aws.amazon.com/certification/'
          }
        ],
        languages: [
          {
            language: 'English',
            proficiency: 'Native'
          },
          {
            language: 'Spanish',
            proficiency: 'Conversational'
          },
          {
            language: 'French',
            proficiency: 'Beginner'
          }
        ],
        hobbies: [
          'Photography',
          'Hiking',
          'Open Source Contributing',
          'Reading Tech Blogs',
          'Playing Guitar'
        ]
      })
      
      // Analyze the demo data
      const score = analyzeResumeContent({
        personalInfo: {
          fullName: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'https://linkedin.com/in/johnsmith',
          website: 'https://johnsmith.dev'
        },
        summary: 'Results-driven Software Engineer with 5+ years of experience...',
        experience: [{ position: 'Senior Software Engineer', company: 'Tech Solutions Inc.' }],
        education: [{ degree: 'Bachelor of Science', field: 'Computer Science' }],
        skills: [{ name: 'JavaScript' }, { name: 'React' }],
        projects: [{ name: 'E-Commerce Platform' }],
        certifications: [{ name: 'AWS Solutions Architect Associate' }]
      })
      setAtsScore(score)
    }
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
              <h1 className="text-xl font-semibold text-gray-900">Resume Builder</h1>
            </div>

            <div className="flex items-center space-x-3">
              {/* Save Message */}
              {saveMessage && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  saveMessage.includes('successfully') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {saveMessage}
                </div>
              )}
              
              {atsScore && (
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
              
              {/* Save Button for authenticated users */}
              {isAuthenticated && (
                <button
                  onClick={handleSaveResume}
                  disabled={isSaving}
                  className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Resume'}</span>
                </button>
              )}
              
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
              </button>
              
              <button
                onClick={handleDownloadPDF}
                className="btn-primary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleLoadDemo}
                className="btn-secondary flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Load Demo</span>
              </button>

              <button
                onClick={handleReset}
                className="btn-secondary flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isPreviewMode ? (
          // Full-width preview mode
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <ResumePreview
              ref={previewRef}
              data={resumeData}
              template={selectedTemplate}
              sectionOrder={sectionOrder}
            />
          </div>
        ) : (
          // Split view mode
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-6">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
              <ResumeForm
                data={resumeData}
                onChange={handleDataChange}
                atsScore={atsScore}
                onSectionOrderChange={setSectionOrder}
              />
            </div>

            {/* Preview Section */}
            <div className="sticky top-24 h-fit">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">Live Preview</h3>
                </div>
                <div className="p-4">
                  <div className="transform scale-75 origin-top-left" style={{ width: '133.33%' }}>
                    <ResumePreview
                      ref={previewRef}
                      data={resumeData}
                      template={selectedTemplate}
                      sectionOrder={sectionOrder}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeBuilder
