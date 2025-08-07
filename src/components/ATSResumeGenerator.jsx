import React, { useState, useRef, useEffect } from 'react'
import { Download, Printer, Copy, Edit3, Eye, CheckCircle, AlertCircle, ArrowLeft, FileText, Sparkles } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const ModernATSTemplate = ({ data, isEditing, onEdit }) => (
  <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
    {/* Header */}
    <header className="border-b-2 border-blue-600 pb-4 mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isEditing ? (
          <input
            type="text"
            value={data.personalInfo?.fullName || ''}
            onChange={(e) => onEdit('personalInfo', 'fullName', e.target.value)}
            className="w-full text-3xl font-bold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
            placeholder="Your Full Name"
          />
        ) : (
          data.personalInfo?.fullName || 'Your Full Name'
        )}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600 text-sm">
        {isEditing ? (
          <>
            <input
              type="email"
              value={data.personalInfo?.email || ''}
              onChange={(e) => onEdit('personalInfo', 'email', e.target.value)}
              className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
              placeholder="email@example.com"
            />
            <input
              type="tel"
              value={data.personalInfo?.phone || ''}
              onChange={(e) => onEdit('personalInfo', 'phone', e.target.value)}
              className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
              placeholder="Phone number"
            />
            <input
              type="text"
              value={data.personalInfo?.address || ''}
              onChange={(e) => onEdit('personalInfo', 'address', e.target.value)}
              className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
              placeholder="Address"
            />
            <input
              type="url"
              value={data.personalInfo?.website || ''}
              onChange={(e) => onEdit('personalInfo', 'website', e.target.value)}
              className="bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
              placeholder="Website/Portfolio"
            />
          </>
        ) : (
          <>
            {data.personalInfo?.email && <p><span className="font-medium">Email:</span> {data.personalInfo.email}</p>}
            {data.personalInfo?.phone && <p><span className="font-medium">Phone:</span> {data.personalInfo.phone}</p>}
            {data.personalInfo?.address && <p><span className="font-medium">Address:</span> {data.personalInfo.address}</p>}
            {data.personalInfo?.website && <p><span className="font-medium">Website:</span> {data.personalInfo.website}</p>}
          </>
        )}
      </div>
    </header>

    {/* Professional Summary */}
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        PROFESSIONAL SUMMARY
      </h2>
      {isEditing ? (
        <textarea
          value={data.summary || ''}
          onChange={(e) => onEdit('summary', null, e.target.value)}
          className="w-full bg-transparent border border-gray-300 rounded p-3 focus:border-blue-500 outline-none resize-none"
          rows="4"
          placeholder="Write your professional summary here..."
        />
      ) : (
        <p className="text-gray-700 leading-relaxed">{data.summary || 'No summary provided'}</p>
      )}
    </section>

    {/* Skills */}
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
        CORE COMPETENCIES
      </h2>
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={data.skills?.join(', ') || ''}
            onChange={(e) => {
              const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)
              onEdit('skills', null, skills)
            }}
            className="w-full bg-transparent border border-gray-300 rounded p-3 focus:border-blue-500 outline-none resize-none"
            rows="3"
            placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
          />
          <p className="text-xs text-gray-500">Separate skills with commas</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {data.skills?.length > 0 ? data.skills.map((skill, index) => (
            <div key={index} className="text-gray-700 text-sm">• {skill}</div>
          )) : (
            <p className="text-gray-500 italic">No skills listed</p>
          )}
        </div>
      )}
    </section>

    {/* Professional Experience */}
    {(data.experience?.length > 0 || isEditing) && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          PROFESSIONAL EXPERIENCE
        </h2>
        {data.experience?.length > 0 ? data.experience.map((exp, index) => (
          <div key={index} className="mb-4 p-3 border border-gray-200 rounded">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={exp.position || ''}
                    onChange={(e) => {
                      const newExp = [...data.experience]
                      newExp[index] = { ...newExp[index], position: e.target.value }
                      onEdit('experience', null, newExp)
                    }}
                    className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-semibold"
                    placeholder="Job Title"
                  />
                  <input
                    type="text"
                    value={exp.duration || ''}
                    onChange={(e) => {
                      const newExp = [...data.experience]
                      newExp[index] = { ...newExp[index], duration: e.target.value }
                      onEdit('experience', null, newExp)
                    }}
                    className="w-32 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                    placeholder="2020-2023"
                  />
                </div>
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => {
                    const newExp = [...data.experience]
                    newExp[index] = { ...newExp[index], company: e.target.value }
                    onEdit('experience', null, newExp)
                  }}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-medium"
                  placeholder="Company Name"
                />
                <textarea
                  value={exp.description?.join('\n') || ''}
                  onChange={(e) => {
                    const descriptions = e.target.value.split('\n').filter(desc => desc.trim())
                    const newExp = [...data.experience]
                    newExp[index] = { ...newExp[index], description: descriptions }
                    onEdit('experience', null, newExp)
                  }}
                  className="w-full bg-transparent border border-gray-300 rounded p-2 focus:border-blue-500 outline-none resize-none text-sm"
                  rows="3"
                  placeholder="• Achievement 1&#10;• Achievement 2&#10;• Achievement 3"
                />
                <button
                  onClick={() => {
                    const newExp = data.experience.filter((_, i) => i !== index)
                    onEdit('experience', null, newExp)
                  }}
                  className="text-red-600 text-xs hover:text-red-800"
                >
                  Remove Experience
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-gray-600 font-medium text-sm">{exp.duration}</span>
                </div>
                <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
                {exp.description && exp.description.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )) : isEditing && (
          <div className="text-center py-4">
            <button
              onClick={() => {
                const newExp = {
                  position: '',
                  company: '',
                  duration: '',
                  description: []
                }
                onEdit('experience', null, [...(data.experience || []), newExp])
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Experience
            </button>
          </div>
        )}
        {isEditing && data.experience?.length > 0 && (
          <button
            onClick={() => {
              const newExp = {
                position: '',
                company: '',
                duration: '',
                description: []
              }
              onEdit('experience', null, [...data.experience, newExp])
            }}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            + Add Another Experience
          </button>
        )}
      </section>
    )}

    {/* Education */}
    {(data.education?.length > 0 || isEditing) && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          EDUCATION
        </h2>
        {data.education?.length > 0 ? data.education.map((edu, index) => (
          <div key={index} className="mb-3 p-3 border border-gray-200 rounded">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => {
                      const newEdu = [...data.education]
                      newEdu[index] = { ...newEdu[index], degree: e.target.value }
                      onEdit('education', null, newEdu)
                    }}
                    className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-semibold"
                    placeholder="Degree"
                  />
                  <input
                    type="text"
                    value={edu.year || ''}
                    onChange={(e) => {
                      const newEdu = [...data.education]
                      newEdu[index] = { ...newEdu[index], year: e.target.value }
                      onEdit('education', null, newEdu)
                    }}
                    className="w-20 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                    placeholder="Year"
                  />
                </div>
                <input
                  type="text"
                  value={edu.field || ''}
                  onChange={(e) => {
                    const newEdu = [...data.education]
                    newEdu[index] = { ...newEdu[index], field: e.target.value }
                    onEdit('education', null, newEdu)
                  }}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                  placeholder="Field of Study"
                />
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => {
                    const newEdu = [...data.education]
                    newEdu[index] = { ...newEdu[index], institution: e.target.value }
                    onEdit('education', null, newEdu)
                  }}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                  placeholder="Institution Name"
                />
                <button
                  onClick={() => {
                    const newEdu = data.education.filter((_, i) => i !== index)
                    onEdit('education', null, newEdu)
                  }}
                  className="text-red-600 text-xs hover:text-red-800"
                >
                  Remove Education
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-700">{edu.institution}</p>
                </div>
                {edu.year && (
                  <span className="text-gray-600 font-medium text-sm">{edu.year}</span>
                )}
              </div>
            )}
          </div>
        )) : isEditing && (
          <div className="text-center py-4">
            <button
              onClick={() => {
                const newEdu = {
                  degree: '',
                  field: '',
                  institution: '',
                  year: ''
                }
                onEdit('education', null, [...(data.education || []), newEdu])
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Education
            </button>
          </div>
        )}
      </section>
    )}

    {/* Projects */}
    {(data.projects?.length > 0 || isEditing) && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          KEY PROJECTS
        </h2>
        {data.projects?.length > 0 ? data.projects.map((project, index) => (
          <div key={index} className="mb-3 p-3 border border-gray-200 rounded">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={project.name || ''}
                  onChange={(e) => {
                    const newProjects = [...data.projects]
                    newProjects[index] = { ...newProjects[index], name: e.target.value }
                    onEdit('projects', null, newProjects)
                  }}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-semibold"
                  placeholder="Project Name"
                />
                <textarea
                  value={project.description || ''}
                  onChange={(e) => {
                    const newProjects = [...data.projects]
                    newProjects[index] = { ...newProjects[index], description: e.target.value }
                    onEdit('projects', null, newProjects)
                  }}
                  className="w-full bg-transparent border border-gray-300 rounded p-2 focus:border-blue-500 outline-none resize-none text-sm"
                  rows="2"
                  placeholder="Project description"
                />
                <input
                  type="text"
                  value={project.technologies?.join(', ') || ''}
                  onChange={(e) => {
                    const technologies = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech)
                    const newProjects = [...data.projects]
                    newProjects[index] = { ...newProjects[index], technologies }
                    onEdit('projects', null, newProjects)
                  }}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                  placeholder="Technologies used (comma separated)"
                />
                <button
                  onClick={() => {
                    const newProjects = data.projects.filter((_, i) => i !== index)
                    onEdit('projects', null, newProjects)
                  }}
                  className="text-red-600 text-xs hover:text-red-800"
                >
                  Remove Project
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <p className="text-gray-700 text-sm">{project.description}</p>
                {project.technologies && (
                  <p className="text-gray-600 text-xs mt-1">
                    <strong>Technologies:</strong> {project.technologies.join(', ')}
                  </p>
                )}
              </>
            )}
          </div>
        )) : isEditing && (
          <div className="text-center py-4">
            <button
              onClick={() => {
                const newProject = {
                  name: '',
                  description: '',
                  technologies: []
                }
                onEdit('projects', null, [...(data.projects || []), newProject])
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Project
            </button>
          </div>
        )}
      </section>
    )}

    {/* Certifications */}
    {(data.certifications?.length > 0 || isEditing) && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          CERTIFICATIONS
        </h2>
        {data.certifications?.length > 0 ? data.certifications.map((cert, index) => (
          <div key={index} className="mb-2 p-2 border border-gray-200 rounded">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cert.name || ''}
                    onChange={(e) => {
                      const newCerts = [...data.certifications]
                      newCerts[index] = { ...newCerts[index], name: e.target.value }
                      onEdit('certifications', null, newCerts)
                    }}
                    className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none font-semibold text-sm"
                    placeholder="Certification Name"
                  />
                  <input
                    type="text"
                    value={cert.year || ''}
                    onChange={(e) => {
                      const newCerts = [...data.certifications]
                      newCerts[index] = { ...newCerts[index], year: e.target.value }
                      onEdit('certifications', null, newCerts)
                    }}
                    className="w-20 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                    placeholder="Year"
                  />
                </div>
                <input
                  type="text"
                  value={cert.issuer || ''}
                  onChange={(e) => {
                    const newCerts = [...data.certifications]
                    newCerts[index] = { ...newCerts[index], issuer: e.target.value }
                    onEdit('certifications', null, newCerts)
                  }}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
                  placeholder="Issuing Organization"
                />
                <button
                  onClick={() => {
                    const newCerts = data.certifications.filter((_, i) => i !== index)
                    onEdit('certifications', null, newCerts)
                  }}
                  className="text-red-600 text-xs hover:text-red-800"
                >
                  Remove Certification
                </button>
              </div>
            ) : (
              <p className="text-gray-700 text-sm">
                <strong>{cert.name}</strong>
                {cert.issuer && ` - ${cert.issuer}`}
                {cert.year && ` (${cert.year})`}
              </p>
            )}
          </div>
        )) : isEditing && (
          <div className="text-center py-4">
            <button
              onClick={() => {
                const newCert = {
                  name: '',
                  issuer: '',
                  year: ''
                }
                onEdit('certifications', null, [...(data.certifications || []), newCert])
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Certification
            </button>
          </div>
        )}
      </section>
    )}
  </div>
)

const ClassicATSTemplate = ({ data, isEditing, onEdit }) => (
  <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg" style={{ fontFamily: 'Times New Roman, serif' }}>
    {/* Header - Centered Classic Style */}
    <header className="text-center border-b-2 border-black pb-4 mb-6">
      <h1 className="text-4xl font-bold text-black mb-2 uppercase tracking-wide">
        {data.personalInfo?.fullName || 'Your Full Name'}
      </h1>
      <div className="text-black space-y-1 text-sm">
        {data.personalInfo?.address && <p className="font-medium">{data.personalInfo.address}</p>}
        <p className="font-medium">
          {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo?.phone && data.personalInfo?.email && <span> | </span>}
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
        </p>
        {data.personalInfo?.website && <p className="font-medium">{data.personalInfo.website}</p>}
      </div>
    </header>

    {data.summary && (
      <section className="mb-6">
        <h2 className="text-lg font-bold text-black mb-2 text-center underline uppercase tracking-wider">
          PROFESSIONAL OBJECTIVE
        </h2>
        <p className="text-black leading-relaxed text-justify text-sm">{data.summary}</p>
      </section>
    )}

    {data.skills && data.skills.length > 0 && (
      <section className="mb-6">
        <h2 className="text-lg font-bold text-black mb-2 text-center underline uppercase tracking-wider">
          TECHNICAL SKILLS
        </h2>
        <p className="text-black text-center text-sm">
          {data.skills.join(' • ')}
        </p>
      </section>
    )}

    {data.experience && data.experience.length > 0 && (
      <section className="mb-6">
        <h2 className="text-lg font-bold text-black mb-3 text-center underline uppercase tracking-wider">
          PROFESSIONAL EXPERIENCE
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="text-center mb-2">
              <h3 className="font-bold text-black text-base">{exp.position}</h3>
              <p className="text-black italic font-medium">{exp.company} | {exp.duration}</p>
            </div>
            {exp.description && exp.description.length > 0 && (
              <ul className="list-disc list-inside text-black space-y-1 text-sm text-center">
                {exp.description.map((desc, i) => (
                  <li key={i} className="text-left ml-8">{desc}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    )}

    {data.education && data.education.length > 0 && (
      <section className="mb-6">
        <h2 className="text-lg font-bold text-black mb-3 text-center underline uppercase tracking-wider">
          EDUCATION
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3 text-center">
            <h3 className="font-bold text-black">
              {edu.degree} {edu.field && `in ${edu.field}`}
            </h3>
            <p className="text-black font-medium">{edu.institution}</p>
            {edu.year && <p className="text-black italic">{edu.year}</p>}
          </div>
        ))}
      </section>
    )}

    {data.projects && data.projects.length > 0 && (
      <section className="mb-6">
        <h2 className="text-lg font-bold text-black mb-3 text-center underline uppercase tracking-wider">
          NOTABLE PROJECTS
        </h2>
        {data.projects.map((project, index) => (
          <div key={index} className="mb-3 text-center">
            <h3 className="font-bold text-black">{project.name}</h3>
            <p className="text-black text-sm">{project.description}</p>
            {project.technologies && (
              <p className="text-black text-xs italic">
                Technologies: {project.technologies.join(', ')}
              </p>
            )}
          </div>
        ))}
      </section>
    )}

    {data.certifications && data.certifications.length > 0 && (
      <section className="mb-6">
        <h2 className="text-lg font-bold text-black mb-3 text-center underline uppercase tracking-wider">
          CERTIFICATIONS
        </h2>
        <div className="text-center">
          {data.certifications.map((cert, index) => (
            <p key={index} className="text-black text-sm mb-1">
              <strong>{cert.name}</strong>
              {cert.issuer && ` - ${cert.issuer}`}
              {cert.year && ` (${cert.year})`}
            </p>
          ))}
        </div>
      </section>
    )}
  </div>
)

const MinimalATSTemplate = ({ data, isEditing, onEdit }) => (
  <div className="bg-white p-10 max-w-4xl mx-auto shadow-sm" style={{ fontFamily: 'Calibri, sans-serif' }}>
    {/* Minimal clean header */}
    <header className="mb-10">
      <h1 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
        {data.personalInfo?.fullName || 'Your Full Name'}
      </h1>
      <div className="text-gray-600 text-sm space-y-2 leading-relaxed">
        {data.personalInfo?.email && <p>Email: {data.personalInfo.email}</p>}
        {data.personalInfo?.phone && <p>Phone: {data.personalInfo.phone}</p>}
        {data.personalInfo?.address && <p>Address: {data.personalInfo.address}</p>}
        {data.personalInfo?.website && <p>Portfolio: {data.personalInfo.website}</p>}
      </div>
    </header>

    {data.summary && (
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-widest">
          Profile
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm">{data.summary}</p>
      </section>
    )}

    {data.skills && data.skills.length > 0 && (
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-widest">
          Skills
        </h2>
        <div className="text-gray-700 text-sm leading-relaxed">
          {data.skills.join(', ')}
        </div>
      </section>
    )}

    {data.experience && data.experience.length > 0 && (
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-widest">
          Experience
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="font-medium text-gray-900 text-base">{exp.position}</h3>
              <span className="text-gray-500 text-xs">{exp.duration}</span>
            </div>
            <p className="text-gray-700 text-sm mb-3">{exp.company}</p>
            {exp.description && exp.description.length > 0 && (
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs ml-3">
                {exp.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    )}

    {data.education && data.education.length > 0 && (
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-widest">
          Education
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="font-medium text-gray-900 text-base">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-700 text-sm">{edu.institution}</p>
              </div>
              {edu.year && (
                <span className="text-gray-500 text-xs">{edu.year}</span>
              )}
            </div>
          </div>
        ))}
      </section>
    )}

    {data.projects && data.projects.length > 0 && (
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-widest">
          Projects
        </h2>
        {data.projects.map((project, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-medium text-gray-900 text-base">{project.name}</h3>
            <p className="text-gray-700 text-sm mb-1">{project.description}</p>
            {project.technologies && (
              <p className="text-gray-500 text-xs">
                {project.technologies.join(', ')}
              </p>
            )}
          </div>
        ))}
      </section>
    )}

    {data.certifications && data.certifications.length > 0 && (
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-widest">
          Certifications
        </h2>
        {data.certifications.map((cert, index) => (
          <div key={index} className="mb-2">
            <p className="text-gray-700 text-sm">
              <strong>{cert.name}</strong>
              {cert.issuer && ` — ${cert.issuer}`}
              {cert.year && ` (${cert.year})`}
            </p>
          </div>
        ))}
      </section>
    )}

    {data.languages && data.languages.length > 0 && (
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-widest">
          Languages
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {data.languages.map((lang, index) => (
            <div key={index} className="text-gray-700 text-sm">
              {lang.name} {lang.proficiency && `(${lang.proficiency})`}
            </div>
          ))}
        </div>
      </section>
    )}
  </div>
)

const ExecutiveATSTemplate = ({ data, isEditing, onEdit }) => (
  <div className="bg-white p-8 max-w-4xl mx-auto shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
    {/* Executive header with sidebar style */}
    <div className="flex">
      {/* Left sidebar */}
      <div className="w-1/3 bg-gray-50 p-6 mr-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {data.personalInfo?.fullName || 'Your Full Name'}
        </h1>
        
        {/* Contact Info */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">Contact</h3>
          <div className="text-xs text-gray-700 space-y-1">
            {data.personalInfo?.email && <p>{data.personalInfo.email}</p>}
            {data.personalInfo?.phone && <p>{data.personalInfo.phone}</p>}
            {data.personalInfo?.address && <p>{data.personalInfo.address}</p>}
            {data.personalInfo?.website && <p>{data.personalInfo.website}</p>}
          </div>
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">Core Skills</h3>
            <ul className="text-xs text-gray-700 space-y-1">
              {data.skills.map((skill, index) => (
                <li key={index}>• {skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">Education</h3>
            {data.education.map((edu, index) => (
              <div key={index} className="mb-3 text-xs text-gray-700">
                <p className="font-medium">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                <p>{edu.institution}</p>
                {edu.year && <p className="text-gray-600">{edu.year}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">Certifications</h3>
            {data.certifications.map((cert, index) => (
              <div key={index} className="mb-2 text-xs text-gray-700">
                <p className="font-medium">{cert.name}</p>
                {cert.issuer && <p>{cert.issuer}</p>}
                {cert.year && <p className="text-gray-600">{cert.year}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="w-2/3">
        {/* Executive Summary */}
        {data.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
              EXECUTIVE SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">{data.summary}</p>
          </section>
        )}

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
              PROFESSIONAL EXPERIENCE
            </h2>
            {data.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-gray-600 font-medium text-sm">{exp.duration}</span>
                </div>
                <p className="text-gray-700 font-semibold mb-2 text-sm">{exp.company}</p>
                {exp.description && exp.description.length > 0 && (
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Key Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
              KEY ACHIEVEMENTS & PROJECTS
            </h2>
            {data.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold text-gray-900 text-sm">{project.name}</h3>
                <p className="text-gray-700 text-sm">{project.description}</p>
                {project.technologies && (
                  <p className="text-gray-600 text-xs mt-1">
                    <em>Technologies: {project.technologies.join(', ')}</em>
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  </div>
)

const ATSResumeGenerator = ({ analysisResult, extractedData, onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [isEditing, setIsEditing] = useState(false)
  const [resumeData, setResumeData] = useState({})
  const [isExporting, setIsExporting] = useState(false)
  const resumeRef = useRef()

  // Initialize resume data from props or localStorage
  useEffect(() => {
    console.log('=== ATS GENERATOR USEEFFECT TRIGGERED ===')
    console.log('analysisResult:', analysisResult)
    console.log('extractedData:', extractedData)
    
    let data = extractedData || analysisResult?.extractedData || analysisResult?.data
    
    if (!data) {
      try {
        const stored = localStorage.getItem('extractedResumeData')
        console.log('Stored data from localStorage:', stored)
        if (stored) {
          data = JSON.parse(stored)
          console.log('Parsed stored data:', data)
        }
      } catch (error) {
        console.error('Error loading stored data:', error)
      }
    }

    if (data) {
      setResumeData(data)
      console.log('=== ATS GENERATOR INITIALIZED ===')
      console.log('Resume data loaded:', data)
    } else {
      console.log('=== NO DATA FOUND ===')
      console.log('Will show "No Resume Data Found" message')
    }
  }, [extractedData, analysisResult])

  const templates = {
    modern: {
      name: 'Modern ATS',
      description: 'Clean and professional with ATS optimization',
      component: ModernATSTemplate
    },
    classic: {
      name: 'Classic Professional',
      description: 'Traditional resume format, ATS-friendly',
      component: ClassicATSTemplate
    },
    minimal: {
      name: 'Minimal Clean',
      description: 'Simple and elegant design',
      component: MinimalATSTemplate
    },
    executive: {
      name: 'Executive',
      description: 'Professional sidebar layout for senior roles',
      component: ExecutiveATSTemplate
    }
  }

  const handleEdit = (section, field, value) => {
    setResumeData(prev => {
      const updated = { ...prev }
      if (field) {
        if (!updated[section]) updated[section] = {}
        updated[section][field] = value
      } else {
        updated[section] = value
      }
      return updated
    })
  }

  const exportToPDF = async () => {
    if (!resumeRef.current) return
    
    setIsExporting(true)
    try {
      const element = resumeRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const fileName = `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_ATS_${templates[selectedTemplate].name.replace(/\s+/g, '_')}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      const element = resumeRef.current
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        allowTaint: true
      })
      
      canvas.toBlob(async (blob) => {
        const item = new ClipboardItem({ 'image/png': blob })
        await navigator.clipboard.write([item])
        alert('Resume copied to clipboard!')
      })
    } catch (error) {
      console.error('Copy failed:', error)
      // Fallback: copy text content
      try {
        const textContent = resumeRef.current.innerText
        await navigator.clipboard.writeText(textContent)
        alert('Resume text copied to clipboard!')
      } catch (textError) {
        alert('Copy failed. Please try again.')
      }
    }
  }

  const printResume = () => {
    const printContent = resumeRef.current.innerHTML
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Resume - ${resumeData.personalInfo?.fullName || 'Resume'}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              line-height: 1.4;
            }
            @media print { 
              body { margin: 0; padding: 15px; }
              .no-print { display: none; }
            }
            h1, h2, h3 { margin-top: 0; }
            .border-b-2 { border-bottom: 2px solid #333; }
            .border-b { border-bottom: 1px solid #ccc; }
            .grid { display: grid; }
            .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
            .gap-2 { gap: 0.5rem; }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .pb-1 { padding-bottom: 0.25rem; }
            .pb-4 { padding-bottom: 1rem; }
            .text-3xl { font-size: 1.875rem; }
            .text-xl { font-size: 1.25rem; }
            .text-lg { font-size: 1.125rem; }
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            .text-gray-900 { color: #111827; }
            .text-gray-700 { color: #374151; }
            .text-gray-600 { color: #4B5563; }
            .list-disc { list-style-type: disc; }
            .list-inside { list-style-position: inside; }
            .space-y-1 > * + * { margin-top: 0.25rem; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const SelectedTemplate = templates[selectedTemplate].component

  console.log('=== ATS GENERATOR RENDER ===')
  console.log('resumeData:', resumeData)
  console.log('Object.keys(resumeData).length:', Object.keys(resumeData).length)
  console.log('selectedTemplate:', selectedTemplate)
  
  if (!resumeData || Object.keys(resumeData).length === 0) {
    console.log('=== SHOWING NO RESUME DATA MESSAGE ===')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Resume Data Found</h2>
          <p className="text-gray-600 mb-4">Please analyze a resume first to generate an ATS-friendly version.</p>
          
          {/* Debug Information */}
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-left text-sm">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p><strong>analysisResult:</strong> {analysisResult ? 'Present' : 'Null'}</p>
            <p><strong>extractedData:</strong> {extractedData ? 'Present' : 'Null'}</p>
            <p><strong>localStorage data:</strong> {localStorage.getItem('extractedResumeData') ? 'Present' : 'None'}</p>
            <p><strong>resumeData keys:</strong> {Object.keys(resumeData).length}</p>
          </div>
          
          <button
            onClick={onBack}
            className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Analyzer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Controls */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Analysis
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">ATS Resume Generator</h1>
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <CheckCircle size={16} />
                ATS Optimized
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Template Selector */}
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(templates).map(([key, template]) => (
                  <option key={key} value={key}>{template.name}</option>
                ))}
              </select>
              
              {/* Edit Toggle */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isEditing 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <Edit3 size={16} />
                {isEditing ? 'Exit Edit' : 'Edit Mode'}
              </button>
              
              {/* Save Changes Button - Only show in edit mode */}
              {isEditing && (
                <button
                  onClick={() => {
                    localStorage.setItem('extractedResumeData', JSON.stringify(resumeData))
                    alert('Changes saved successfully!')
                  }}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={16} />
                  Save Changes
                </button>
              )}
              
              {/* Export Options */}
              <div className="flex items-center gap-2">
                <button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={16} />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                  title="Copy to Clipboard"
                >
                  <Copy size={16} />
                </button>
                
                <button
                  onClick={printResume}
                  className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  title="Print Resume"
                >
                  <Printer size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Preview Cards */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(templates).map(([key, template]) => (
            <div
              key={key}
              onClick={() => setSelectedTemplate(key)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate === key
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                {selectedTemplate === key && (
                  <CheckCircle className="text-blue-600" size={20} />
                )}
              </div>
              <p className="text-sm text-gray-600">{template.description}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                <CheckCircle size={12} />
                ATS Compatible
              </div>
            </div>
          ))}
        </div>

        {/* Resume Preview */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Eye size={20} />
                Resume Preview - {templates[selectedTemplate].name}
              </h2>
              
              <div className="flex items-center gap-4">
                {isEditing && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Edit3 size={16} />
                    Edit mode active - Click fields to edit
                  </div>
                )}
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                  <CheckCircle size={14} />
                  ATS Optimized
                </div>
              </div>
            </div>
          </div>

          {/* Resume Content */}
          <div className="p-8 bg-white overflow-x-auto">
            <div ref={resumeRef}>
              <SelectedTemplate 
                data={resumeData} 
                isEditing={isEditing}
                onEdit={handleEdit}
              />
            </div>
          </div>
        </div>

        {/* ATS Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle size={20} />
            ATS Optimization Features & Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                ATS-Friendly Features Applied:
              </h4>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>Standard fonts (Arial, Times New Roman, Calibri, Georgia)</li>
                <li>Clear section headings with standard ATS-recognized names</li>
                <li>No complex formatting, tables, images, or graphics</li>
                <li>Keyword-optimized section titles (Professional Summary, Core Competencies)</li>
                <li>Standard date formats (YYYY-MM or YYYY-Present)</li>
                <li>Simple bullet points for easy parsing</li>
                <li>Contact information prominently placed in header</li>
                <li>Linear, single-column layout for better scanning</li>
                <li>Consistent formatting and spacing throughout</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Eye size={16} className="text-purple-600" />
                Best Practices Included:
              </h4>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>Industry-standard section order (Contact → Summary → Skills → Experience → Education)</li>
                <li>Action verbs in experience descriptions</li>
                <li>Quantified achievements where possible</li>
                <li>Relevant keywords naturally integrated</li>
                <li>Professional summary optimized for impact</li>
                <li>Skills section with core competencies listed</li>
                <li>Clean, scannable formatting for both ATS and human readers</li>
                <li>PDF export maintains formatting integrity</li>
                <li>Edit functionality allows customization per job application</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Pro Tip:</strong> Always save your resume as PDF when applying to preserve formatting. 
                This generator creates ATS-compatible resumes that are both machine-readable and human-friendly.
              </p>
            </div>
            
            <div className="p-4 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>✏️ Editing Guide:</strong> Use the "Edit Mode" to customize your resume for each job application. 
                Tailor your summary, skills, and experience descriptions to match the specific job requirements and keywords.
              </p>
            </div>
            
            <div className="p-4 bg-purple-100 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>📊 Template Selection:</strong> Choose templates based on your industry - Modern for tech/creative roles, 
                Classic for traditional industries, Minimal for clean aesthetic, and Executive for senior positions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ATSResumeGenerator
