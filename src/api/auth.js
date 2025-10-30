
const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth`

const handleResponse = async (response) => {
  try {
    const text = await response.text();
    
    if (!text) {
      throw new Error(`Server returned an empty response. Status: ${response.status}`);
    }
    
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}. URL: ${response.url}. This usually means the API endpoint was not found.`);
    }
    
    const data = JSON.parse(text);
    
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
      credentials: "include", 
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