const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth`

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Something went wrong")
  }
  return response.json()
}

export const signup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
    body: JSON.stringify(userData),
  })
  return handleResponse(response)
}

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  })
  return handleResponse(response)
}

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
  })
  return handleResponse(response)
}

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
  })
  return handleResponse(response)
}
