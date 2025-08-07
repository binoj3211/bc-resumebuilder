import React from 'react'
import { Plus, Trash2, FolderOpen } from 'lucide-react'

const ProjectsForm = ({ data, onChange }) => {
  const addProject = () => {
    onChange([
      ...data,
      {
        id: Date.now(),
        name: '',
        description: '',
        technologies: '',
        url: '',
        github: '',
        startDate: '',
        endDate: ''
      }
    ])
  }

  const removeProject = (id) => {
    onChange(data.filter(item => item.id !== id))
  }

  const updateProject = (id, field, value) => {
    onChange(data.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
        <button
          onClick={addProject}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No projects added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Project" to showcase your work</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((project, index) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Project #{index + 1}
                </h4>
                <button
                  onClick={() => removeProject(project.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={project.name || ''}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    placeholder="E-commerce Website"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={project.startDate || ''}
                    onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={project.endDate || ''}
                    onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project URL
                  </label>
                  <input
                    type="url"
                    value={project.url || ''}
                    onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                    placeholder="https://myproject.com"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={project.github || ''}
                    onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies Used *
                  </label>
                  <input
                    type="text"
                    value={project.technologies || ''}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                    placeholder="React, Node.js, MongoDB, Express"
                    className="input-field"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate technologies with commas
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description *
                  </label>
                  <textarea
                    value={project.description || ''}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    placeholder="Developed a full-stack e-commerce platform with user authentication, payment processing, and admin dashboard. Implemented responsive design and optimized performance for mobile devices."
                    rows={3}
                    className="input-field resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Focus on your role, technologies used, and key achievements
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>ATS Tip:</strong> Include projects that demonstrate skills relevant to your target role. 
          Provide links to live demos and code repositories when possible. Highlight measurable outcomes and impact.
        </p>
      </div>
    </div>
  )
}

export default ProjectsForm
