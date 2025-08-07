import React, { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Download, Edit3, Eye, Save, Copy, Printer } from 'lucide-react'

const ATSResumeGenerator = ({ analysisResult, extractedData, onBack }) => {
  const [resumeData, setResumeData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const resumeRef = useRef()

  // Initialize data
  useEffect(() => {
    console.log('ATS Generator Mounted')
    console.log('Props - analysisResult:', analysisResult)
    console.log('Props - extractedData:', extractedData)
    
    // Try to get data from various sources
    let data = extractedData || analysisResult?.extractedData || analysisResult?.data
    
    // If no data from props, check localStorage
    if (!data) {
      try {
        const stored = localStorage.getItem('extractedResumeData')
        if (stored) {
          data = JSON.parse(stored)
          console.log('Loaded from localStorage:', data)
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
      }
    }

    // If still no data, create sample data
    if (!data) {
      data = {
        personalInfo: {
          fullName: "John Smith",
          email: "john.smith@email.com",
          phone: "+1 (555) 123-4567",
          address: "123 Main Street, New York, NY 10001"
        },
        summary: "Experienced professional with strong background in technology and leadership.",
        skills: ["JavaScript", "React", "Node.js", "Project Management", "Team Leadership"],
        experience: [
          {
            position: "Software Engineer",
            company: "Tech Company",
            duration: "2020 - Present",
            description: [
              "Developed web applications using modern technologies",
              "Collaborated with cross-functional teams",
              "Improved system performance and reliability"
            ]
          }
        ],
        education: [
          {
            degree: "Bachelor of Science",
            field: "Computer Science",
            institution: "University",
            year: "2020"
          }
        ]
      }
      console.log('Using sample data')
    }

    setResumeData(data)
    console.log('Resume data set:', data)
  }, [analysisResult, extractedData])

  const handleEdit = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleArrayEdit = (section, index, field, value) => {
    setResumeData(prev => {
      const newArray = [...(prev[section] || [])]
      newArray[index] = {
        ...newArray[index],
        [field]: value
      }
      return {
        ...prev,
        [section]: newArray
      }
    })
  }

  const exportToPDF = async () => {
    try {
      // Simple download as HTML for now
      const element = resumeRef.current
      const htmlContent = element.innerHTML
      const blob = new Blob([`
        <html>
          <head>
            <title>Resume - ${resumeData.personalInfo?.fullName || 'Resume'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .resume { max-width: 800px; margin: 0 auto; }
              h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
              h2 { color: #374151; margin-top: 24px; margin-bottom: 8px; }
              .contact-info { margin-bottom: 16px; }
              .experience-item, .education-item { margin-bottom: 16px; }
              .skills { display: flex; flex-wrap: wrap; gap: 8px; }
              .skill { background: #f3f4f6; padding: 4px 8px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="resume">${htmlContent}</div>
          </body>
        </html>
      `], { type: 'text/html' })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume-${resumeData.personalInfo?.fullName?.replace(/\s+/g, '-') || 'resume'}.html`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const copyToClipboard = () => {
    const element = resumeRef.current
    const text = element.innerText
    navigator.clipboard.writeText(text).then(() => {
      alert('Resume copied to clipboard!')
    }).catch(err => {
      console.error('Copy failed:', err)
    })
  }

  if (!resumeData.personalInfo) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading ATS Resume Generator...</h2>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                Back to Analyzer
              </button>
              <h1 className="text-2xl font-bold text-gray-900">ATS Resume Generator</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                {isEditing ? 'Save Changes' : 'Edit Mode'}
              </button>
              
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700"
              >
                <Download size={16} />
                Export
              </button>
              
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700"
              >
                <Copy size={16} />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div ref={resumeRef} className="p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <header className="border-b-2 border-blue-600 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={resumeData.personalInfo?.fullName || ''}
                    onChange={(e) => handleEdit('personalInfo', 'fullName', e.target.value)}
                    className="w-full text-3xl font-bold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                    placeholder="Your Full Name"
                  />
                ) : (
                  resumeData.personalInfo?.fullName || 'Your Full Name'
                )}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600 text-sm">
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      value={resumeData.personalInfo?.email || ''}
                      onChange={(e) => handleEdit('personalInfo', 'email', e.target.value)}
                      className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                      placeholder="email@example.com"
                    />
                    <input
                      type="tel"
                      value={resumeData.personalInfo?.phone || ''}
                      onChange={(e) => handleEdit('personalInfo', 'phone', e.target.value)}
                      className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                      placeholder="Phone number"
                    />
                    <input
                      type="text"
                      value={resumeData.personalInfo?.address || ''}
                      onChange={(e) => handleEdit('personalInfo', 'address', e.target.value)}
                      className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none col-span-2"
                      placeholder="Address"
                    />
                  </>
                ) : (
                  <>
                    <div>📧 {resumeData.personalInfo?.email}</div>
                    <div>📱 {resumeData.personalInfo?.phone}</div>
                    <div className="col-span-2">📍 {resumeData.personalInfo?.address}</div>
                  </>
                )}
              </div>
            </header>

            {/* Professional Summary */}
            {resumeData.summary && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                  Professional Summary
                </h2>
                {isEditing ? (
                  <textarea
                    value={resumeData.summary}
                    onChange={(e) => setResumeData(prev => ({...prev, summary: e.target.value}))}
                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                    rows="3"
                    placeholder="Write your professional summary..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                )}
              </section>
            )}

            {/* Skills */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                  Core Skills
                </h2>
                {isEditing ? (
                  <input
                    type="text"
                    value={resumeData.skills.join(', ')}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev, 
                      skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    }))}
                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none"
                    placeholder="JavaScript, React, Node.js (comma separated)"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Experience */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                  Professional Experience
                </h2>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {isEditing ? (
                          <input
                            type="text"
                            value={exp.position || ''}
                            onChange={(e) => handleArrayEdit('experience', index, 'position', e.target.value)}
                            className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-semibold"
                            placeholder="Job Title"
                          />
                        ) : (
                          exp.position
                        )}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {isEditing ? (
                          <input
                            type="text"
                            value={exp.duration || ''}
                            onChange={(e) => handleArrayEdit('experience', index, 'duration', e.target.value)}
                            className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm text-right"
                            placeholder="2020 - Present"
                          />
                        ) : (
                          exp.duration
                        )}
                      </span>
                    </div>
                    <p className="text-blue-600 mb-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => handleArrayEdit('experience', index, 'company', e.target.value)}
                          className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-blue-600"
                          placeholder="Company Name"
                        />
                      ) : (
                        exp.company
                      )}
                    </p>
                    {exp.description && Array.isArray(exp.description) && (
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {exp.description.map((desc, descIndex) => (
                          <li key={descIndex}>
                            {isEditing ? (
                              <input
                                type="text"
                                value={desc}
                                onChange={(e) => {
                                  const newDesc = [...exp.description]
                                  newDesc[descIndex] = e.target.value
                                  handleArrayEdit('experience', index, 'description', newDesc)
                                }}
                                className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none w-full"
                                placeholder="Achievement or responsibility"
                              />
                            ) : (
                              desc
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
                  Education
                </h2>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`${edu.degree || ''} ${edu.field || ''}`.trim()}
                              onChange={(e) => {
                                const parts = e.target.value.split(' ')
                                const degree = parts[0] || ''
                                const field = parts.slice(1).join(' ') || ''
                                handleArrayEdit('education', index, 'degree', degree)
                                handleArrayEdit('education', index, 'field', field)
                              }}
                              className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-semibold"
                              placeholder="Bachelor of Science Computer Science"
                            />
                          ) : (
                            `${edu.degree || ''} ${edu.field || ''}`.trim()
                          )}
                        </h3>
                        <p className="text-blue-600">
                          {isEditing ? (
                            <input
                              type="text"
                              value={edu.institution || ''}
                              onChange={(e) => handleArrayEdit('education', index, 'institution', e.target.value)}
                              className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-blue-600"
                              placeholder="University Name"
                            />
                          ) : (
                            edu.institution
                          )}
                        </p>
                      </div>
                      <span className="text-sm text-gray-600">
                        {isEditing ? (
                          <input
                            type="text"
                            value={edu.year || ''}
                            onChange={(e) => handleArrayEdit('education', index, 'year', e.target.value)}
                            className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm text-right w-16"
                            placeholder="2020"
                          />
                        ) : (
                          edu.year
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>

        {/* ATS Tips */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            🎯 ATS Optimization Tips
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li>✅ Uses standard section headers (Professional Summary, Experience, Education)</li>
            <li>✅ Clean, simple formatting without complex layouts</li>
            <li>✅ Standard fonts (Arial) for maximum compatibility</li>
            <li>✅ Keyword-rich content for better matching</li>
            <li>✅ Chronological experience format</li>
            <li>✅ Easy to edit for job-specific customization</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ATSResumeGenerator
