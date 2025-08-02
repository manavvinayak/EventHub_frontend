// Base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Request headers
const headers = {
  'Content-Type': 'application/json'
};

// Helper for adding auth token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { ...headers, 'Authorization': `Bearer ${token}` } : headers;
};

// API request methods
export const api = {
  // GET request
  async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
  
  // POST request
  async post(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
  
  // PUT request
  async put(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
  
  // DELETE request
  async delete(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }
};