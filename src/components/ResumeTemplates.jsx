import React from 'react';

// Modern Template - Clean and contemporary
export const ModernTemplate = ({ data, isEditing, onUpdate }) => (
  <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
    {/* Header */}
    <header className="border-b-2 border-blue-600 pb-4 mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {data.personalInfo?.fullName || 'Your Name'}
      </h1>
      <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
        <span>📧 {data.personalInfo?.email || 'your.email@example.com'}</span>
        <span>📱 {data.personalInfo?.phone || '(555) 123-4567'}</span>
        <span>📍 {data.personalInfo?.location || 'City, State'}</span>
      </div>
    </header>

    {/* Summary */}
    <section className="mb-6">
      <h2 className="text-xl font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
        PROFESSIONAL SUMMARY
      </h2>
      <p className="text-gray-700 leading-relaxed">
        {data.summary || 'Professional summary highlighting your key skills and experience...'}
      </p>
    </section>

    {/* Skills */}
    <section className="mb-6">
      <h2 className="text-xl font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
        CORE SKILLS
      </h2>
      <div className="flex flex-wrap gap-2">
        {data.skills?.flatMap(skillGroup => 
          skillGroup.items || [skillGroup]
        ).map((skill, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {skill}
          </span>
        ))}
      </div>
    </section>

    {/* Experience */}
    <section className="mb-6">
      <h2 className="text-xl font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
        PROFESSIONAL EXPERIENCE
      </h2>
      {data.experience?.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{exp.position || 'Job Title'}</h3>
              <p className="text-blue-600 font-medium">{exp.company || 'Company Name'}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>{exp.duration || 'MM/YYYY - MM/YYYY'}</p>
              <p>{exp.location || 'City, State'}</p>
            </div>
          </div>
          <ul className="list-disc list-inside ml-4 space-y-1">
            {exp.achievements?.map((achievement, i) => (
              <li key={i} className="text-gray-700 text-sm">{achievement}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    {/* Education */}
    <section className="mb-6">
      <h2 className="text-xl font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
        EDUCATION
      </h2>
      {data.education?.map((edu, index) => (
        <div key={index} className="mb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{edu.degree || 'Degree'} - {edu.field || 'Field'}</h3>
              <p className="text-blue-600">{edu.institution || 'University Name'}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>{edu.year || 'YYYY'}</p>
              <p>{edu.location || 'City, State'}</p>
            </div>
          </div>
        </div>
      ))}
    </section>

    {/* Projects */}
    {data.projects && data.projects.length > 0 && (
      <section className="mb-6">
        <h2 className="text-xl font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
          PROJECTS
        </h2>
        {data.projects.map((project, index) => (
          <div key={index} className="mb-3">
            <h3 className="font-semibold text-gray-900">{project.name}</h3>
            <p className="text-gray-700 text-sm mb-1">{project.description}</p>
            <p className="text-blue-600 text-sm">
              Technologies: {project.technologies?.join(', ') || 'Tech stack'}
            </p>
          </div>
        ))}
      </section>
    )}

    {/* Certifications */}
    {data.certifications && data.certifications.length > 0 && (
      <section className="mb-6">
        <h2 className="text-xl font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
          CERTIFICATIONS
        </h2>
        <ul className="space-y-1">
          {data.certifications.map((cert, index) => (
            <li key={index} className="text-gray-700 text-sm">• {cert}</li>
          ))}
        </ul>
      </section>
    )}
  </div>
);

// Classic Template - Traditional and professional
export const ClassicTemplate = ({ data, isEditing, onUpdate }) => (
  <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
    {/* Header */}
    <header className="text-center border-b-2 border-gray-400 pb-4 mb-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Times New Roman, serif' }}>
        {data.personalInfo?.fullName || 'Your Name'}
      </h1>
      <div className="text-gray-600 text-sm space-y-1">
        <p>{data.personalInfo?.email || 'your.email@example.com'} | {data.personalInfo?.phone || '(555) 123-4567'}</p>
        <p>{data.personalInfo?.location || 'City, State'}</p>
      </div>
    </header>

    {/* Summary */}
    <section className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
        Professional Summary
      </h2>
      <p className="text-gray-700 leading-relaxed text-justify">
        {data.summary || 'Professional summary highlighting your key skills and experience...'}
      </p>
    </section>

    {/* Experience */}
    <section className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
        Professional Experience
      </h2>
      {data.experience?.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{exp.position || 'Job Title'}</h3>
              <p className="italic text-gray-700">{exp.company || 'Company Name'}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p className="font-medium">{exp.duration || 'MM/YYYY - MM/YYYY'}</p>
              <p>{exp.location || 'City, State'}</p>
            </div>
          </div>
          <ul className="list-disc list-inside ml-4 space-y-1">
            {exp.achievements?.map((achievement, i) => (
              <li key={i} className="text-gray-700 text-sm">{achievement}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    {/* Education */}
    <section className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
        Education
      </h2>
      {data.education?.map((edu, index) => (
        <div key={index} className="mb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-900">{edu.degree || 'Degree'} in {edu.field || 'Field'}</h3>
              <p className="italic text-gray-700">{edu.institution || 'University Name'}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p className="font-medium">{edu.year || 'YYYY'}</p>
            </div>
          </div>
        </div>
      ))}
    </section>

    {/* Skills */}
    <section className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
        Core Competencies
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {data.skills?.flatMap(skillGroup => 
          skillGroup.items || [skillGroup]
        ).map((skill, index) => (
          <span key={index} className="text-gray-700 text-sm">• {skill}</span>
        ))}
      </div>
    </section>
  </div>
);

// Minimal Template - Simple and clean
export const MinimalTemplate = ({ data, isEditing, onUpdate }) => (
  <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
    {/* Header */}
    <header className="mb-8">
      <h1 className="text-4xl font-light text-gray-900 mb-3">
        {data.personalInfo?.fullName || 'Your Name'}
      </h1>
      <div className="text-gray-600 text-sm space-x-4">
        <span>{data.personalInfo?.email || 'your.email@example.com'}</span>
        <span>{data.personalInfo?.phone || '(555) 123-4567'}</span>
        <span>{data.personalInfo?.location || 'City, State'}</span>
      </div>
    </header>

    {/* Summary */}
    <section className="mb-8">
      <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-widest">
        Summary
      </h2>
      <p className="text-gray-700 leading-relaxed">
        {data.summary || 'Professional summary highlighting your key skills and experience...'}
      </p>
    </section>

    {/* Experience */}
    <section className="mb-8">
      <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">
        Experience
      </h2>
      {data.experience?.map((exp, index) => (
        <div key={index} className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{exp.position || 'Job Title'}</h3>
              <p className="text-gray-600">{exp.company || 'Company Name'}</p>
            </div>
            <p className="text-sm text-gray-500">{exp.duration || 'MM/YYYY - MM/YYYY'}</p>
          </div>
          <ul className="space-y-1 ml-0">
            {exp.achievements?.map((achievement, i) => (
              <li key={i} className="text-gray-700 text-sm">— {achievement}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    {/* Education */}
    <section className="mb-8">
      <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">
        Education
      </h2>
      {data.education?.map((edu, index) => (
        <div key={index} className="mb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{edu.degree || 'Degree'}, {edu.field || 'Field'}</h3>
              <p className="text-gray-600">{edu.institution || 'University Name'}</p>
            </div>
            <p className="text-sm text-gray-500">{edu.year || 'YYYY'}</p>
          </div>
        </div>
      ))}
    </section>

    {/* Skills */}
    <section className="mb-8">
      <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">
        Skills
      </h2>
      <p className="text-gray-700">
        {data.skills?.flatMap(skillGroup => 
          skillGroup.items || [skillGroup]
        ).join(' • ')}
      </p>
    </section>
  </div>
);

// Executive Template - Premium design
export const ExecutiveTemplate = ({ data, isEditing, onUpdate }) => (
  <div className="bg-white max-w-4xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
    {/* Header */}
    <header className="bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-3">
        {data.personalInfo?.fullName || 'Your Name'}
      </h1>
      <div className="text-gray-300 space-y-1">
        <p>{data.personalInfo?.email || 'your.email@example.com'} | {data.personalInfo?.phone || '(555) 123-4567'}</p>
        <p>{data.personalInfo?.location || 'City, State'}</p>
      </div>
    </header>

    <div className="p-8">
      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-900">
          EXECUTIVE SUMMARY
        </h2>
        <p className="text-gray-700 leading-relaxed text-justify">
          {data.summary || 'Executive summary highlighting your leadership experience and strategic accomplishments...'}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-900">
          PROFESSIONAL EXPERIENCE
        </h2>
        {data.experience?.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{exp.position || 'Executive Position'}</h3>
                <p className="text-gray-700 font-medium">{exp.company || 'Company Name'}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{exp.duration || 'MM/YYYY - MM/YYYY'}</p>
                <p className="text-gray-600">{exp.location || 'City, State'}</p>
              </div>
            </div>
            <ul className="space-y-2 ml-4">
              {exp.achievements?.map((achievement, i) => (
                <li key={i} className="text-gray-700">• {achievement}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education & Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Education */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-900">
            EDUCATION
          </h2>
          {data.education?.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-gray-900">{edu.degree || 'Degree'}</h3>
              <p className="text-gray-700">{edu.field || 'Field of Study'}</p>
              <p className="text-gray-600 text-sm">{edu.institution || 'University'} • {edu.year || 'YYYY'}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-900">
            CORE COMPETENCIES
          </h2>
          <div className="space-y-2">
            {data.skills?.flatMap(skillGroup => 
              skillGroup.items || [skillGroup]
            ).map((skill, index) => (
              <div key={index} className="text-gray-700">• {skill}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

// Creative Template - Visual sidebar design
export const CreativeTemplate = ({ data, isEditing, onUpdate }) => (
  <div className="bg-white max-w-4xl mx-auto flex" style={{ fontFamily: 'Roboto, sans-serif' }}>
    {/* Sidebar */}
    <div className="w-1/3 bg-purple-700 text-white p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {data.personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="text-purple-200 text-sm space-y-1">
          <p>{data.personalInfo?.email || 'your.email@example.com'}</p>
          <p>{data.personalInfo?.phone || '(555) 123-4567'}</p>
          <p>{data.personalInfo?.location || 'City, State'}</p>
        </div>
      </div>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4 text-purple-100">SKILLS</h2>
        <div className="space-y-2">
          {data.skills?.flatMap(skillGroup => 
            skillGroup.items || [skillGroup]
          ).map((skill, index) => (
            <div key={index} className="bg-purple-600 px-3 py-1 rounded text-sm">
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-lg font-bold mb-4 text-purple-100">EDUCATION</h2>
        {data.education?.map((edu, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-bold text-sm">{edu.degree || 'Degree'}</h3>
            <p className="text-purple-200 text-sm">{edu.field || 'Field'}</p>
            <p className="text-purple-300 text-xs">{edu.institution || 'University'}</p>
            <p className="text-purple-300 text-xs">{edu.year || 'YYYY'}</p>
          </div>
        ))}
      </section>
    </div>

    {/* Main Content */}
    <div className="w-2/3 p-8">
      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">ABOUT ME</h2>
        <p className="text-gray-700 leading-relaxed">
          {data.summary || 'Creative professional with a passion for innovative design and strategic thinking...'}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">EXPERIENCE</h2>
        {data.experience?.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="mb-2">
              <h3 className="text-lg font-bold text-gray-900">{exp.position || 'Position'}</h3>
              <p className="text-purple-600 font-medium">{exp.company || 'Company'}</p>
              <p className="text-gray-500 text-sm">{exp.duration || 'MM/YYYY - MM/YYYY'} | {exp.location || 'Location'}</p>
            </div>
            <ul className="space-y-1">
              {exp.achievements?.map((achievement, i) => (
                <li key={i} className="text-gray-700 text-sm">• {achievement}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-purple-700 mb-4">PROJECTS</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-gray-900">{project.name}</h3>
              <p className="text-gray-700 text-sm mb-2">{project.description}</p>
              <p className="text-purple-600 text-sm">
                {project.technologies?.join(' • ') || 'Technologies used'}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  </div>
);
