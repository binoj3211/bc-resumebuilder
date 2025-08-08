import React from 'react'

const CreativeTemplate = ({ data }) => {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const formatDateRange = (startDate, endDate, current) => {
    const start = formatDate(startDate)
    const end = current ? 'Present' : formatDate(endDate)
    return `${start} - ${end}`
  }

  return (
    <div style={{
      width: '100%', // Take full width of container
      minHeight: '100%', // Take full height of container
      margin: 0,
      backgroundColor: 'white',
      fontSize: '12px',
      lineHeight: '1.4',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Left Sidebar */}
        <div style={{
          width: '33.333%',
          background: 'linear-gradient(to bottom, #9333ea, #7c3aed)',
          color: 'white',
          padding: '20px'
        }}>
          {/* Personal Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">
              {data.personalInfo?.fullName || 'Your Name'}
            </h1>
            
            <div className="space-y-2 text-sm">
              {data.personalInfo?.email && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-200">✉</span>
                  <span>{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo?.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-200">📞</span>
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo?.location && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-200">📍</span>
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
              {data.personalInfo?.linkedin && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-200">💼</span>
                  <span className="text-xs break-all">{data.personalInfo.linkedin.replace('https://', '')}</span>
                </div>
              )}
              {data.personalInfo?.website && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-200">🌐</span>
                  <span className="text-xs break-all">{data.personalInfo.website.replace('https://', '')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b border-purple-400 pb-1">
                Skills
              </h2>
              <div className="space-y-3">
                {Object.entries(
                  data.skills.reduce((groups, skill) => {
                    const category = skill.category || 'Other'
                    if (!groups[category]) groups[category] = []
                    groups[category].push(skill)
                    return groups
                  }, {})
                ).map(([category, skills]) => (
                  <div key={category} className="mb-3">
                    <h3 className="font-semibold text-purple-200 text-sm mb-2">{category}</h3>
                    <div className="space-y-1">
                      {skills.map((skill, idx) => (
                        <div key={idx} className="bg-purple-500 bg-opacity-50 px-2 py-1 rounded text-xs">
                          {skill.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b border-purple-400 pb-1">
                Languages
              </h2>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="bg-purple-500 bg-opacity-50 px-2 py-1 rounded text-xs">
                    <div className="font-semibold text-purple-100">{lang.language}</div>
                    <div className="text-purple-200">{lang.proficiency}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 border-b border-purple-400 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={edu.id || index} className="text-sm">
                    <h3 className="font-semibold text-purple-100">{edu.degree}</h3>
                    <p className="text-purple-200">{edu.field}</p>
                    <p className="text-purple-300 text-xs">{edu.institution}</p>
                    <p className="text-purple-300 text-xs">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Content */}
        <div className="w-2/3 p-6">
          {/* Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-purple-700 mb-3 relative">
                About Me
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-purple-600"></div>
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-purple-700 mb-3 relative">
                Experience
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-purple-600"></div>
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={exp.id || index} className="relative pl-4 border-l-2 border-purple-200">
                    <div className="absolute -left-2 top-2 w-4 h-4 bg-purple-600 rounded-full"></div>
                    <div className="mb-2">
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <p className="text-purple-600 font-semibold">{exp.company}</p>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{exp.location}</span>
                        <span>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 text-sm">
                        {exp.description.split('\n').map((line, idx) => (
                          <p key={idx} className="mb-1">{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-purple-700 mb-3 relative">
                Projects
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-purple-600"></div>
              </h2>
              <div className="grid gap-4">
                {data.projects.map((project, index) => (
                  <div key={project.id || index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-600">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      <span className="text-xs text-gray-600">
                        {formatDateRange(project.startDate, project.endDate)}
                      </span>
                    </div>
                    <p className="text-sm text-purple-600 mb-2">{project.technologies}</p>
                    {project.description && (
                      <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                    )}
                    <div className="flex gap-4">
                      {project.url && (
                        <span className="text-xs text-purple-600 underline">Live Demo</span>
                      )}
                      {project.github && (
                        <span className="text-xs text-purple-600 underline">GitHub</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-purple-700 mb-3 relative">
                Certifications
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-purple-600"></div>
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert, index) => (
                  <div key={cert.id || index} className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                        <p className="text-purple-600 text-sm">{cert.issuer}</p>
                      </div>
                      <span className="text-xs text-gray-600">
                        {formatDate(cert.issueDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {data.hobbies && data.hobbies.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-purple-700 mb-3 relative">
                Hobbies & Interests
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-purple-600"></div>
              </h2>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {data.hobbies.map((hobby, idx) => (
                    <span key={idx} className="bg-purple-600 text-white px-2 py-1 rounded text-sm">
                      {typeof hobby === 'string' ? hobby : hobby.hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreativeTemplate
