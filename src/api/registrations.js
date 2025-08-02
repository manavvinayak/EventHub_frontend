const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/registrations`
const handleResponse = async (response) => {
  try {
    const text = await response.text();
    
    if (!text) {
      throw new Error(`Server returned an empty response. Status: ${response.status}`);
    }
    
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}. URL: ${response.url}`);
    }
    
    const data = JSON.parse(text);
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (e) {
    console.error("Registrations API error:", e.message);
    console.error("Response URL:", response.url);
    console.error("Response status:", response.status);
    
    if (e instanceof SyntaxError) {
      throw new Error(`Invalid JSON response from registrations API. URL: ${response.url}`);
    }
    
    throw e;
  }
}

export const registerForEvent = async (eventId) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ eventId }),
    credentials: "include",
  })
  return handleResponse(response)
}

export const getUserRegistrations = async () => {
  const response = await fetch(`${API_BASE_URL}/my-registrations`, {
    method: "GET",
    credentials: "include",
  })
  return handleResponse(response)
}

export const cancelRegistration = async (registrationId) => {
  const response = await fetch(`${API_BASE_URL}/${registrationId}`, {
    method: "DELETE",
    credentials: "include",
  })
  return handleResponse(response)
}
