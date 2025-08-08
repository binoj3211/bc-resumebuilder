import React from 'react'

const TechTemplate = ({ data }) => {
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
      backgroundColor: '#1a1a1a',
      color: '#e0e0e0',
      fontFamily: "'Roboto Mono', monospace",
      padding: '15mm', // Standard A4 margins
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <header style={{ marginBottom: '24px', borderBottom: '2px solid #00ff41', paddingBottom: '16px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          margin: '0 0 8px 0',
          color: '#00ff41'
        }}>
          {data?.personalInfo?.fullName || 'Your Name'}
        </h1>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '14px',
          color: '#b0b0b0'
        }}>
          {data?.personalInfo?.email && (
            <span>📧 {data.personalInfo.email}</span>
          )}
          {data?.personalInfo?.phone && (
            <span>📱 {data.personalInfo.phone}</span>
          )}
          {data?.personalInfo?.location && (
            <span>📍 {data.personalInfo.location}</span>
          )}
          {data?.personalInfo?.linkedin && (
            <span>🔗 {data.personalInfo.linkedin}</span>
          )}
          {data?.personalInfo?.website && (
            <span>🌐 {data.personalInfo.website}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {data?.summary && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#00d4ff',
            borderLeft: '4px solid #00d4ff',
            paddingLeft: '12px'
          }}>
            // ABOUT
          </h2>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.6',
            margin: 0,
            paddingLeft: '16px'
          }}>
            {data.summary}
          </p>
        </section>
      )}

      {/* Skills */}
      {data?.skills && data.skills.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#ff6b35',
            borderLeft: '4px solid #ff6b35',
            paddingLeft: '12px'
          }}>
            // TECH_STACK
          </h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            paddingLeft: '16px'
          }}>
            {data.skills.map((skill, index) => (
              <span key={index} style={{
                backgroundColor: '#333',
                color: '#00ff41',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'monospace',
                border: '1px solid #00ff41'
              }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data?.experience && data.experience.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#f39c12',
            borderLeft: '4px solid #f39c12',
            paddingLeft: '12px'
          }}>
            // EXPERIENCE
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '16px', paddingLeft: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: 0,
                    color: '#00d4ff'
                  }}>
                    {exp.jobTitle}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    margin: '2px 0',
                    color: '#b0b0b0'
                  }}>
                    {exp.company} • {exp.location}
                  </p>
                </div>
                <span style={{
                  fontSize: '12px',
                  color: '#888',
                  fontFamily: 'monospace',
                  backgroundColor: '#2a2a2a',
                  padding: '4px 8px',
                  borderRadius: '3px'
                }}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              {exp.description && (
                <p style={{
                  fontSize: '13px',
                  lineHeight: '1.5',
                  margin: '8px 0',
                  color: '#d0d0d0'
                }}>
                  {exp.description}
                </p>
              )}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul style={{
                  fontSize: '13px',
                  lineHeight: '1.5',
                  margin: '8px 0',
                  paddingLeft: '20px',
                  color: '#d0d0d0'
                }}>
                  {exp.responsibilities.map((resp, respIndex) => (
                    <li key={respIndex} style={{ marginBottom: '4px' }}>
                      <span style={{ color: '#00ff41' }}>&gt;</span> {resp}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data?.education && data.education.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#9b59b6',
            borderLeft: '4px solid #9b59b6',
            paddingLeft: '12px'
          }}>
            // EDUCATION
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '12px', paddingLeft: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 'bold',
                    margin: 0,
                    color: '#00d4ff'
                  }}>
                    {edu.degree}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    margin: '2px 0',
                    color: '#b0b0b0'
                  }}>
                    {edu.institution} • {edu.location}
                  </p>
                  {edu.gpa && (
                    <p style={{
                      fontSize: '12px',
                      margin: '2px 0',
                      color: '#00ff41'
                    }}>
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
                <span style={{
                  fontSize: '12px',
                  color: '#888',
                  fontFamily: 'monospace',
                  backgroundColor: '#2a2a2a',
                  padding: '4px 8px',
                  borderRadius: '3px'
                }}>
                  {formatDateRange(edu.startDate, edu.endDate, false)}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data?.projects && data.projects.length > 0 && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#e74c3c',
            borderLeft: '4px solid #e74c3c',
            paddingLeft: '12px'
          }}>
            // PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} style={{ marginBottom: '12px', paddingLeft: '16px' }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 'bold',
                margin: '0 0 4px 0',
                color: '#00d4ff'
              }}>
                {project.name}
                {project.url && (
                  <span style={{
                    fontSize: '12px',
                    marginLeft: '8px',
                    color: '#00ff41'
                  }}>
                    🔗 {project.url}
                  </span>
                )}
              </h3>
              {project.description && (
                <p style={{
                  fontSize: '13px',
                  lineHeight: '1.5',
                  margin: '4px 0',
                  color: '#d0d0d0'
                }}>
                  {project.description}
                </p>
              )}
              {project.technologies && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginTop: '8px'
                }}>
                  {project.technologies.split(',').map((tech, techIndex) => (
                    <span key={techIndex} style={{
                      fontSize: '11px',
                      backgroundColor: '#2a2a2a',
                      color: '#ff6b35',
                      padding: '3px 6px',
                      borderRadius: '3px',
                      fontFamily: 'monospace'
                    }}>
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

export default TechTemplate
