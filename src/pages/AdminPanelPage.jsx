"use client"

import React, { useState, useEffect } from "react"
import { createEvent, getEvents, updateEvent, deleteEvent, getEventAttendees } from "../api/events.js"
import Loader from "../components/Loader.jsx"
import CustomCalendar from "../components/CustomCalendar.jsx"
import CustomTimePicker from "../components/CustomTimePicker.jsx"

function AdminPanelPage() {
  const [events, setEvents] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    tags: "",
    imageUrl: "",
  })
  const [editingEventId, setEditingEventId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [showAttendees, setShowAttendees] = useState(null)
  const [attendees, setAttendees] = useState([])
  const [attendeesLoading, setAttendeesLoading] = useState(false)
  const [attendeesError, setAttendeesError] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const data = await getEvents()
      setEvents(data)
    } catch (err) {
      setError(err.message || "Failed to load events.")
      console.error("Error fetching events:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCalendar && !event.target.closest('.calendar-container')) {
        setShowCalendar(false)
      }
      if (showTimePicker && !event.target.closest('.time-container')) {
        setShowTimePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCalendar, showTimePicker])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    const eventData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    try {
      if (editingEventId) {
        await updateEvent(editingEventId, eventData)
        setMessage("Event updated successfully!")
      } else {
        await createEvent(eventData)
        setMessage("Event created successfully!")
      }
      setFormData({
        name: "",
        description: "",
        date: "",
        time: "",
        location: "",
        organizer: "",
        tags: "",
        imageUrl: "",
      })
      setEditingEventId(null)
      fetchEvents()
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setError(err.message || "Failed to save event.")
      console.error("Error saving event:", err)
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleEdit = (event) => {
    setEditingEventId(event._id)
    setFormData({
      name: event.name,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0],
      time: event.time,
      location: event.location,
      organizer: event.organizer,
      tags: event.tags.join(", "),
      imageUrl: event.imageUrl || "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id)
        setMessage("Event deleted successfully!")
        fetchEvents()
        setTimeout(() => setMessage(null), 3000)
      } catch (err) {
        setError(err.message || "Failed to delete event.")
        console.error("Error deleting event:", err)
        setTimeout(() => setError(null), 3000)
      }
    }
  }

  const handleShowAttendees = async (eventId) => {
    if (showAttendees === eventId) {
      setShowAttendees(null)
      setAttendees([])
      setAttendeesError(null)
      return
    }
    setShowAttendees(eventId)
    setAttendeesLoading(true)
    setAttendeesError(null)
    try {
      const data = await getEventAttendees(eventId)
      setAttendees(data)
    } catch (err) {
      setAttendeesError(err.message || "Failed to load attendees.")
      console.error("Error fetching attendees:", err)
    } finally {
      setAttendeesLoading(false)
    }
  }

  return (
    <>
      <style>{`
        /* Styles removed and using custom components now */
      `}</style>
      <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Admin Panel
        </h1>
        <p className="text-gray-600 text-lg">Manage events and monitor registrations</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-sm mb-6" role="alert">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}
      {message && (
        <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-sm mb-6" role="alert">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      <div className="mb-20">
      <section className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {editingEventId ? "Edit Event" : "Create New Event"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label htmlFor="name" className="block text-gray-700 text-lg font-semibold mb-3">
              Event Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 font-medium"
              required
              placeholder="Enter event name"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="organizer" className="block text-gray-700 text-lg font-semibold mb-3">
              Organizer (Club Name)
            </label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 font-medium"
              required
              placeholder="Enter organizer name"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-gray-700 text-lg font-semibold mb-3">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 font-medium resize-none"
              required
              placeholder="Describe your event..."
            ></textarea>
          </div>
          <div className="col-span-1">
            <label htmlFor="date" className="block text-gray-700 text-lg font-semibold mb-3">
              Date
            </label>
            <div className="relative calendar-container z-[1000]">
              <input
                type="text"
                id="date"
                name="date"
                value={formData.date ? new Date(formData.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : ''}
                onClick={() => setShowCalendar(true)}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 font-medium text-lg cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50"
                required
                placeholder="Click to select date"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              {showCalendar && (
                <CustomCalendar
                  value={formData.date}
                  onChange={(date) => {
                    setFormData(prev => ({ ...prev, date }))
                  }}
                  onClose={() => setShowCalendar(false)}
                />
              )}
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="time" className="block text-gray-700 text-lg font-semibold mb-3">
              Time
            </label>
            <div className="relative time-container z-[1000]">
              <input
                type="text"
                id="time"
                name="time"
                value={formData.time ? (() => {
                  const [hours, minutes] = formData.time.split(':')
                  const hour24 = parseInt(hours)
                  const minute = parseInt(minutes)
                  let displayHour = hour24
                  let period = 'AM'
                  
                  if (hour24 === 0) {
                    displayHour = 12
                    period = 'AM'
                  } else if (hour24 < 12) {
                    displayHour = hour24
                    period = 'AM'
                  } else if (hour24 === 12) {
                    displayHour = 12
                    period = 'PM'
                  } else {
                    displayHour = hour24 - 12
                    period = 'PM'
                  }
                  
                  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
                })() : ''}
                onClick={() => setShowTimePicker(true)}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-gray-700 font-medium text-lg cursor-pointer bg-gradient-to-r from-purple-50 to-pink-50"
                required
                placeholder="Click to select time"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              {showTimePicker && (
                <CustomTimePicker
                  value={formData.time}
                  onChange={(time) => {
                    setFormData(prev => ({ ...prev, time }))
                  }}
                  onClose={() => setShowTimePicker(false)}
                />
              )}
            </div>
          </div>
          <div className="col-span-1">
            <label htmlFor="location" className="block text-gray-700 text-lg font-semibold mb-3">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 font-medium"
              required
              placeholder="Enter venue location"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="tags" className="block text-gray-700 text-lg font-semibold mb-3">
              Categories / Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="tech, workshop, social"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 font-medium"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="imageUrl" className="block text-gray-700 text-lg font-semibold mb-3">
              Image URL (Optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/event-banner.jpg"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 font-medium"
            />
            {formData.imageUrl && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <img
                  src={formData.imageUrl || "/placeholder.svg"}
                  alt="Event Preview"
                  className="max-h-32 object-contain border border-gray-200 rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
          <div className="md:col-span-2 flex justify-end space-x-4 mt-8">
            <button
              type="submit"
              className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center">
                {editingEventId ? (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Event
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Event
                  </>
                )}
              </span>
            </button>
            {editingEventId && (
              <button
                type="button"
                onClick={() => {
                  setEditingEventId(null)
                  setFormData({
                    name: "",
                    description: "",
                    date: "",
                    time: "",
                    location: "",
                    organizer: "",
                    tags: "",
                    imageUrl: "",
                  })
                }}
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel Edit
                </span>
              </button>
            )}
          </div>
        </form>
      </section>
      </div>
    

      <div className="mt-16"> 
        <section className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          All Events ({events.length})
        </h2>
        {loading && (
          <div className="flex justify-center py-8">
            <Loader size="medium" text="Loading events..." />
          </div>
        )}
        {!loading && events.length === 0 && !error && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-lg font-medium">No events created yet</p>
            <p className="text-gray-500 text-sm">Create your first event using the form above</p>
          </div>
        )}
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-left text-gray-700 font-semibold text-lg">
                <th className="py-4 px-6 border-b border-gray-200 ">Event Name</th>
                <th className="py-4 px-6 border-b border-gray-200">Date & Time</th>
                <th className="py-4 px-6 border-b border-gray-200">Organizer</th>
                <th className="py-4 px-6 border-b border-gray-200">Location</th>
                <th className="py-4 px-6 border-b border-gray-200">Actions</th>
                <th className="py-4 px-6 border-b border-gray-200">Attendees</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {events.map((event, index) => (
                <React.Fragment key={event._id}>
                  <tr className={`border-b border-gray-100 hover:bg-blue-50/50 text-lg transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="py-4 px-6 font-semibold text-gray-800">{event.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{event.organizer}</td>
                    <td className="py-4 px-6 text-gray-600">{event.location}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="group relative px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="group relative px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleShowAttendees(event._id)}
                        className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center min-w-[140px] justify-center"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            {event.attendees.length > 0 && (
                              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">{event.attendees.length}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-bold">
                              {showAttendees === event._id ? "Hide" : "View"}
                            </span>
                            <span className="text-xs opacity-90">
                              {event.attendees.length} {event.attendees.length === 1 ? 'person' : 'people'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Animated background effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        
                        {/* Ripple effect */}
                        <div className="absolute inset-0 rounded-xl overflow-hidden">
                          <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
                        </div>
                      </button>
                    </td>
                  </tr>
                  {showAttendees === event._id && (
                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <td colSpan="6" className="py-6 px-6">
                        <div className="bg-white p-6 border-2 border-blue-100 rounded-xl shadow-sm">
                          <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Attendees for "{event.name}"
                          </h4>
                          {attendeesLoading && (
                            <div className="flex justify-center py-8">
                              <Loader size="small" text="Loading attendees..." />
                            </div>
                          )}
                          {attendeesError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-red-700 font-medium">{attendeesError}</span>
                            </div>
                          )}
                          {!attendeesLoading && attendees.length === 0 && !attendeesError && (
                            <div className="text-center py-8">
                              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <p className="text-gray-600 font-medium text-lg">No attendees registered yet</p>
                              <p className="text-gray-500 text-lg">Users will appear here once they register</p>
                            </div>
                          )}
                          {!attendeesLoading && attendees.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {attendees.map((attendee) => (
                                <div key={attendee._id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                      {attendee.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-800">{attendee.username}</p>
                                      <p className="text-gray-600 text-sm">{attendee.email}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </div>
     
    </div>
    </>
  )
}

export default AdminPanelPage
