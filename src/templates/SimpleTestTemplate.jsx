import React from 'react'

const TestTemplate = ({ data }) => {
  console.log('TestTemplate rendering with data:', data)
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '400px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>
        {data?.personalInfo?.fullName || 'No Name Provided'}
      </h1>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
        Email: {data?.personalInfo?.email || 'No email'}
      </p>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
        Phone: {data?.personalInfo?.phone || 'No phone'}
      </p>
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Summary</h2>
        <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
          {data?.summary || 'No summary provided'}
        </p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Debug Data</h2>
        <pre style={{ fontSize: '12px', backgroundColor: '#f5f5f5', padding: '10px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default TestTemplate
