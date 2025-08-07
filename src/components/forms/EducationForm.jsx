import React from 'react'
import { Plus, Trash2, GraduationCap } from 'lucide-react'

const EducationForm = ({ data, onChange }) => {
  const addEducation = () => {
    onChange([
      ...data,
      {
        id: Date.now(),
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        honors: ''
      }
    ])
  }

  const removeEducation = (id) => {
    onChange(data.filter(item => item.id !== id))
  }

  const updateEducation = (id, field, value) => {
    onChange(data.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
        <button
          onClick={addEducation}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Education</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No education added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Education" to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((education, index) => (
            <div key={education.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Education #{index + 1}
                </h4>
                <button
                  onClick={() => removeEducation(education.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={education.institution || ''}
                    onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                    placeholder="University of California"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree *
                  </label>
                  <select
                    value={education.degree || ''}
                    onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select Degree</option>
                    <option value="Associate">Associate Degree</option>
                    <option value="Bachelor">Bachelor's Degree</option>
                    <option value="Master">Master's Degree</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    value={education.field || ''}
                    onChange={(e) => updateEducation(education.id, 'field', e.target.value)}
                    placeholder="Computer Science"
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
                    value={education.location || ''}
                    onChange={(e) => updateEducation(education.id, 'location', e.target.value)}
                    placeholder="Berkeley, CA"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={education.startDate || ''}
                    onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date (or Expected)
                  </label>
                  <input
                    type="month"
                    value={education.endDate || ''}
                    onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={education.gpa || ''}
                    onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                    placeholder="3.8/4.0"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Honors/Awards
                  </label>
                  <input
                    type="text"
                    value={education.honors || ''}
                    onChange={(e) => updateEducation(education.id, 'honors', e.target.value)}
                    placeholder="Magna Cum Laude, Dean's List"
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>ATS Tip:</strong> Include your GPA only if it's 3.5 or higher. 
          List relevant coursework, honors, and academic achievements that relate to your target role.
        </p>
      </div>
    </div>
  )
}

export default EducationForm
