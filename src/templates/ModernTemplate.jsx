import React from 'react'

const ModernTemplate = ({ data, resumeData }) => {
  // Support both prop names for compatibility
  const templateData = data || resumeData
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const formatDateRange = (startDate, endDate, current) => {
    const start = formatDate(startDate) || 'Start Date'
    const end = current ? 'Present' : (formatDate(endDate) || 'End Date')
    return `${start} - ${end}`
  }

  return (
    <div style={{
      width: '100%', // Take full width of container
      minHeight: '100%', // Take full height of container
      margin: 0,
      backgroundColor: 'white',
      padding: '18mm', // Better margins for PDF
      fontSize: '12px', // Slightly larger font for better PDF readability
      lineHeight: '1.6', // More generous line height
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#000',
      boxSizing: 'border-box',
      position: 'relative',
      overflowWrap: 'break-word',
      wordWrap: 'break-word'
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '2px solid #2563eb',
        paddingBottom: '18px',
        marginBottom: '28px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '30px',
          fontWeight: '700',
          color: '#000',
          margin: '0 0 18px 0',
          letterSpacing: '1.5px',
          textTransform: 'uppercase'
        }}>
          {templateData.personalInfo?.fullName || 'Your Name'}
        </h1>
        
        <div style={{
          fontSize: '12px',
          color: '#374151',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '18px',
          lineHeight: '1.6'
        }}>
          {templateData.personalInfo?.email && <span>{templateData.personalInfo.email}</span>}
          {templateData.personalInfo?.phone && <span>•</span>}
          {templateData.personalInfo?.phone && <span>{templateData.personalInfo.phone}</span>}
          {templateData.personalInfo?.location && <span>•</span>}
          {templateData.personalInfo?.location && <span>{templateData.personalInfo.location}</span>}
          {templateData.personalInfo?.linkedin && <span>•</span>}
          {templateData.personalInfo?.linkedin && <span>{templateData.personalInfo.linkedin.replace('https://', '')}</span>}
          {templateData.personalInfo?.website && <span>•</span>}
          {templateData.personalInfo?.website && <span>{templateData.personalInfo.website.replace('https://', '')}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {templateData.summary && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 12px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '6px'
          }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p style={{
            color: '#374151',
            lineHeight: '1.7',
            margin: '0',
            textAlign: 'left',
            fontSize: '12px'
          }}>
            {templateData.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {templateData.experience && templateData.experience.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 16px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '6px'
          }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          
          {templateData.experience.map((exp, index) => {
            console.log('Rendering experience:', exp); // Debug log
            return (
            <div key={exp.id || index} style={{ marginBottom: '18px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '6px'
              }}>
                <div style={{ flex: '1' }}>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#000',
                    margin: '0',
                    fontSize: '15px'
                  }}>
                    {exp.position}
                  </h3>
                  <p style={{
                    color: '#2563eb',
                    fontWeight: '500',
                    margin: '3px 0',
                    fontSize: '14px'
                  }}>
                    {exp.company}
                  </p>
                  {exp.location && (
                    <p style={{
                      fontSize: '12px',
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
                    fontSize: '12px',
                    color: '#6b7280',
                    fontWeight: '500',
                    margin: '0'
                  }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </p>
                </div>
              </div>
              
              {exp.description && (
                <div style={{ marginTop: '10px' }}>
                  <p style={{
                    color: '#374151',
                    fontSize: '12px',
                    lineHeight: '1.6',
                    margin: '0',
                    textAlign: 'left'
                  }}>
                    {exp.description}
                  </p>
                </div>
              )}
            </div>
            )
          })}
        </div>
      )}

      {/* Education */}
      {templateData.education && templateData.education.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 16px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '6px'
          }}>
            EDUCATION
          </h2>
          
          {templateData.education.map((edu, index) => (
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
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
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
      {templateData.skills && templateData.skills.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 16px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '6px'
          }}>
            SKILLS
          </h2>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            lineHeight: '1.6'
          }}>
            {templateData.skills.map((skill, index) => (
              <span key={skill.id || index} style={{
                display: 'inline-block',
                fontSize: '12px',
                color: '#374151',
                backgroundColor: '#f3f4f6',
                padding: '6px 12px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb'
              }}>
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {templateData.projects && templateData.projects.length > 0 && (
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
          
          {templateData.projects.map((project, index) => (
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
      {templateData.certifications && templateData.certifications.length > 0 && (
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
          
          {templateData.certifications.map((cert, index) => (
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

      {/* Languages */}
      {templateData.languages && templateData.languages.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 12px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '4px'
          }}>
            LANGUAGES
          </h2>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px'
          }}>
            {templateData.languages.map((lang, index) => (
              <div key={lang.id || index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0'
              }}>
                <span style={{
                  fontWeight: '600',
                  color: '#000',
                  fontSize: '12px'
                }}>
                  {lang.language}
                </span>
                <span style={{
                  fontSize: '10px',
                  color: '#6b7280',
                  backgroundColor: '#f3f4f6',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {lang.proficiency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hobbies & Interests */}
      {templateData.hobbies && templateData.hobbies.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#2563eb',
            margin: '0 0 12px 0',
            borderBottom: '1px solid #d1d5db',
            paddingBottom: '4px'
          }}>
            HOBBIES & INTERESTS
          </h2>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}>
            {templateData.hobbies.map((hobby, index) => (
              <span key={index} style={{
                fontSize: '11px',
                color: '#059669',
                backgroundColor: '#d1fae5',
                padding: '4px 8px',
                borderRadius: '12px',
                border: '1px solid #10b981'
              }}>
                {hobby}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ModernTemplate
