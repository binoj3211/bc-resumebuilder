import React from 'react'

const ClassicTemplate = ({ data }) => {
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
      padding: '15mm', // Standard A4 margins
      fontSize: '12px',
      lineHeight: '1.4',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        borderBottom: '2px solid black',
        paddingBottom: '16px',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'black',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          margin: '0 0 8px 0'
        }}>
          {data.personalInfo?.fullName || 'Your Name'}
        </h1>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '11px',
          color: 'black'
        }}>
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>•</span>}
          {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>•</span>}
          {data.personalInfo?.location && <span>{data.personalInfo.location}</span>}
        </div>
        
        {(data.personalInfo?.linkedin || data.personalInfo?.website) && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '11px',
            color: 'black',
            marginTop: '4px'
          }}>
            {data.personalInfo?.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo?.website && data.personalInfo?.linkedin && <span>•</span>}
            {data.personalInfo?.website && <span>{data.personalInfo.website}</span>}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide border-b border-black pb-1">
            Summary
          </h2>
          <p className="text-black leading-relaxed text-justify">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide border-b border-black pb-1">
            Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={exp.id || index} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-black">{exp.position}</h3>
                    <p className="font-semibold text-black">{exp.company}</p>
                    {exp.location && (
                      <p className="text-sm text-black italic">{exp.location}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-black font-medium">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </p>
                  </div>
                </div>
                {exp.description && (
                  <div className="mt-2 ml-4">
                    {exp.description.split('\n').map((line, idx) => (
                      <p key={idx} className="text-black text-sm mb-1">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide border-b border-black pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={edu.id || index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-black">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </h3>
                    <p className="font-semibold text-black">{edu.institution}</p>
                    {edu.location && (
                      <p className="text-sm text-black italic">{edu.location}</p>
                    )}
                    {(edu.gpa || edu.honors) && (
                      <p className="text-sm text-black">
                        {edu.gpa && `GPA: ${edu.gpa}`}
                        {edu.gpa && edu.honors && ', '}
                        {edu.honors}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-black font-medium">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide border-b border-black pb-1">
            Skills
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(
              data.skills.reduce((groups, skill) => {
                const category = skill.category || 'Other'
                if (!groups[category]) groups[category] = []
                groups[category].push(skill)
                return groups
              }, {})
            ).map(([category, skills]) => (
              <div key={category} className="mb-2">
                <p className="text-black">
                  <span className="font-bold">{category}:</span>{' '}
                  {skills.map((skill, idx) => skill.name).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide border-b border-black pb-1">
            Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={project.id || index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-black">{project.name}</h3>
                    <p className="text-sm font-medium text-black">{project.technologies}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-black">
                      {formatDateRange(project.startDate, project.endDate)}
                    </p>
                  </div>
                </div>
                {project.description && (
                  <p className="text-black text-sm mt-1 ml-4">{project.description}</p>
                )}
                <div className="flex gap-4 mt-1 ml-4">
                  {project.url && (
                    <span className="text-xs text-black underline">{project.url}</span>
                  )}
                  {project.github && (
                    <span className="text-xs text-black underline">{project.github}</span>
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
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide border-b border-black pb-1">
            Certifications
          </h2>
          <div className="space-y-3">
            {data.certifications.map((cert, index) => (
              <div key={cert.id || index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-black">{cert.name}</h3>
                    <p className="font-semibold text-black">{cert.issuer}</p>
                    {cert.credentialId && (
                      <p className="text-sm text-black">Credential ID: {cert.credentialId}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-black font-medium">
                      {formatDate(cert.issueDate)}
                      {cert.expirationDate && ` - ${formatDate(cert.expirationDate)}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide border-b border-black pb-1">
            Languages
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {data.languages.map((lang, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-semibold text-black">{lang.language}</span>
                <span className="text-sm text-black">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hobbies & Interests */}
      {data.hobbies && data.hobbies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black mb-3 uppercase tracking-wide border-b border-black pb-1">
            Hobbies & Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.hobbies.map((hobby, index) => (
              <span key={index} className="text-sm text-black bg-gray-100 px-2 py-1 rounded">
                {hobby}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClassicTemplate
