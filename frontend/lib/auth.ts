const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// ----------------------
// Auth Interfaces
// ----------------------
export interface AuthResponse {
  token: string
}

export interface User {
  id: number
  username: string
  email: string
}

// ----------------------
// Authentication APIs
// ----------------------
export const authAPI = {
  // ✅ Register user
  register: async (username: string, email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, passwordHash: password }),
    })
    if (!response.ok) throw new Error("Registration failed")
    return response.json()
  },

  // ✅ Login user → returns JWT token (string)
  login: async (username: string, password: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, passwordHash: password }),
    })
    if (!response.ok) throw new Error("Login failed")
    return response.text()
  },
}

// ----------------------
// Token Helpers
// ----------------------

// ✅ Save JWT token
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

// ✅ Get JWT token
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// ✅ Remove JWT token (logout)
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
  }
}

// ----------------------
// Optional: Verify Current User
// ----------------------
export const getCurrentUser = async () => {
  const token = getToken()
  if (!token) return null

  const res = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) return null
  return res.json()
}

// ----------------------
// Auth Headers Helper
// ----------------------
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}
