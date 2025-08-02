// API base URL
const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth`

// Update your handleResponse function with better error handling
const handleResponse = async (response) => {
  try {
    // First get the raw text
    const text = await response.text();
    
    // Check if response is empty
    if (!text) {
      throw new Error(`Server returned an empty response. Status: ${response.status}`);
    }
    
    // Check if it's HTML (error page)
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}. URL: ${response.url}. This usually means the API endpoint was not found.`);
    }
    
    // Try to parse JSON
    const data = JSON.parse(text);
    
    // Handle non-200 responses
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (e) {
    console.error("Response error details:");
    console.error("- Error:", e.message);
    console.error("- Response status:", response.status);
    console.error("- Response URL:", response.url);
    console.error("- Response headers:", [...response.headers.entries()]);
    
    if (e instanceof SyntaxError) {
      throw new Error(`Invalid JSON response from server. URL: ${response.url}. Status: ${response.status}`);
    }
    
    throw e;
  }
}

export const login = async (credentials) => {
  try {
    console.log("Sending login request to:", `${API_BASE_URL}/login`);
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // This is crucial for cookies
      body: JSON.stringify(credentials),
    });
    
    console.log("Login response status:", response.status);
    console.log("Login response headers:", [...response.headers.entries()]);
    
    const result = await handleResponse(response);
    console.log("Login successful, result:", result);
    
    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export const signup = async (userData) => {
  try {
    console.log("Sending signup request to:", API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export const getProfile = async () => {
  try {
    console.log("Fetching profile from:", API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
}

export const logout = async () => {
  try {
    console.log("Sending logout request to:", API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}