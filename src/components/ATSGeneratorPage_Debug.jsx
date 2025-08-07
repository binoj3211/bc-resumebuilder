import React, { useState } from 'react';

const ATSGeneratorPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  console.log('ATSGeneratorPage is rendering');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ATS Resume Generator</h1>
              <p className="text-gray-600">Create professional, ATS-friendly resumes</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Template Selector */}
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="modern">Modern Template</option>
                <option value="classic">Classic Template</option>
                <option value="minimal">Minimal Template</option>
              </select>

              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Edit
              </button>

              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Name</h1>
            <div className="text-gray-600 mb-6">
              <p>📧 your.email@example.com | 📱 (555) 123-4567 | 📍 City, State</p>
            </div>
            
            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700">
                Professional summary highlighting your key skills and experience...
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
                CORE SKILLS
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">JavaScript</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">React</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Node.js</span>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-blue-700 mb-3 border-b border-blue-200 pb-1">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Job Title</h3>
                <p className="text-blue-600 font-medium">Company Name</p>
                <p className="text-gray-600 text-sm">MM/YYYY - MM/YYYY | City, State</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li className="text-gray-700 text-sm">Achievement or responsibility 1</li>
                  <li className="text-gray-700 text-sm">Achievement or responsibility 2</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Current Template: {selectedTemplate}
          </h3>
          <p className="text-blue-800">
            This is a working debug version to test the component rendering.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ATSGeneratorPage;
