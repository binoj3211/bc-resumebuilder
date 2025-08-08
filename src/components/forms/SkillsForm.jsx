import React, { useState } from 'react'
import { Plus, X, Code } from 'lucide-react'

const SkillsForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState('')

  const addSkill = () => {
    if (newSkill.trim()) {
      const skill = {
        id: Date.now(),
        name: newSkill.trim()
      }
      onChange([...data, skill])
      setNewSkill('')
    }
  }

  const removeSkill = (id) => {
    onChange(data.filter(skill => skill.id !== id))
  }

  const updateSkill = (id, value) => {
    onChange(data.map(skill =>
      skill.id === id ? { ...skill, name: value } : skill
    ))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Skills</h3>

      {/* Add New Skill */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-3">Add New Skill</h4>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., JavaScript, React, Project Management, Adobe Photoshop"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Skills Display */}
      {data.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No skills added yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your skills above</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="text-md font-medium text-gray-900">Your Skills</h4>
          <div className="grid grid-cols-1 gap-3">
            {data.map((skill) => (
              <div key={skill.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Skill name"
                  />
                </div>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>ATS Tip:</strong> Add both technical and soft skills relevant to your target role. 
          Use exact keywords from job descriptions for better ATS compatibility.
        </p>
      </div>
    </div>
  )
}

export default SkillsForm
