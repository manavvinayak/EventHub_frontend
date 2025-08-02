const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/events`
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Something went wrong")
  }
  return response.json()
}

export const getEvents = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString()
  const url = queryParams ? `${API_BASE_URL}?${queryParams}` : API_BASE_URL
  const response = await fetch(url)
  return handleResponse(response)
}

export const getEventById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`)
  return handleResponse(response)
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
