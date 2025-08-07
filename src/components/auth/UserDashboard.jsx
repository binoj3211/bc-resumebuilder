import React, { useState, useEffect } from 'react'
import { User, FileText, Download, Trash2, Plus, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const UserDashboard = ({ onCreateNewResume, onLoadResume }) => {
  const { user, logout, loadUserResumes, deleteResume } = useAuth()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    fetchUserResumes()
  }, [])

  const fetchUserResumes = async () => {
    setLoading(true)
    const result = await loadUserResumes()
    if (result.success) {
      setResumes(result.resumes)
    }
    setLoading(false)
  }

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      const result = await deleteResume(resumeId)
      if (result.success) {
        setResumes(resumes.filter(resume => resume.id !== resumeId))
      } else {
        alert(result.error)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
              <p className="text-gray-600">Manage and create your professional resumes</p>
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    <div className="px-3 py-2 text-sm text-gray-500 border-b border-gray-100">
                      {user?.email}
                    </div>
                    <button
                      onClick={() => {/* Handle profile settings */}}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        logout()
                        setShowDropdown(false)
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create New Resume Button */}
        <div className="mb-8">
          <button
            onClick={onCreateNewResume}
            className="btn-primary flex items-center space-x-2 text-lg px-6 py-3"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Resume</span>
          </button>
        </div>

        {/* Resumes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading your resumes...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Create your first resume to get started</p>
            <button
              onClick={onCreateNewResume}
              className="btn-primary"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
              >
                {/* Resume Preview */}
                <div className="p-4 border-b border-gray-100">
                  <div className="aspect-[8.5/11] bg-gray-50 rounded-lg mb-3 overflow-hidden">
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                      <div className="space-y-1 mt-4">
                        <div className="h-2 bg-blue-200 rounded w-full"></div>
                        <div className="h-2 bg-blue-200 rounded w-4/5"></div>
                        <div className="h-2 bg-blue-200 rounded w-3/5"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {resume.name || 'Untitled Resume'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Updated {formatDate(resume.updatedAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onLoadResume(resume)}
                      className="flex-1 btn-primary py-2 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {/* Handle download */}}
                      className="btn-secondary p-2"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="btn-secondary p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
