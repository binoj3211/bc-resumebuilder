# Test API endpoints
Write-Host "Testing Backend API..." -ForegroundColor Green

# Test health endpoint
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET
    Write-Host "✅ Health check: $($healthResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test registration endpoint
try {
    $registerData = @{
        firstName = "Test"
        lastName = "User"
        email = "test@example.com"
        password = "password123"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "✅ Registration test: $($registerResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Registration test: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Yellow
    }
}

Write-Host "API testing complete!" -ForegroundColor Green
