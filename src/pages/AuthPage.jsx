"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signup, login } from "../api/auth.js"
import { testConnection, testSignupEndpoint, checkEnvironment } from "../api/test.js"
import { useAuth } from "../App.jsx" // Import useAuth from App.jsx

function AuthPage({ isSignUp = false }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth() // Get setUser from AuthContext

  // Debug function to test API connectivity
  const handleDebugTest = async () => {
    console.log("🔧 Starting debug tests...")
    
    // Check environment
    const envConfig = checkEnvironment()
    
    // Test basic connectivity
    const healthTest = await testConnection()
    
    // Test signup endpoint
    const signupTest = await testSignupEndpoint()
    
    setError(`Debug Results:
 Environment: ${envConfig.mode}
 API URL: ${envConfig.resolvedApiUrl}
  Signup Test: ${signupTest.success ? "✅ Pass" : "❌ Fail"}
${!healthTest.success ? `Health Error: ${healthTest.error}` : ''}
${!signupTest.success ? `Signup Error: ${signupTest.error}` : ''}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prevent double submission
    if (isLoading) return
    
    setError("")
    setSuccess("")

    // Validate inputs
    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()

    if (isSignUp) {
      if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
        setError("Please fill in all required fields")
        return
      }

      if (trimmedUsername.length < 3) {
        setError("Username must be at least 3 characters long")
        return
      }

      if (trimmedPassword.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }

      if (trimmedPassword !== confirmPassword.trim()) {
        setError("Passwords do not match")
        return
      }
    }

    setIsLoading(true)

    try {
      let userData
      if (isSignUp) {
        userData = await signup({ 
          username: trimmedUsername, 
          email: trimmedEmail, 
          password: trimmedPassword 
        })
        setSuccess("Sign up successful! Redirecting to dashboard...")
      } else {
        userData = await login({ 
          email: trimmedEmail, 
          password: trimmedPassword 
        })
        setSuccess("Login successful! Redirecting to dashboard...")
      }
      setUser(userData) // Update user context
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500)
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.")
      console.error("Auth error:", err)
    } finally {
      setIsLoading(false)
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
                Username (minimum 3 characters)
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
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
              Password {isSignUp && "(minimum 6 characters)"}
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={isSignUp ? 6 : undefined}
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
            disabled={isLoading}
            className={`${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-300`}
          >
            {isLoading 
              ? (isSignUp ? "Signing Up..." : "Logging In...") 
              : (isSignUp ? "Sign Up" : "Login")
            }
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
