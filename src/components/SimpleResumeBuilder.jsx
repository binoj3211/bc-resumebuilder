import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'

const SimpleResumeBuilder = () => {
  const navigate = useNavigate()
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA'
    },
    summary: 'Experienced software developer with 5+ years in web development.',
    experience: [
      {
        id: 1,
        position: 'Software Engineer',
        company: 'Tech Corp',
        startDate: '2020-01',
        current: true,
        description: 'Developed web applications using React and Node.js'
      }
    ]
  })

  const handleGoBack = () => {
    navigate('/')
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
              <h1 className="text-xl font-semibold text-gray-900">Resume Builder (Simple)</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                  }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value }
                  }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="bg-white p-6 rounded">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {resumeData.personalInfo.fullName}
                </h1>
                <p className="text-gray-600 mb-4">{resumeData.personalInfo.email}</p>
                
                {resumeData.summary && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary</h2>
                    <p className="text-gray-700">{resumeData.summary}</p>
                  </div>
                )}

                {resumeData.experience && resumeData.experience.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Experience</h2>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="mb-2">
                        <h3 className="font-medium">{exp.position}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-sm text-green-600 mt-4 p-2 bg-green-50 rounded">
                  ✓ Resume Builder is working! You can edit the form and see live updates.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleResumeBuilder
