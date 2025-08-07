import React from 'react'

const TestTemplate = ({ data }) => {
  console.log('TestTemplate received data:', data)
  
  return (
    <div className="bg-white p-8 border rounded-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        {data?.personalInfo?.fullName || 'John Doe'}
      </h1>
      <p className="text-gray-600 mb-4">
        {data?.personalInfo?.email || 'john.doe@email.com'}
      </p>
      <p className="text-gray-600 mb-4">
        {data?.personalInfo?.phone || 'No phone provided'}
      </p>
      <p className="text-gray-600 mb-4">
        {data?.personalInfo?.location || 'No location provided'}
      </p>
      
      {data?.summary && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary</h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>
      )}
      
      {data?.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-2">
              <h3 className="font-medium">{exp.position || 'Position'}</h3>
              <p className="text-gray-600">{exp.company || 'Company'}</p>
              <p className="text-gray-500 text-sm">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
            </div>
          ))}
        </div>
      )}
      
      {data?.skills && data.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {data?.languages && data.languages.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Languages</h2>
          {data.languages.map((lang, index) => (
            <div key={index} className="mb-1">
              <span className="font-medium">{lang.language}</span> - <span className="text-gray-600">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      )}
      
      {data?.hobbies && data.hobbies.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Hobbies & Interests</h2>
          <div className="flex flex-wrap gap-2">
            {data.hobbies.map((hobby, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                {typeof hobby === 'string' ? hobby : hobby.hobby}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {data?.detailedSectionAnalysis && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Section-by-Section Analysis</h2>
          <div className="space-y-4">
            {Object.entries(data.detailedSectionAnalysis).map(([section, analysis]) => (
              <div key={section} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${analysis.score >= 80 ? 'bg-green-100 text-green-800' : analysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {Math.round(analysis.score)}/100
                  </span>
                </div>
                {analysis.strengths && analysis.strengths.length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-sm font-medium text-green-700 mb-1">Strengths:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {analysis.strengths.slice(0, 3).map((strength, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-1">•</span>{strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.improvements && analysis.improvements.length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-sm font-medium text-orange-700 mb-1">Improvements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {analysis.improvements.slice(0, 3).map((improvement, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-orange-500 mr-1">•</span>{improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-500 mt-4 p-2 bg-gray-100 rounded">
        <p><strong>Debug Info:</strong></p>
        <p>Data keys: {data ? Object.keys(data).join(', ') : 'No data'}</p>
        <p>Personal Info keys: {data?.personalInfo ? Object.keys(data.personalInfo).join(', ') : 'No personal info'}</p>
        <p>Skills count: {data?.skills?.length || 0}</p>
        <p>Experience count: {data?.experience?.length || 0}</p>
        <p>Languages count: {data?.languages?.length || 0}</p>
        <p>Hobbies count: {data?.hobbies?.length || 0}</p>
      </div>
    </div>
  )
}

export default TestTemplate
