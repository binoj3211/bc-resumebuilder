import React, { forwardRef } from 'react'
import ModernTemplate from '../templates/ModernTemplate'
import ClassicTemplate from '../templates/ClassicTemplate'
import CreativeTemplate from '../templates/CreativeTemplate'
import ExecutiveTemplate from '../templates/ExecutiveTemplate'
import OrderableTemplate from '../templates/OrderableTemplate'

const ResumePreview = forwardRef(({ data, template, sectionOrder }, ref) => {
  const renderTemplate = () => {
    try {
      switch (template) {
        case 'classic':
          return <ClassicTemplate data={data} />
        case 'creative':
          return <CreativeTemplate data={data} />
        case 'executive':
          return <ExecutiveTemplate data={data} />
        default:
          // Always use OrderableTemplate for modern to ensure all sections render
          const defaultOrder = [
            'personalInfo', 'summary', 'experience', 'education', 
            'skills', 'projects', 'certifications', 'languages', 'hobbies'
          ]
          const orderToUse = sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultOrder
          return <OrderableTemplate data={data} sectionOrder={orderToUse} />
      }
    } catch (error) {
      console.error('Template render error:', error)
      return (
        <div className="bg-white p-8 border rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {data?.personalInfo?.fullName || 'Your Name'}
          </h1>
          <p className="text-gray-600 mb-4">
            {data?.personalInfo?.email || 'your.email@example.com'}
          </p>
          <div className="text-sm text-red-600 mt-4 p-2 bg-red-50 rounded">
            Template loading error. Using fallback template.
          </div>
        </div>
      )
    }
  }

  return (
    <div ref={ref} className="resume-container bg-white">
      {renderTemplate()}
    </div>
  )
})

ResumePreview.displayName = 'ResumePreview'

export default ResumePreview
