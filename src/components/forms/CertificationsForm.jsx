import React from 'react'
import { Plus, Trash2, Award } from 'lucide-react'

const CertificationsForm = ({ data, onChange }) => {
  const addCertification = () => {
    onChange([
      ...data,
      {
        id: Date.now(),
        name: '',
        issuer: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        url: ''
      }
    ])
  }

  const removeCertification = (id) => {
    onChange(data.filter(item => item.id !== id))
  }

  const updateCertification = (id, field, value) => {
    onChange(data.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
        <button
          onClick={addCertification}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No certifications added yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your professional certifications and licenses</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((certification, index) => (
            <div key={certification.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">
                  Certification #{index + 1}
                </h4>
                <button
                  onClick={() => removeCertification(certification.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    value={certification.name || ''}
                    onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    value={certification.issuer || ''}
                    onChange={(e) => updateCertification(certification.id, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="month"
                    value={certification.issueDate || ''}
                    onChange={(e) => updateCertification(certification.id, 'issueDate', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="month"
                    value={certification.expirationDate || ''}
                    onChange={(e) => updateCertification(certification.id, 'expirationDate', e.target.value)}
                    className="input-field"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty if certification doesn't expire
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    value={certification.credentialId || ''}
                    onChange={(e) => updateCertification(certification.id, 'credentialId', e.target.value)}
                    placeholder="ABC123DEF456"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credential URL
                  </label>
                  <input
                    type="url"
                    value={certification.url || ''}
                    onChange={(e) => updateCertification(certification.id, 'url', e.target.value)}
                    placeholder="https://verify.certification.com/12345"
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
          <strong>ATS Tip:</strong> Include relevant professional certifications that enhance your qualifications. 
          Add credential IDs and verification URLs when available to boost credibility.
        </p>
      </div>
    </div>
  )
}

export default CertificationsForm
