"use client"
import {
  Navbar as NavbarContainer,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar"
import { useAuth } from "../App.jsx" 
import { useState } from "react"
import { Link } from "react-router-dom"

function Navbar() {
  const { user, handleLogout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const onLogoutClick = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await handleLogout()
        setIsMobileMenuOpen(false)
      } catch (error) {
        console.error("Logout failed:", error)
        alert("Logout failed. Please try again.") 
      }
    }
  }

   const navItems = [
    { name: "Home", link: "/" },
    { name: "Events", link: "/events" },
    { name: "About", link: "/about" },
  ]

  if (user) {
    navItems.push({ name: "Dashboard", link: "/dashboard" })
  }

  if (user && user.role === "admin") {
    navItems.push({ name: "Admin Panel", link: "/admin" })
  }

  return (
    <div className="relative w-full">
      <NavbarContainer>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                  {user.username}
                </span>
                <NavbarButton variant="secondary" onClick={onLogoutClick}>
                  Logout
                </NavbarButton>
              </>
            ) : (
              <>
                <NavbarButton variant="secondary" to="/login">
                  Login
                </NavbarButton>
                <NavbarButton variant="primary" to="/login">
                  Sign Up
                </NavbarButton>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-rose-900 font-bold hover:text-indigo-600 transition-colors"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              {user ? (
                <>
                  <div className="text-sm text-neutral-600 dark:text-neutral-300">
                    Logged in as: <span className="font-semibold text-black dark:text-white">{user.username}</span>
                  </div>
                  <NavbarButton
                    onClick={onLogoutClick}
                    variant="secondary"
                    className="w-full"
                  >
                    Logout
                  </NavbarButton>
                </>
              ) : (
                <>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="secondary"
                    to="/login"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    to="/login"
                    className="w-full"
                  >
                    Sign Up
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </NavbarContainer>
    </div>
  )
}

export default Navbar
