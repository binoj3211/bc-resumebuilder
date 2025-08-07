import React from 'react'

const ExecutiveTemplate = ({ data }) => {
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
    <div className="max-w-4xl mx-auto bg-white p-8 min-h-[11in]" style={{ fontSize: '14px', lineHeight: '1.5' }}>
      {/* Header with Gold Accent */}
      <div className="relative mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 to-green-400"></div>
        <div className="pt-6 pb-4">
          <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-wide">
            {data.personalInfo?.fullName || 'Your Name'}
          </h1>
          
          <div className="grid grid-cols-2 gap-8 mt-4">
            <div className="space-y-1 text-sm text-gray-700">
              {data.personalInfo?.email && (
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">Email:</span>
                  <span>{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo?.phone && (
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">Phone:</span>
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo?.location && (
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">Location:</span>
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              {data.personalInfo?.linkedin && (
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">LinkedIn:</span>
                  <span className="break-all">{data.personalInfo.linkedin.replace('https://', '')}</span>
                </div>
              )}
              {data.personalInfo?.website && (
                <div className="flex items-center">
                  <span className="w-20 text-gray-500">Website:</span>
                  <span className="break-all">{data.personalInfo.website.replace('https://', '')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      {data.summary && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mr-4">Executive Summary</h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <p className="text-gray-700 leading-relaxed text-justify font-light">{data.summary}</p>
        </div>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mr-4">Professional Experience</h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={exp.id || index} className="relative">
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-green-600 font-medium text-base">{exp.company}</p>
                    {exp.location && (
                      <p className="text-sm text-gray-600">{exp.location}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1 rounded">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </p>
                  </div>
                </div>
                {exp.description && (
                  <div className="ml-4 border-l-2 border-green-200 pl-4">
                    {exp.description.split('\n').map((line, idx) => (
                      <p key={idx} className="text-gray-700 text-sm mb-2 font-light">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mr-4">Education</h2>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={edu.id || index} className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-green-600 font-medium">{edu.institution}</p>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{edu.location}</span>
                    <span>{formatDateRange(edu.startDate, edu.endDate)}</span>
                  </div>
                  {(edu.gpa || edu.honors) && (
                    <p className="text-sm text-gray-600 mt-1">
                      {edu.gpa && `GPA: ${edu.gpa}`}
                      {edu.gpa && edu.honors && ' • '}
                      {edu.honors}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mr-4">Certifications</h2>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="space-y-4">
              {data.certifications.map((cert, index) => (
                <div key={cert.id || index} className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <p className="text-green-600 font-medium">{cert.issuer}</p>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                    <span>
                      {formatDate(cert.issueDate)}
                      {cert.expirationDate && ` - ${formatDate(cert.expirationDate)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Core Competencies */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mr-4">Core Competencies</h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-gray-50 p-6 rounded">
            {Object.entries(
              data.skills.reduce((groups, skill) => {
                const category = skill.category || 'Other'
                if (!groups[category]) groups[category] = []
                groups[category].push(skill)
                return groups
              }, {})
            ).map(([category, skills]) => (
              <div key={category} className="mb-4 last:mb-0">
                <h3 className="font-semibold text-gray-900 mb-2 text-green-700">{category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="bg-white px-3 py-2 rounded shadow-sm text-sm text-center font-medium text-gray-700"
                    >
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
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mr-4">Languages</h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-gray-50 p-6 rounded">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.languages.map((lang, idx) => (
                <div key={idx} className="bg-white p-3 rounded shadow-sm text-center">
                  <div className="font-semibold text-gray-900">{lang.language}</div>
                  <div className="text-sm text-green-600">{lang.proficiency}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notable Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mr-4">Notable Projects</h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={project.id || index} className="border border-gray-200 p-4 rounded">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {formatDateRange(project.startDate, project.endDate)}
                  </span>
                </div>
                <p className="text-sm text-green-600 font-medium mb-2">{project.technologies}</p>
                {project.description && (
                  <p className="text-gray-700 text-sm font-light">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hobbies & Interests */}
      {data.hobbies && data.hobbies.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mr-4">Hobbies & Interests</h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-gray-50 p-6 rounded">
            <div className="flex flex-wrap gap-3">
              {data.hobbies.map((hobby, idx) => (
                <span key={idx} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {typeof hobby === 'string' ? hobby : hobby.hobby}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExecutiveTemplate
