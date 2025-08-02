"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../App.jsx" 
import { useState } from "react"

function Navbar() {
  const { user, setUser, handleLogout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const onLogoutClick = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await handleLogout()
      } catch (error) {
        console.error("Logout failed:", error)
        alert("Logout failed. Please try again.") 
      }
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 backdrop-blur-md border-b border-white/10 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="group flex items-center space-x-2" onClick={closeMobileMenu}>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-white text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Home
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link 
              to="/events" 
              className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Events
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              About
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                Dashboard
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            )}
            {user && user.role === "admin" && (
              <Link 
                to="/admin" 
                className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                Admin Panel
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-white/90 text-sm">{user.username}</span>
                </div>
                <button
                  onClick={onLogoutClick}
                  className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm border border-white/20"
              >
                Login / Sign Up
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{user.username.charAt(0).toUpperCase()}</span>
              </div>
            )}
            
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="pt-4 pb-2 space-y-2">
            {/* Mobile Navigation Links */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
            >
              🏠 Home
            </Link>
            <Link
              to="/events"
              onClick={closeMobileMenu}
              className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
            >
              🎉 Events
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
            >
              ℹ️ About
            </Link>
            
            {user && (
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
              >
                📊 Dashboard
              </Link>
            )}
            
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
              >
                ⚙️ Admin Panel
              </Link>
            )}

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-white/20">
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-white/70 text-sm">
                    Logged in as: <span className="font-semibold text-white">{user.username}</span>
                  </div>
                  <button
                    onClick={() => {
                      onLogoutClick()
                      closeMobileMenu()
                    }}
                    className="block w-full text-left px-4 py-3 text-red-200 hover:text-white hover:bg-red-500/20 rounded-lg transition-all duration-300 font-medium"
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium text-center bg-white/10 border border-white/20"
                >
                  🔐 Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
