"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import AboutPage from "./pages/AboutPage.jsx"
import AuthPage from "./pages/AuthPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import AdminPanelPage from "./pages/AdminPanelPage.jsx"
import EventsPage from "./pages/EventsPage.jsx"
import EventDetailsPage from "./pages/EventDetailsPage.jsx"
import NotFoundPage from "./pages/NotFoundPage.jsx"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Loader from "./components/Loader.jsx"
import { getProfile, logout } from "./api/auth.js"

// Create AuthContext
const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const profile = await getProfile()
        setUser(profile)
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      alert("Logout failed. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader size="xl" text="Loading your experience..." />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage isSignUp />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanelPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  )
}

export default App
