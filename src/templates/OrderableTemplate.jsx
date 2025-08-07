import React from 'react'

const OrderableTemplate = ({ data, sectionOrder = [] }) => {
  const templateData = data || {}
  
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

  // Default section order if none provided
  const defaultOrder = [
    'personalInfo', 'summary', 'experience', 'education', 
    'skills', 'projects', 'certifications', 'languages', 'hobbies'
  ]
  
  const orderedSections = sectionOrder.length > 0 ? sectionOrder : defaultOrder

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'personalInfo':
        return (
          <div key="header" style={{
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
              {templateData.personalInfo?.fullName || 'Your Name'}
            </h1>
            
            <div style={{
              fontSize: '11px',
              color: '#374151',
              lineHeight: '1.6'
            }}>
              {templateData.personalInfo?.email && (
                <span>{templateData.personalInfo.email}</span>
              )}
              {templateData.personalInfo?.phone && templateData.personalInfo?.email && (
                <span style={{ margin: '0 8px' }}>•</span>
              )}
              {templateData.personalInfo?.phone && (
                <span>{templateData.personalInfo.phone}</span>
              )}
              {(templateData.personalInfo?.location && (templateData.personalInfo?.email || templateData.personalInfo?.phone)) && (
                <span style={{ margin: '0 8px' }}>•</span>
              )}
              {templateData.personalInfo?.location && (
                <span>{templateData.personalInfo.location}</span>
              )}
              {templateData.personalInfo?.linkedin && (
                <div style={{ marginTop: '4px' }}>
                  LinkedIn: {templateData.personalInfo.linkedin}
                  {templateData.personalInfo?.website && (
                    <span style={{ margin: '0 8px' }}>•</span>
                  )}
                  {templateData.personalInfo?.website && (
                    <span>Website: {templateData.personalInfo.website}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )

      case 'summary':
        if (!templateData.summary) return null
        return (
          <div key="summary" style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '4px'
            }}>
              PROFESSIONAL SUMMARY
            </h2>
            <p style={{
              margin: '0',
              lineHeight: '1.6',
              color: '#374151'
            }}>
              {templateData.summary}
            </p>
          </div>
        )

      case 'experience':
        if (!templateData.experience || templateData.experience.length === 0) return null
        return (
          <div key="experience" style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '4px'
            }}>
              PROFESSIONAL EXPERIENCE
            </h2>
            {templateData.experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '4px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#000',
                      margin: '0',
                      lineHeight: '1.4'
                    }}>
                      {exp.position}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: '#2563eb',
                      margin: '2px 0 0 0',
                      fontWeight: '500'
                    }}>
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    color: '#6b7280',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    marginLeft: '16px'
                  }}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                {exp.description && (
                  <div style={{
                    fontSize: '11px',
                    color: '#374151',
                    lineHeight: '1.5',
                    marginTop: '6px'
                  }}>
                    {exp.description.split('\n').map((line, i) => (
                      <div key={i} style={{ margin: '2px 0' }}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      case 'education':
        if (!templateData.education || templateData.education.length === 0) return null
        return (
          <div key="education" style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '4px'
            }}>
              EDUCATION
            </h2>
            {templateData.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#000',
                      margin: '0',
                      lineHeight: '1.4'
                    }}>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: '#2563eb',
                      margin: '2px 0 0 0'
                    }}>
                      {edu.institution}
                      {edu.location && ` • ${edu.location}`}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {edu.graduationDate && (
                      <span style={{
                        fontSize: '10px',
                        color: '#6b7280',
                        fontWeight: '500'
                      }}>
                        {edu.graduationDate}
                      </span>
                    )}
                    {edu.gpa && (
                      <div style={{
                        fontSize: '10px',
                        color: '#6b7280',
                        marginTop: '2px'
                      }}>
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'skills':
        if (!templateData.skills || templateData.skills.length === 0) return null
        return (
          <div key="skills" style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '4px'
            }}>
              TECHNICAL SKILLS
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {templateData.skills.map((skill, index) => (
                <span key={index} style={{
                  fontSize: '11px',
                  color: '#374151',
                  backgroundColor: '#f3f4f6',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          </div>
        )

      case 'projects':
        if (!templateData.projects || templateData.projects.length === 0) return null
        return (
          <div key="projects" style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '4px'
            }}>
              PROJECTS
            </h2>
            {templateData.projects.map((project, index) => (
              <div key={index} style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '4px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#000',
                      margin: '0',
                      lineHeight: '1.4'
                    }}>
                      {project.name}
                    </h3>
                    {project.technologies && (
                      <p style={{
                        fontSize: '11px',
                        color: '#2563eb',
                        margin: '2px 0 0 0'
                      }}>
                        Technologies: {project.technologies}
                      </p>
                    )}
                  </div>
                  {project.date && (
                    <span style={{
                      fontSize: '10px',
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      {project.date}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p style={{
                    fontSize: '11px',
                    color: '#374151',
                    margin: '6px 0 0 0',
                    lineHeight: '1.5'
                  }}>
                    {project.description}
                  </p>
                )}
                {project.link && (
                  <p style={{
                    fontSize: '10px',
                    color: '#2563eb',
                    margin: '4px 0 0 0'
                  }}>
                    Link: {project.link}
                  </p>
                )}
              </div>
            ))}
          </div>
        )

      case 'certifications':
        if (!templateData.certifications || templateData.certifications.length === 0) return null
        return (
          <div key="certifications" style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '4px'
            }}>
              CERTIFICATIONS
            </h2>
            {templateData.certifications.map((cert, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#000',
                      margin: '0',
                      lineHeight: '1.4'
                    }}>
                      {cert.name}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: '#2563eb',
                      margin: '2px 0 0 0'
                    }}>
                      {cert.issuer}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {cert.date && (
                      <span style={{
                        fontSize: '10px',
                        color: '#6b7280',
                        fontWeight: '500'
                      }}>
                        {cert.date}
                      </span>
                    )}
                    {cert.expiryDate && (
                      <div style={{
                        fontSize: '10px',
                        color: '#6b7280',
                        marginTop: '2px'
                      }}>
                        Expires: {cert.expiryDate}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'languages':
        if (!templateData.languages || templateData.languages.length === 0) return null
        return (
          <div key="languages" style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '4px'
            }}>
              LANGUAGES
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {templateData.languages.map((lang, index) => (
                <div key={index} style={{
                  fontSize: '11px',
                  color: '#374151'
                }}>
                  <span style={{ fontWeight: '600' }}>{lang.language}:</span>
                  <span style={{ marginLeft: '4px' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'hobbies':
        if (!templateData.hobbies || templateData.hobbies.length === 0) return null
        return (
          <div key="hobbies" style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '4px'
            }}>
              HOBBIES & INTERESTS
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              {templateData.hobbies.map((hobby, index) => (
                <span key={index} style={{
                  fontSize: '11px',
                  color: '#374151',
                  backgroundColor: '#f9fafb',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb'
                }}>
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
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
      {orderedSections.map(sectionId => renderSection(sectionId))}
    </div>
  )
}

export default OrderableTemplate
