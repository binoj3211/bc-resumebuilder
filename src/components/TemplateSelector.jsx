import React from 'react'
import { Check } from 'lucide-react'

const TemplateSelector = ({ selectedTemplate, onSelectTemplate }) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and contemporary design with subtle colors',
      preview: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    {
      id: 'classic',
      name: 'Classic Traditional',
      description: 'Timeless black and white layout',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-100'
    },
    {
      id: 'creative',
      name: 'Creative Minimal',
      description: 'Bold design with creative elements',
      preview: 'bg-gradient-to-br from-purple-50 to-purple-100'
    },
    {
      id: 'executive',
      name: 'Executive Elegant',
      description: 'Sophisticated design for senior roles',
      preview: 'bg-gradient-to-br from-green-50 to-green-100'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={`relative p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
            
            <div className={`w-full h-20 rounded mb-3 ${template.preview}`}>
              <div className="p-3 space-y-1">
                <div className="h-2 bg-gray-300 rounded w-3/4 opacity-60"></div>
                <div className="h-1 bg-gray-300 rounded w-1/2 opacity-40"></div>
                <div className="h-1 bg-gray-300 rounded w-2/3 opacity-40"></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{template.description}</p>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-amber-50 rounded-lg">
        <p className="text-sm text-amber-700">
          <strong>Note:</strong> All templates are designed to be ATS-friendly with clean formatting and standard sections.
        </p>
      </div>
    </div>
  )
}

export default TemplateSelector
