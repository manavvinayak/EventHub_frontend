const API_BASE_URL = `${import.meta.env.VITE_API_URL || "https://eventhub-backend-7iln.onrender.com"}/api/events`
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
    console.error("Events API error:", e.message);
    console.error("Response URL:", response.url);
    console.error("Response status:", response.status);
    
    if (e instanceof SyntaxError) {
      throw new Error(`Invalid JSON response from events API. URL: ${response.url}`);
    }
    
    throw e;
  }
}

export const getEvents = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString()
    const url = queryParams ? `${API_BASE_URL}?${queryParams}` : API_BASE_URL
    
    console.log("Fetching events from URL:", url)
    console.log("Using filters:", filters)
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include for consistency
    })
    
    console.log("Events response status:", response.status)
    console.log("Events response headers:", [...response.headers.entries()])
    
    const result = await handleResponse(response)
    console.log("Events fetched successfully:", result?.length || 0, "events")
    
    return result
  } catch (error) {
    console.error("getEvents error:", error)
    throw error
  }
}

export const getEventById = async (id) => {
  try {
    console.log("Fetching event by ID:", id)
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    
    console.log("Event by ID response status:", response.status)
    
    const result = await handleResponse(response)
    console.log("Event fetched successfully:", result)
    
    return result
  } catch (error) {
    console.error("getEventById error:", error)
    throw error
  }
}

export const createEvent = async (eventData) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
    credentials: "include",
  })
  return handleResponse(response)
}

export const updateEvent = async (id, eventData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
    credentials: "include",
  })
  return handleResponse(response)
}

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  return handleResponse(response)
}

export const getEventAttendees = async (eventId) => {
  const response = await fetch(`${API_BASE_URL}/${eventId}/attendees`, {
    method: "GET",
    credentials: "include",
  })
  return handleResponse(response)
}
