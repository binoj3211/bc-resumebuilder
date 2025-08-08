import React, { forwardRef } from 'react'
import ModernTemplate from '../templates/ModernTemplate'
import ModernTemplateNew from '../templates/ModernTemplate_New'
import ClassicTemplate from '../templates/ClassicTemplate'
import CreativeTemplate from '../templates/CreativeTemplate'
import ExecutiveTemplate from '../templates/ExecutiveTemplate'
import OrderableTemplate from '../templates/OrderableTemplate'
import TechTemplate from '../templates/TechTemplate'

const ResumePreview = forwardRef(({ data, template, sectionOrder }, ref) => {
  const renderTemplate = () => {
    try {
      const defaultOrder = [
        'personalInfo', 'summary', 'experience', 'education', 
        'skills', 'projects', 'certifications', 'languages', 'hobbies'
      ]
      const orderToUse = sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultOrder

      switch (template) {
        case 'modern':
          return <ModernTemplate data={data} />
        case 'classic':
          return <ClassicTemplate data={data} />
        case 'creative':
          return <CreativeTemplate data={data} />
        case 'executive':
          return <ExecutiveTemplate data={data} />
        case 'minimalist':
          // Use a clean, minimal version of modern template
          return <ModernTemplateNew data={data} />
        case 'tech':
          // Use dedicated TechTemplate with dark theme
          return <TechTemplate data={data} />
        case 'simple':
          // Use basic modern template
          return <ModernTemplate data={data} />
        case 'elegant':
          // Use creative template with elegant styling
          return <CreativeTemplate data={data} />
        default:
          // Always use OrderableTemplate for unknown templates
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
    <div ref={ref} className="resume-container h-full">
      {/* A4 Page Container with responsive sizing */}
      <div className="a4-preview-container h-full flex items-start justify-center" style={{
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}>
        <div className="template-content bg-white shadow-lg" style={{
          width: 'min(100%, 210mm)',
          minHeight: '297mm',
          maxWidth: '100%',
          backgroundColor: 'white',
          boxSizing: 'border-box',
          overflow: 'visible',
          transform: 'scale(min(1, calc((100vw - 80px) / 210mm)))',
          transformOrigin: 'top center'
        }}>
          {renderTemplate()}
        </div>
      </div>
      
      {/* Print styles for proper A4 formatting */}
      <style jsx>{`
        @media print {
          /* Hide everything except resume content */
          body > *:not(.resume-container) {
            display: none !important;
          }
          
          /* Reset body styles */
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            width: 210mm !important;
            min-height: 297mm !important;
          }
          
          /* Resume container styles */
          .resume-container {
            position: relative !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            max-width: none !important;
            transform: none !important;
            background: white !important;
            display: block !important;
            page-break-inside: avoid !important;
          }
          
          /* A4 container styles */
          .a4-preview-container {
            transform: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            max-width: none !important;
            overflow: visible !important;
            background: white !important;
            position: relative !important;
          }
          
          /* Template content styles */
          .template-content {
            width: 210mm !important;
            min-height: 297mm !important;
            transform: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            position: relative !important;
            overflow: visible !important;
            box-sizing: border-box !important;
          }
          
          /* Page settings */
          @page {
            size: A4;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Ensure all content is visible and colors are preserved */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          /* Remove any transforms or positioning that might interfere */
          * {
            transform: none !important;
            position: static !important;
          }
          
          /* Ensure the template content has proper positioning */
          .template-content * {
            position: relative !important;
          }
        }
        
        /* PDF Export specific styles */
        .resume-container.pdf-export {
          transform: none !important;
          width: 210mm !important;
          min-height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .resume-container.pdf-export .a4-preview-container {
          transform: none !important;
          box-shadow: none !important;
          width: 210mm !important;
          min-height: 297mm !important;
        }
        
        /* Responsive scaling for different screen sizes */
        @media screen and (max-width: 1200px) {
          .a4-preview-container:not(.pdf-export) {
            transform: scale(0.7) !important;
          }
        }
        
        @media screen and (max-width: 900px) {
          .a4-preview-container:not(.pdf-export) {
            transform: scale(0.6) !important;
          }
        }
        
        @media screen and (max-width: 768px) {
          .a4-preview-container:not(.pdf-export) {
            transform: scale(0.5) !important;
          }
        }
      `}</style>
    </div>
  )
})

ResumePreview.displayName = 'ResumePreview'

export default ResumePreview
