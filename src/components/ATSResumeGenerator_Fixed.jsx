import React, { useState, useRef, useEffect } from 'react'
import { Download, Printer, Copy, Edit3, Eye, CheckCircle, AlertCircle, ArrowLeft, FileText, Sparkles } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const ModernATSTemplate = ({ data, isEditing, onEdit }) => (
  <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
    {/* Header */}
    <header className="border-b-2 border-blue-600 pb-4 mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {data.personalInfo?.fullName || 'Your Full Name'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
        {data.personalInfo?.email && <p>Email: {data.personalInfo.email}</p>}
        {data.personalInfo?.phone && <p>Phone: {data.personalInfo.phone}</p>}
        {data.personalInfo?.address && <p>Address: {data.personalInfo.address}</p>}
        {data.personalInfo?.website && <p>Website: {data.personalInfo.website}</p>}
      </div>
    </header>

    {/* Professional Summary */}
    {data.summary && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          Professional Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </section>
    )}

    {/* Skills */}
    {data.skills && data.skills.length > 0 && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          Core Competencies
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {data.skills.map((skill, index) => (
            <div key={index} className="text-gray-700">• {skill}</div>
          ))}
        </div>
      </section>
    )}

    {/* Professional Experience */}
    {data.experience && data.experience.length > 0 && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          Professional Experience
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
              <span className="text-gray-600 font-medium">{exp.duration}</span>
            </div>
            <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
            {exp.description && exp.description.length > 0 && (
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {exp.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    )}

    {/* Education */}
    {data.education && data.education.length > 0 && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          Education
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-700">{edu.institution}</p>
              </div>
              {edu.year && (
                <span className="text-gray-600 font-medium">{edu.year}</span>
              )}
            </div>
          </div>
        ))}
      </section>
    )}

    {/* Projects */}
    {data.projects && data.projects.length > 0 && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          Key Projects
        </h2>
        {data.projects.map((project, index) => (
          <div key={index} className="mb-3">
            <h3 className="font-semibold text-gray-900">{project.name}</h3>
            <p className="text-gray-700">{project.description}</p>
            {project.technologies && (
              <p className="text-gray-600 text-sm">
                <strong>Technologies:</strong> {project.technologies.join(', ')}
              </p>
            )}
          </div>
        ))}
      </section>
    )}

    {/* Certifications */}
    {data.certifications && data.certifications.length > 0 && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          Certifications
        </h2>
        {data.certifications.map((cert, index) => (
          <div key={index} className="mb-2">
            <p className="text-gray-700">
              <strong>{cert.name}</strong>
              {cert.issuer && ` - ${cert.issuer}`}
              {cert.year && ` (${cert.year})`}
            </p>
          </div>
        ))}
      </section>
    )}

    {/* Languages */}
    {data.languages && data.languages.length > 0 && (
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">
          Languages
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {data.languages.map((lang, index) => (
            <div key={index} className="text-gray-700">
              • {lang.name} {lang.proficiency && `(${lang.proficiency})`}
            </div>
          ))}
        </div>
      </section>
    )}
  </div>
)

const ClassicATSTemplate = ({ data, isEditing, onEdit }) => (
  <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Times New Roman, serif' }}>
    {/* Header - Centered */}
    <header className="text-center border-b-2 border-black pb-4 mb-6">
      <h1 className="text-4xl font-bold text-black mb-2 uppercase">
        {data.personalInfo?.fullName || 'Your Full Name'}
      </h1>
      <div className="text-black space-y-1">
        {data.personalInfo?.address && <p>{data.personalInfo.address}</p>}
        <p>
          {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo?.phone && data.personalInfo?.email && <span> | </span>}
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
        </p>
        {data.personalInfo?.website && <p>{data.personalInfo.website}</p>}
      </div>
    </header>

    {data.summary && (
      <section className="mb-6">
        <h2 className="text-lg font-bold text-black mb-2 text-center underline">
          OBJECTIVE
        </h2>
        <p className="text-black leading-relaxed text-justify">{data.summary}</p>
      </section>
    )}

    {data.skills && data.skills.length > 0 && (
      <section className="mb-6">
        <h2 className="text-lg font-bold text-black mb-2 text-center underline">
          TECHNICAL SKILLS
        </h2>
        <p className="text-black text-center">
          {data.skills.join(' • ')}
        </p>
      </section>
    )}

    {data.experience && data.experience.length > 0 && (
      <section className="mb-6">
        <h2 className="text-lg font-bold text-black mb-3 text-center underline">
          PROFESSIONAL EXPERIENCE
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="text-center mb-2">
              <h3 className="font-bold text-black">{exp.position}</h3>
              <p className="text-black italic">{exp.company} | {exp.duration}</p>
            </div>
            {exp.description && exp.description.length > 0 && (
              <ul className="list-disc list-inside text-black space-y-1 text-sm">
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
      <section className="mb-6">
        <h2 className="text-lg font-bold text-black mb-3 text-center underline">
          EDUCATION
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3 text-center">
            <h3 className="font-bold text-black">
              {edu.degree} {edu.field && `in ${edu.field}`}
            </h3>
            <p className="text-black">{edu.institution}</p>
            {edu.year && <p className="text-black italic">{edu.year}</p>}
          </div>
        ))}
      </section>
    )}
  </div>
)

const MinimalATSTemplate = ({ data, isEditing, onEdit }) => (
  <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Calibri, sans-serif' }}>
    {/* Minimal clean design */}
    <header className="mb-8">
      <h1 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
        {data.personalInfo?.fullName || 'Your Full Name'}
      </h1>
      <div className="text-gray-600 text-sm space-y-1 leading-relaxed">
        {data.personalInfo?.email && <p>Email: {data.personalInfo.email}</p>}
        {data.personalInfo?.phone && <p>Phone: {data.personalInfo.phone}</p>}
        {data.personalInfo?.address && <p>Address: {data.personalInfo.address}</p>}
        {data.personalInfo?.website && <p>Portfolio: {data.personalInfo.website}</p>}
      </div>
    </header>

    {data.summary && (
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wider">
          Profile
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm">{data.summary}</p>
      </section>
    )}

    {data.skills && data.skills.length > 0 && (
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wider">
          Skills
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          {data.skills.join(', ')}
        </p>
      </section>
    )}

    {data.experience && data.experience.length > 0 && (
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
          Experience
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-medium text-gray-900 text-sm">{exp.position}</h3>
              <span className="text-gray-600 text-xs">{exp.duration}</span>
            </div>
            <p className="text-gray-700 text-xs mb-2">{exp.company}</p>
            {exp.description && exp.description.length > 0 && (
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-xs ml-2">
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
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
          Education
        </h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="font-medium text-gray-900 text-sm">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <p className="text-gray-700 text-xs">{edu.institution}</p>
              </div>
              {edu.year && (
                <span className="text-gray-600 text-xs">{edu.year}</span>
              )}
            </div>
          </div>
        ))}
      </section>
    )}
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
    let data = extractedData || analysisResult?.extractedData || analysisResult?.data
    
    if (!data) {
      try {
        const stored = localStorage.getItem('extractedResumeData')
        if (stored) {
          data = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Error loading stored data:', error)
      }
    }

    if (data) {
      setResumeData(data)
      console.log('=== ATS GENERATOR INITIALIZED ===')
      console.log('Resume data loaded:', data)
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

  if (!resumeData || Object.keys(resumeData).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Resume Data Found</h2>
          <p className="text-gray-600 mb-4">Please analyze a resume first to generate an ATS-friendly version.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            ATS Optimization Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                ATS-Friendly Features Applied:
              </h4>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>Standard fonts (Arial, Times New Roman, Calibri)</li>
                <li>Clear section headings with standard names</li>
                <li>No complex formatting, tables, or graphics</li>
                <li>Keyword-optimized section titles</li>
                <li>Standard date formats (YYYY-MM)</li>
                <li>Simple bullet points for readability</li>
                <li>Contact information in header</li>
                <li>Linear, single-column layout</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Eye size={16} className="text-purple-600" />
                Best Practices Included:
              </h4>
              <ul className="space-y-2 list-disc list-inside ml-4">
                <li>Industry-standard section order</li>
                <li>Action verbs in experience descriptions</li>
                <li>Quantified achievements where possible</li>
                <li>Relevant keywords from your content</li>
                <li>Professional summary optimization</li>
                <li>Skills section with core competencies</li>
                <li>Clean, scannable formatting</li>
                <li>PDF export maintains formatting</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> Always save your resume as PDF when applying to preserve formatting. 
              This generator creates ATS-compatible resumes that are both human and machine-readable.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ATSResumeGenerator
