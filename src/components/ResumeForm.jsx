import React, { useState } from 'react'
import { User, Briefcase, GraduationCap, Code, FolderOpen, Award, Plus, Trash2, AlertCircle, Globe, Heart, GripVertical, ArrowUpDown } from 'lucide-react'
import PersonalInfoForm from './forms/PersonalInfoForm'
import ExperienceForm from './forms/ExperienceForm'
import EducationForm from './forms/EducationForm'
import SkillsForm from './forms/SkillsForm'
import ProjectsForm from './forms/ProjectsForm'
import CertificationsForm from './forms/CertificationsForm'
import LanguagesForm from './forms/LanguagesForm'
import HobbiesForm from './forms/HobbiesForm'

const ResumeForm = ({ data, onChange, atsScore, onSectionOrderChange }) => {
  const [activeSection, setActiveSection] = useState('personalInfo')
  const [isReordering, setIsReordering] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  
  const [sections, setSections] = useState([
    { id: 'personalInfo', label: 'Personal Info', icon: User, fixed: true }, // Personal info should always be first
    { id: 'summary', label: 'Summary', icon: AlertCircle },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'languages', label: 'Languages', icon: Globe },
    { id: 'hobbies', label: 'Hobbies', icon: Heart }
  ])

  const handleSummaryChange = (e) => {
    onChange('summary', e.target.value)
  }

  const handleDragStart = (e, index) => {
    if (sections[index].fixed) return // Prevent dragging fixed sections
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return
    if (sections[dropIndex].fixed) return // Prevent dropping on fixed sections

    const newSections = [...sections]
    const draggedSection = newSections[draggedIndex]
    
    // Remove the dragged section
    newSections.splice(draggedIndex, 1)
    
    // Insert it at the new position (but never before Personal Info)
    const insertIndex = dropIndex === 0 ? 1 : dropIndex
    newSections.splice(insertIndex, 0, draggedSection)
    
    setSections(newSections)
    setDraggedIndex(null)
    
    // Notify parent of section order change
    if (onSectionOrderChange) {
      onSectionOrderChange(newSections.map(section => section.id))
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const resetSectionOrder = () => {
    setSections([
      { id: 'personalInfo', label: 'Personal Info', icon: User, fixed: true },
      { id: 'summary', label: 'Summary', icon: AlertCircle },
      { id: 'experience', label: 'Experience', icon: Briefcase },
      { id: 'education', label: 'Education', icon: GraduationCap },
      { id: 'skills', label: 'Skills', icon: Code },
      { id: 'projects', label: 'Projects', icon: FolderOpen },
      { id: 'certifications', label: 'Certifications', icon: Award },
      { id: 'languages', label: 'Languages', icon: Globe },
      { id: 'hobbies', label: 'Hobbies', icon: Heart }
    ])
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personalInfo':
        return (
          <PersonalInfoForm
            data={data.personalInfo}
            onChange={(newData) => onChange('personalInfo', newData)}
          />
        )
      case 'summary':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Summary
              </label>
              <textarea
                value={data.summary}
                onChange={handleSummaryChange}
                placeholder="Write a brief summary highlighting your key skills and experience..."
                rows={4}
                className="input-field resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                2-3 sentences that capture your professional value proposition
              </p>
            </div>
          </div>
        )
      case 'experience':
        return (
          <ExperienceForm
            data={data.experience}
            onChange={(newData) => onChange('experience', newData)}
          />
        )
      case 'education':
        return (
          <EducationForm
            data={data.education}
            onChange={(newData) => onChange('education', newData)}
          />
        )
      case 'skills':
        return (
          <SkillsForm
            data={data.skills}
            onChange={(newData) => onChange('skills', newData)}
          />
        )
      case 'projects':
        return (
          <ProjectsForm
            data={data.projects}
            onChange={(newData) => onChange('projects', newData)}
          />
        )
      case 'certifications':
        return (
          <CertificationsForm
            data={data.certifications}
            onChange={(newData) => onChange('certifications', newData)}
          />
        )
      case 'languages':
        return (
          <LanguagesForm
            data={data.languages}
            onChange={(newData) => onChange('languages', newData)}
          />
        )
      case 'hobbies':
        return (
          <HobbiesForm
            data={data.hobbies}
            onChange={(newData) => onChange('hobbies', newData)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Section Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        {/* Reorder Controls */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {isReordering ? 'Drag sections to reorder' : 'Resume sections'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsReordering(!isReordering)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                isReordering 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isReordering ? 'Done' : 'Reorder'}
            </button>
            {isReordering && (
              <button
                onClick={resetSectionOrder}
                className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <nav className="flex overflow-x-auto">
          {sections.map((section, index) => (
            <div
              key={section.id}
              draggable={!section.fixed && isReordering}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative ${isReordering && !section.fixed ? 'cursor-move' : ''}`}
            >
              <button
                onClick={() => setActiveSection(section.id)}
                disabled={isReordering}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${isReordering ? 'cursor-move' : 'cursor-pointer'} ${
                  section.fixed ? 'opacity-75' : ''
                }`}
              >
                {isReordering && !section.fixed && (
                  <GripVertical className="h-3 w-3 text-gray-400" />
                )}
                <section.icon className="h-4 w-4" />
                <span>{section.label}</span>
                {section.fixed && (
                  <span className="text-xs text-gray-400 ml-1">(fixed)</span>
                )}
              </button>
            </div>
          ))}
        </nav>
      </div>

      {/* ATS Score Banner */}
      {atsScore && (
        <div className={`p-4 border-b border-gray-200 ${
          atsScore >= 80 ? 'bg-green-50' :
          atsScore >= 60 ? 'bg-yellow-50' :
          'bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                atsScore >= 80 ? 'bg-green-500' :
                atsScore >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
              <span className="text-sm font-medium text-gray-700">
                ATS Compatibility Score: {atsScore}/100
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              atsScore >= 80 ? 'bg-green-100 text-green-800' :
              atsScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {atsScore >= 80 ? 'Excellent' : atsScore >= 60 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="p-6">
        {renderActiveSection()}
      </div>
    </div>
  )
}

export default ResumeForm
