import React from 'react'

const TestComponent = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-6">
            🎉 ATS Generator Test Component Working!
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-700 text-lg mb-4">
              If you can see this message, the component loading is working correctly.
            </p>
            
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              ✅ Component successfully rendered
            </div>
            
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              ℹ️ This confirms that the routing and component loading mechanism is functional.
            </div>
          </div>

          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            ← Back to Analyzer
          </button>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Next Steps:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>If you see this, the basic component loading works</li>
              <li>We can now proceed to load the full ATS Generator</li>
              <li>Any issues would be in the ATS Generator component itself</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestComponent
