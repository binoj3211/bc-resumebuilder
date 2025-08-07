import React from 'react'

const PDFTemplate = ({ data }) => {
  return (
    <div style={{
      width: '8.5in',
      minHeight: '11in',
      backgroundColor: 'white',
      padding: '0.5in',
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      lineHeight: '1.4',
      color: '#000000'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0', color: '#000' }}>
          {data?.personalInfo?.fullName || 'YOUR NAME'}
        </h1>
        
        <div style={{ fontSize: '11px', color: '#333' }}>
          {data?.personalInfo?.email && (
            <span>{data.personalInfo.email}</span>
          )}
          {data?.personalInfo?.phone && (
            <span> • {data.personalInfo.phone}</span>
          )}
          {data?.personalInfo?.location && (
            <span> • {data.personalInfo.location}</span>
          )}
        </div>
        
        {data?.personalInfo?.linkedin && (
          <div style={{ fontSize: '11px', color: '#333', marginTop: '4px' }}>
            {data.personalInfo.linkedin}
          </div>
        )}
      </div>

      {/* Summary */}
      {data?.summary && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', borderBottom: '1px solid #333', paddingBottom: '2px' }}>
            SUMMARY
          </h2>
          <p style={{ margin: '0', lineHeight: '1.5' }}>{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data?.experience && data.experience.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', borderBottom: '1px solid #333', paddingBottom: '2px' }}>
            EXPERIENCE
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0', color: '#000' }}>
                    {exp.position || 'Position'}
                  </h3>
                  <p style={{ fontSize: '13px', margin: '2px 0', fontWeight: '500', color: '#000' }}>
                    {exp.company || 'Company'}
                  </p>
                  {exp.location && (
                    <p style={{ fontSize: '11px', margin: '0', color: '#666', fontStyle: 'italic' }}>
                      {exp.location}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', margin: '0', color: '#666' }}>
                    {exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Start'} - {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'End'}
                  </p>
                </div>
              </div>
              {exp.description && (
                <div style={{ marginTop: '4px' }}>
                  {exp.description.split('\n').map((line, idx) => (
                    <p key={idx} style={{ margin: '2px 0', fontSize: '11px', lineHeight: '1.4' }}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data?.education && data.education.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', borderBottom: '1px solid #333', paddingBottom: '2px' }}>
            EDUCATION
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', margin: '0' }}>
                    {edu.degree} in {edu.field}
                  </h3>
                  <p style={{ fontSize: '12px', margin: '2px 0', color: '#000' }}>{edu.institution}</p>
                  {edu.location && (
                    <p style={{ fontSize: '11px', margin: '0', color: '#666', fontStyle: 'italic' }}>
                      {edu.location}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  {edu.graduationDate && (
                    <p style={{ fontSize: '11px', margin: '0', color: '#666' }}>
                      {new Date(edu.graduationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </p>
                  )}
                  {edu.gpa && (
                    <p style={{ fontSize: '11px', margin: '0', color: '#666' }}>GPA: {edu.gpa}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data?.skills && data.skills.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', borderBottom: '1px solid #333', paddingBottom: '2px' }}>
            SKILLS
          </h2>
          
          {/* Group skills by category */}
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
              <div key={category} style={{ marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#000' }}>
                  {category}:
                </span>
                <span style={{ fontSize: '11px', marginLeft: '8px' }}>
                  {skills.map(skill => skill.name).join(', ')}
                </span>
              </div>
            ))
          })()}
        </div>
      )}

      {/* Projects */}
      {data?.projects && data.projects.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', borderBottom: '1px solid #333', paddingBottom: '2px' }}>
            PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', margin: '0' }}>
                  {project.name}
                </h3>
                <p style={{ fontSize: '11px', margin: '0', color: '#666' }}>
                  {project.startDate && project.endDate && 
                    `${new Date(project.startDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - ${new Date(project.endDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`
                  }
                </p>
              </div>
              {project.description && (
                <p style={{ fontSize: '11px', margin: '4px 0', lineHeight: '1.4' }}>{project.description}</p>
              )}
              {project.technologies && (
                <p style={{ fontSize: '10px', margin: '2px 0', color: '#666' }}>
                  <strong>Technologies:</strong> {project.technologies}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data?.certifications && data.certifications.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', borderBottom: '1px solid #333', paddingBottom: '2px' }}>
            CERTIFICATIONS
          </h2>
          {data.certifications.map((cert, index) => (
            <div key={index} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: '600', margin: '0' }}>{cert.name}</h3>
                  <p style={{ fontSize: '11px', margin: '2px 0', color: '#666' }}>{cert.issuer}</p>
                </div>
                <p style={{ fontSize: '11px', margin: '0', color: '#666' }}>
                  {cert.date && new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Debug Panel - Raw Extracted Resume Text */}
      {data?._rawText && (
        <div style={{ background: '#f5f5fa', border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#2563eb', marginBottom: '6px' }}>🛠 Debug: Raw Extracted Resume Text</h3>
          <pre style={{ fontSize: '11px', color: '#444', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '8px', maxHeight: '120px', overflow: 'auto', marginBottom: '8px' }}>
            {data._rawText.split('\n').slice(0, 20).join('\n')}
          </pre>
          {data.detailedSectionAnalysis && (
            <div style={{ marginTop: '8px' }}>
              <strong style={{ fontSize: '12px', color: '#7c3aed' }}>Detected Sections:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                {Object.entries(data.detailedSectionAnalysis).map(([section, analysis]) => (
                  <span key={section} style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', background: analysis.score > 60 ? '#d1fae5' : analysis.score > 40 ? '#fef3c7' : '#fee2e2', color: analysis.score > 60 ? '#065f46' : analysis.score > 40 ? '#92400e' : '#991b1b' }}>
                    {section}: {analysis.score || 0}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Extracted Resume Information Panel */}
      {data?._rawText && (
        <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '6px' }}>📄 Extracted Resume Information</h3>
          {data._usedOCR && (
            <div style={{ color: '#991b1b', fontSize: '12px', marginBottom: '8px', fontWeight: 'bold' }}>
              ⚠️ OCR was used to extract text from a scanned/image PDF. Results may be less accurate.
            </div>
          )}
          <pre style={{ fontSize: '12px', color: '#333', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '10px', maxHeight: '300px', overflow: 'auto' }}>
            {data._rawText}
          </pre>
        </div>
      )}
    </div>
  )
}

export default PDFTemplate
