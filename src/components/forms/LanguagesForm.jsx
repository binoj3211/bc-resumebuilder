import React from 'react'
import { Plus, Trash2, Globe } from 'lucide-react'

const LanguagesForm = ({ data = [], onChange }) => {
  const addLanguage = () => {
    const newLanguages = [...data, { language: '', proficiency: 'Beginner' }]
    onChange(newLanguages)
  }

  const removeLanguage = (index) => {
    const newLanguages = data.filter((_, i) => i !== index)
    onChange(newLanguages)
  }

  const updateLanguage = (index, field, value) => {
    const newLanguages = data.map((lang, i) => 
      i === index ? { ...lang, [field]: value } : lang
    )
    onChange(newLanguages)
  }

  const proficiencyLevels = [
    'Native',
    'Fluent',
    'Advanced',
    'Intermediate',
    'Conversational',
    'Beginner'
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Languages
          </h3>
          <p className="text-sm text-gray-600">Add languages you speak and your proficiency level</p>
        </div>
        <button
          type="button"
          onClick={addLanguage}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Language</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No languages added yet</p>
          <button
            type="button"
            onClick={addLanguage}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Add your first language
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((language, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-medium text-gray-900">Language {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    value={language.language}
                    onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                    placeholder="e.g., Spanish, French, Mandarin"
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proficiency Level
                  </label>
                  <select
                    value={language.proficiency}
                    onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                    className="input-field"
                  >
                    {proficiencyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguagesForm
