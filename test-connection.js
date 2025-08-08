// Simple test to verify backend connectivity
console.log('Testing backend connection...')

fetch('http://localhost:3001/health')
  .then(response => {
    console.log('Response status:', response.status)
    return response.json()
  })
  .then(data => {
    console.log('Backend response:', data)
    alert('✅ Backend is connected: ' + data.message)
  })
  .catch(error => {
    console.error('Backend connection failed:', error)
    alert('❌ Backend connection failed: ' + error.message)
  })
