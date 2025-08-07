import React, { useState } from 'react'
import { Plus, X, Code } from 'lucide-react'

const SkillsForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState('')
  const [skillCategory, setSkillCategory] = useState('Technical')

  const categories = ['Technical', 'Programming', 'Tools', 'Languages', 'Soft Skills', 'Certifications']

  const addSkill = () => {
    if (newSkill.trim()) {
      const skill = {
        id: Date.now(),
        name: newSkill.trim(),
        category: skillCategory,
        level: 'Intermediate'
      }
      onChange([...data, skill])
      setNewSkill('')
    }
  }

  const removeSkill = (id) => {
    onChange(data.filter(skill => skill.id !== id))
  }

  const updateSkill = (id, field, value) => {
    onChange(data.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    ))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const groupedSkills = data.reduce((groups, skill) => {
    const category = skill.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(skill)
    return groups
  }, {})

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
              placeholder="e.g., JavaScript, React, Project Management"
              className="input-field"
            />
          </div>
          <select
            value={skillCategory}
            onChange={(e) => setSkillCategory(e.target.value)}
            className="input-field w-auto"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={addSkill}
            className="btn-primary flex items-center space-x-2"
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
          <p className="text-sm text-gray-400 mt-1">Add your technical and soft skills above</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">{category}</h4>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                      className="input-field w-auto"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                      className="input-field w-auto"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>ATS Tip:</strong> Include both technical and soft skills relevant to your target role. 
          Use exact keywords from job descriptions and organize skills by category for better readability.
        </p>
      </div>
    </div>
  )
}

export default SkillsForm
