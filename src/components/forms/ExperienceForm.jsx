import React from 'react'
import { Plus, Trash2, Briefcase } from 'lucide-react'

const ExperienceForm = ({ data, onChange }) => {
  const addExperience = () => {
    onChange([
      ...data,
      {
        id: Date.now(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ])
  }

  const removeExperience = (id) => {
    onChange(data.filter(item => item.id !== id))
  }

  const updateExperience = (id, field, value) => {
    console.log(`Updating experience ${id}: ${field} = ${value}`)
    const updatedData = data.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    )
    console.log('Updated data:', updatedData)
    onChange(updatedData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
        <button
          onClick={addExperience}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No work experience added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Experience" to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((experience, index) => (
            <div key={experience.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Experience #{index + 1}
                </h4>
                <button
                  onClick={() => removeExperience(experience.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={experience.position || ''}
                    onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                    placeholder="Software Engineer"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={experience.company || ''}
                    onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                    placeholder="Tech Corp"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={experience.location || ''}
                    onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                    placeholder="San Francisco, CA"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    value={experience.startDate || ''}
                    onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date {experience.current ? '(Auto-filled as Present)' : ''}
                  </label>
                  <input
                    type="month"
                    value={experience.current ? '' : (experience.endDate || '')}
                    onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                    className={`input-field ${experience.current ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    disabled={experience.current}
                    placeholder={experience.current ? 'Present' : 'Select end date'}
                  />
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id={`current-${experience.id}`}
                    checked={experience.current || false}
                    onChange={(e) => {
                      console.log('Checkbox changed:', e.target.checked, 'for experience:', experience.id)
                      const isCurrentlyChecked = e.target.checked
                      
                      // Update both fields at once to avoid timing issues
                      const updatedData = data.map(item => {
                        if (item.id === experience.id) {
                          return {
                            ...item,
                            current: isCurrentlyChecked,
                            endDate: isCurrentlyChecked ? '' : item.endDate
                          }
                        }
                        return item
                      })
                      
                      console.log('Updating experience data:', updatedData)
                      onChange(updatedData)
                    }}
                    className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor={`current-${experience.id}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">I currently work here</span>
                      {experience.current && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          Current Position
                        </span>
                      )}
                    </div>
                    {experience.current && (
                      <div className="text-xs text-gray-500 mt-1">
                        End date will be automatically set to "Present"
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description *
                </label>
                <textarea
                  value={experience.description || ''}
                  onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                  placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality software&#10;• Improved application performance by 30% through code optimization"
                  rows={4}
                  className="input-field resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use bullet points and action verbs. Focus on achievements and quantifiable results.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>ATS Tip:</strong> Use action verbs and include keywords from the job description. 
          Quantify your achievements with numbers and percentages when possible.
        </p>
      </div>
    </div>
  )
}

export default ExperienceForm
