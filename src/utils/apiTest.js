// Simple API test utility
const testAPI = async () => {
  try {
    console.log("Testing API connectivity...")
    
    // Test 1: Basic health check
    const healthResponse = await fetch("https://eventhub-backend-7iln.onrender.com/api/health")
    console.log("Health check status:", healthResponse.status)
    const healthData = await healthResponse.json()
    console.log("Health data:", healthData)
    
    // Test 2: Events endpoint
    const eventsResponse = await fetch("https://eventhub-backend-7iln.onrender.com/api/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    console.log("Events endpoint status:", eventsResponse.status)
    console.log("Events endpoint headers:", [...eventsResponse.headers.entries()])
    
    if (eventsResponse.ok) {
      const eventsData = await eventsResponse.json()
      console.log("Events data:", eventsData)
    } else {
      const errorText = await eventsResponse.text()
      console.log("Events error response:", errorText)
    }
    
  } catch (error) {
    console.error("API test failed:", error)
  }
}

// Call this function in browser console to test
window.testAPI = testAPI

export default testAPI
