"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getEventById } from "../api/events.js"
import { registerForEvent, getUserRegistrations } from "../api/registrations.js" // Import getUserRegistrations
import { useAuth } from "../App.jsx"
import { useToast } from "../contexts/ToastContext.jsx"
import Loader from "../components/Loader.jsx"

function EventDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [registrationMessage, setRegistrationMessage] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false) // New state to track registration

  useEffect(() => {
    const fetchEventAndRegistrationStatus = async () => {
      try {
        setLoading(true)
        const eventData = await getEventById(id)
        setEvent(eventData)

        if (user) {
          const userRegistrations = await getUserRegistrations()
          const alreadyRegistered = userRegistrations.some((reg) => reg.eventId._id === eventData._id)
          setIsRegistered(alreadyRegistered)
        }
      } catch (err) {
        setError(err.message || "Failed to load event details.")
        console.error("Error fetching event details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchEventAndRegistrationStatus()
  }, [id, user])

  const handleRegister = async () => {
    if (!user) {
      setRegistrationMessage("Please log in to get your ticket for this event.")
      setTimeout(() => setRegistrationMessage(null), 3000)
      navigate("/login")
      return
    }

    try {
      const response = await registerForEvent(event._id)
      
      // Success message
      setRegistrationMessage("🎉 Success! Your ticket has been generated.")
      setIsRegistered(true)
      
      // Show toast notification about email
      if (response.emailSent) {
        addToast(
          `📧 Confirmation email sent! Check your inbox for event details and updates.`,
          "success"
        )
      } else {
        addToast("Registration successful! Check your dashboard for event details.", "success")
      }
      
    } catch (err) {
      setRegistrationMessage(err.message || "Failed to get ticket for the event.")
      addToast(err.message || "Registration failed. Please try again.", "error")
      console.error("Error registering:", err)
    } finally {
      setTimeout(() => setRegistrationMessage(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader size="large" text="Loading event details..." />
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (!event) {
    return <div className="text-center py-8 text-gray-600">Event not found.</div>
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-[calc(100vh-160px)] p-4 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full text-gray-800">
        <img
          src={event.imageUrl || "/placeholder.svg?height=400&width=600&query=event-banner"}
          alt={event.name}
          className="w-full h-99 object-cover rounded-lg mb-6 border border-gray-200"
        />
        <h1 className="text-4xl font-bold text-blue-700 mb-4">{event.name}</h1>
        <p className="text-gray-600 text-lg mb-2">
          <span className="font-semibold">Organizer:</span> {event.organizer}
        </p>
        <p className="text-gray-600 text-lg mb-2">
          <span className="font-semibold">Date:</span> {formattedDate}
        </p>
        <p className="text-gray-600 text-lg mb-2">
          <span className="font-semibold">Time:</span> {event.time}
        </p>
        <p className="text-gray-600 text-lg mb-4">
          <span className="font-semibold">Location:</span> {event.location}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {event.tags.map((tag, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-700 text-base leading-relaxed mb-6">{event.description}</p>

        {registrationMessage && (
          <div
            className={`px-4 py-3 rounded relative mb-4 ${
              registrationMessage.includes("Success")
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
            role="alert"
          >
            <span className="block sm:inline">{registrationMessage}</span>
          </div>
        )}

        {user && user.role === "admin" ? (
          <p className="text-blue-600 font-semibold">Admins cannot register for events.</p>
        ) : isRegistered ? (
          <p className="text-green-600 font-semibold text-lg">You have already secured your ticket for this event!</p>
        ) : (
          <button
            onClick={handleRegister}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 text-lg"
          >
            Get Your Free Ticket
          </button>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">About the Organizer</h2>
          <p className="text-gray-700">
            This event is organized by the <span className="font-semibold">{event.organizer}</span>. They are dedicated
            to providing valuable experiences and fostering community within the college. Check out more events from
            this organizer on the{" "}
            <a href="/events" className="text-blue-600 hover:underline">
              Events Page
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsPage
