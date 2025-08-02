"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signup, login } from "../api/auth.js"
import { useAuth } from "../App.jsx" // Import useAuth from App.jsx

function AuthPage({ isSignUp = false }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()
  const { setUser } = useAuth() // Get setUser from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      let userData
      if (isSignUp) {
        userData = await signup({ username, email, password })
        setSuccess("Sign up successful! Redirecting to dashboard...")
      } else {
        userData = await login({ email, password })
        setSuccess("Login successful! Redirecting to dashboard...")
      }
      setUser(userData) // Update user context
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500)
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.")
      console.error("Auth error:", err)
    }
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">{isSignUp ? "Sign Up" : "Login"}</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-300"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center">
          {isSignUp ? (
            <p className="text-gray-600">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline font-semibold">
                Login
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button onClick={() => navigate("/signup")} className="text-blue-600 hover:underline font-semibold">
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
