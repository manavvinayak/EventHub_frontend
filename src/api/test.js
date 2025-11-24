const API_BASE_URL = `${import.meta.env.VITE_API_URL || "https://eventhub-backend-7iln.onrender.com"}/api`

// Test API connectivity
export const testConnection = async () => {
  try {
    console.log("🔍 Testing API connection to:", API_BASE_URL)
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    
    const data = await response.json()
    console.log("✅ API connection test successful:", data)
    return { success: true, data }
  } catch (error) {
    console.error("❌ API connection test failed:", error)
    return { success: false, error: error.message }
  }
}

// Test signup endpoint specifically
export const testSignupEndpoint = async (testData = { username: "test", email: "test@test.com", password: "test123" }) => {
  try {
    console.log("🧪 Testing signup endpoint connectivity...")
    
    const response = await fetch(`${API_BASE_URL}/test/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(testData),
    })
    
    const data = await response.json()
    console.log("✅ Signup endpoint test successful:", data)
    return { success: true, data }
  } catch (error) {
    console.error("❌ Signup endpoint test failed:", error)
    return { success: false, error: error.message }
  }
}

// Check current environment configuration
export const checkEnvironment = () => {
  const config = {
    apiUrl: import.meta.env.VITE_API_URL,
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    resolvedApiUrl: API_BASE_URL
  }
  
  console.log("🔧 Frontend Environment Configuration:", config)
  return config
}