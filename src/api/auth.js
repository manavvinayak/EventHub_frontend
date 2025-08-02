// Update your handleResponse function with better error handling
const handleResponse = async (response) => {
  try {
    // First get the raw text
    const text = await response.text();
    
    // Check if response is empty
    if (!text) {
      throw new Error("Server returned an empty response");
    }
    
    // Try to parse JSON
    const data = JSON.parse(text);
    
    // Handle non-200 responses
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    
    return data;
  } catch (e) {
    console.error("Response error:", e);
    console.log("Response status:", response.status);
    console.log("Response headers:", [...response.headers.entries()]);
    throw new Error(e.message || "Invalid response from server");
  }
}

export const login = async (credentials) => {
  try {
    console.log("Sending login request to:", API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}