import React from 'react'

const ModernTemplate = ({ data }) => {
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
      width: '100%',
      maxWidth: '8.5in',
      minHeight: '11in',
      margin: '0 auto',
      backgroundColor: 'white',
      padding: '0.5in',
      fontSize: '12px',
      lineHeight: '1.4',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#000',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '2px solid #2563eb',
        paddingBottom: '16px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#000',
          margin: '0 0 12px 0',
          letterSpacing: '1px'
        }}>
          {data.personalInfo?.fullName || 'Your Name'}
        </h1>
        
        <div style={{
          fontSize: '11px',
          color: '#374151',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '12px'
        }}>
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo?.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo?.linkedin && <span>{data.personalInfo.linkedin.replace('https://', '')}</span>}
          {data.personalInfo?.website && <span>{data.personalInfo.website.replace('https://', '')}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 8px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '4px'
          }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p style={{
            color: '#374151',
            lineHeight: '1.5',
            margin: '0',
            textAlign: 'justify'
          }}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 12px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '4px'
          }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          
          {data.experience.map((exp, index) => (
            <div key={exp.id || index} style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '4px'
              }}>
                <div style={{ flex: '1' }}>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#000',
                    margin: '0',
                    fontSize: '14px'
                  }}>
                    {exp.position}
                  </h3>
                  <p style={{
                    color: '#2563eb',
                    fontWeight: '500',
                    margin: '2px 0',
                    fontSize: '13px'
                  }}>
                    {exp.company}
                  </p>
                  {exp.location && (
                    <p style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      margin: '0',
                      fontStyle: 'italic'
                    }}>
                      {exp.location}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  <p style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    fontWeight: '500',
                    margin: '0'
                  }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </p>
                </div>
              </div>
              
              {exp.description && (
                <div style={{ marginTop: '6px' }}>
                  {exp.description.split('\n').map((line, idx) => (
                    <div key={idx} style={{
                      color: '#374151',
                      fontSize: '11px',
                      marginBottom: '3px',
                      lineHeight: '1.4',
                      paddingLeft: line.trim().startsWith('•') ? '0' : '0'
                    }}>
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 12px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '4px'
          }}>
            EDUCATION
          </h2>
          
          {data.education.map((edu, index) => (
            <div key={edu.id || index} style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#000',
                    margin: '0',
                    fontSize: '13px'
                  }}>
                    {edu.degree} in {edu.field}
                  </h3>
                  <p style={{
                    color: '#2563eb',
                    margin: '2px 0',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {edu.institution}
                  </p>
                  {edu.location && (
                    <p style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      margin: '0',
                      fontStyle: 'italic'
                    }}>
                      {edu.location}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  {edu.graduationDate && (
                    <p style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      margin: '0'
                    }}>
                      {formatDate(edu.graduationDate)}
                    </p>
                  )}
                  {edu.gpa && (
                    <p style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      margin: '2px 0 0 0'
                    }}>
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 12px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '4px'
          }}>
            SKILLS
          </h2>
          
          {(() => {
            const groupedSkills = data.skills.reduce((groups, skill) => {
              const category = skill.category || 'Other'
              if (!groups[category]) {
                groups[category] = []
              }
              groups[category].push(skill)
              return groups
            }, {})

            return Object.entries(groupedSkills).map(([category, skills]) => (
              <div key={category} style={{ marginBottom: '8px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#000'
                }}>
                  {category}:
                </span>
                <span style={{
                  fontSize: '11px',
                  marginLeft: '8px',
                  color: '#374151'
                }}>
                  {skills.map(skill => skill.name).join(', ')}
                </span>
              </div>
            ))
          })()}
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 12px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '4px'
          }}>
            PROJECTS
          </h2>
          
          {data.projects.map((project, index) => (
            <div key={project.id || index} style={{ marginBottom: '14px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '4px'
              }}>
                <h3 style={{
                  fontWeight: '600',
                  color: '#000',
                  margin: '0',
                  fontSize: '13px'
                }}>
                  {project.name}
                </h3>
                {project.startDate && project.endDate && (
                  <p style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    margin: '0'
                  }}>
                    {formatDateRange(project.startDate, project.endDate, false)}
                  </p>
                )}
              </div>
              
              {project.description && (
                <p style={{
                  fontSize: '11px',
                  margin: '4px 0',
                  lineHeight: '1.4',
                  color: '#374151'
                }}>
                  {project.description}
                </p>
              )}
              
              {project.technologies && (
                <p style={{
                  fontSize: '10px',
                  margin: '4px 0 0 0',
                  color: '#6b7280'
                }}>
                  <strong>Technologies:</strong> {project.technologies}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 12px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '4px'
          }}>
            CERTIFICATIONS
          </h2>
          
          {data.certifications.map((cert, index) => (
            <div key={cert.id || index} style={{ marginBottom: '10px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#000',
                    margin: '0',
                    fontSize: '12px'
                  }}>
                    {cert.name}
                  </h3>
                  <p style={{
                    fontSize: '11px',
                    margin: '2px 0',
                    color: '#2563eb'
                  }}>
                    {cert.issuer}
                  </p>
                </div>
                {cert.date && (
                  <p style={{
                    fontSize: '11px',
                    margin: '0',
                    color: '#6b7280'
                  }}>
                    {formatDate(cert.date)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ModernTemplate
