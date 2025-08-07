import React, { useState, useEffect } from 'react'
import { ArrowLeft, Download, Edit3, Save, Copy } from 'lucide-react'

const SimpleATSGenerator = ({ analysisResult, extractedData, onBack }) => {
  const [resumeData, setResumeData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('SimpleATSGenerator mounted')
    console.log('Props received:', { analysisResult, extractedData })
    
    // Create sample data immediately
    const sampleData = {
      personalInfo: {
        fullName: "John Smith",
        email: "john.smith@email.com", 
        phone: "+1 (555) 123-4567",
        address: "123 Main Street, New York, NY 10001"
      },
      summary: "Experienced Software Engineer with 5+ years in full-stack development. Proven track record of delivering scalable web applications and leading cross-functional teams.",
      skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "MongoDB", "SQL"],
      experience: [
        {
          position: "Senior Software Engineer",
          company: "Tech Solutions Inc.",
          duration: "2021 - Present",
          description: [
            "Led development of microservices architecture serving 10M+ users",
            "Mentored junior developers and conducted code reviews",
            "Improved application performance by 40% through optimization"
          ]
        }
      ],
      education: [
        {
          degree: "Bachelor of Science",
          field: "Computer Science",
          institution: "State University",
          year: "2019"
        }
      ]
    }

    setResumeData(sampleData)
    setIsLoading(false)
    console.log('Sample data loaded:', sampleData)
  }, [])

  const handleEdit = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const exportResume = () => {
    const content = document.getElementById('resume-content').innerHTML
    const blob = new Blob([`
      <html>
        <head>
          <title>Resume - ${resumeData.personalInfo.fullName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
            h2 { color: #374151; margin-top: 24px; }
            .skill { background: #f3f4f6; padding: 4px 8px; margin: 2px; border-radius: 4px; display: inline-block; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `], { type: 'text/html' })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ATS Resume Generator...</p>
        </div>
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> No resume data available
            <button onClick={onBack} className="ml-4 bg-red-600 text-white px-3 py-1 rounded">
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Controls */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Analyzer</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">ATS Resume Generator</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                {isEditing ? 'Save Changes' : 'Edit Resume'}
              </button>
              
              <button
                onClick={exportResume}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <Download size={16} />
                Export HTML
              </button>
              
              <button
                onClick={() => {
                  const text = document.getElementById('resume-content').innerText
                  navigator.clipboard.writeText(text).then(() => alert('Resume copied to clipboard!'))
                }}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                <Copy size={16} />
                Copy Text
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div id="resume-content" className="p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
            
            {/* Header Section */}
            <header className="text-center border-b-3 border-blue-600 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => handleEdit('personalInfo', 'fullName', e.target.value)}
                    className="w-full text-4xl font-bold text-center border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                  />
                ) : (
                  resumeData.personalInfo.fullName
                )}
              </h1>
              
              <div className="flex justify-center items-center gap-6 text-gray-600 text-sm mt-4">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  {isEditing ? (
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handleEdit('personalInfo', 'email', e.target.value)}
                      className="border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                    />
                  ) : (
                    <span>{resumeData.personalInfo.email}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span>📱</span>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handleEdit('personalInfo', 'phone', e.target.value)}
                      className="border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                    />
                  ) : (
                    <span>{resumeData.personalInfo.phone}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={resumeData.personalInfo.address}
                      onChange={(e) => handleEdit('personalInfo', 'address', e.target.value)}
                      className="border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                    />
                  ) : (
                    <span>{resumeData.personalInfo.address}</span>
                  )}
                </div>
              </div>
            </header>

            {/* Professional Summary */}
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide border-b-2 border-gray-300 pb-1">
                Professional Summary
              </h2>
              {isEditing ? (
                <textarea
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({...prev, summary: e.target.value}))}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  rows="4"
                  placeholder="Write your professional summary..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed text-justify">
                  {resumeData.summary}
                </p>
              )}
            </section>

            {/* Core Skills */}
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide border-b-2 border-gray-300 pb-1">
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
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="JavaScript, React, Node.js, Python (comma separated)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Professional Experience */}
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide border-b-2 border-gray-300 pb-1">
                Professional Experience
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="mb-5 last:mb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isEditing ? (
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience]
                              newExp[index] = {...newExp[index], position: e.target.value}
                              setResumeData(prev => ({...prev, experience: newExp}))
                            }}
                            className="w-full font-semibold text-lg border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                          />
                        ) : (
                          exp.position
                        )}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {isEditing ? (
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...resumeData.experience]
                              newExp[index] = {...newExp[index], company: e.target.value}
                              setResumeData(prev => ({...prev, experience: newExp}))
                            }}
                            className="text-blue-600 font-medium border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                          />
                        ) : (
                          exp.company
                        )}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600 font-medium ml-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience]
                            newExp[index] = {...newExp[index], duration: e.target.value}
                            setResumeData(prev => ({...prev, experience: newExp}))
                          }}
                          className="text-sm text-right w-32 border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                        />
                      ) : (
                        exp.duration
                      )}
                    </span>
                  </div>
                  
                  {exp.description && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                      {exp.description.map((desc, descIndex) => (
                        <li key={descIndex} className="leading-relaxed">
                          {isEditing ? (
                            <input
                              type="text"
                              value={desc}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience]
                                const newDesc = [...newExp[index].description]
                                newDesc[descIndex] = e.target.value
                                newExp[index] = {...newExp[index], description: newDesc}
                                setResumeData(prev => ({...prev, experience: newExp}))
                              }}
                              className="w-full ml-2 border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                            />
                          ) : (
                            <span className="ml-2">{desc}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>

            {/* Education */}
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide border-b-2 border-gray-300 pb-1">
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {isEditing ? (
                          <input
                            type="text"
                            value={`${edu.degree} in ${edu.field}`}
                            onChange={(e) => {
                              const parts = e.target.value.split(' in ')
                              const newEdu = [...resumeData.education]
                              newEdu[index] = {
                                ...newEdu[index], 
                                degree: parts[0] || '', 
                                field: parts[1] || ''
                              }
                              setResumeData(prev => ({...prev, education: newEdu}))
                            }}
                            className="w-full font-semibold text-lg border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                          />
                        ) : (
                          `${edu.degree} in ${edu.field}`
                        )}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {isEditing ? (
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const newEdu = [...resumeData.education]
                              newEdu[index] = {...newEdu[index], institution: e.target.value}
                              setResumeData(prev => ({...prev, education: newEdu}))
                            }}
                            className="text-blue-600 font-medium border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                          />
                        ) : (
                          edu.institution
                        )}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600 font-medium ml-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => {
                            const newEdu = [...resumeData.education]
                            newEdu[index] = {...newEdu[index], year: e.target.value}
                            setResumeData(prev => ({...prev, education: newEdu}))
                          }}
                          className="text-sm text-right w-16 border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                        />
                      ) : (
                        edu.year
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </section>

          </div>
        </div>

        {/* ATS Optimization Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-blue-800">🎯 ATS-Optimized Resume</h3>
            <p className="text-blue-600 text-sm mt-1">This resume is designed to pass Applicant Tracking Systems</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">✅ ATS-Friendly Features:</h4>
              <ul className="space-y-1 text-green-600">
                <li>• Standard section headers</li>
                <li>• Clean, simple formatting</li>
                <li>• Standard Arial font</li>
                <li>• Keyword optimization ready</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">🚀 Best Practices:</h4>
              <ul className="space-y-1 text-blue-600">
                <li>• Chronological format</li>
                <li>• Action verbs in descriptions</li>
                <li>• Quantifiable achievements</li>
                <li>• Industry-relevant keywords</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>💡 Pro Tip:</strong> Customize the skills and experience sections for each job application 
              to include relevant keywords from the job posting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleATSGenerator
