const API_BASE_URL = "http://localhost:5000/api/registrations"

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Something went wrong")
  }
  return response.json()
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
