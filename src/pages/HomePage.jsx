"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import EventCard from "../components/EventCard.jsx"
import { getEvents } from "../api/events.js"
import { useToast } from "../contexts/ToastContext.jsx" 

function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const navigate = useNavigate()
  const { addToast } = useToast() 

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true)
        const events = await getEvents({})
        
        // Upcoming events flow
        const now = new Date()
        const upcomingOnly = events.filter((event) => {
          try {
            // Get the date part (YYYY-MM-DD format)
            const eventDate = event.date.split('T')[0] 
            
            
            let eventTime = event.time
            
           
            const [time, period] = eventTime.split(' ')
            let [hours, minutes] = time.split(':').map(Number)
            
            if (period === 'PM' && hours !== 12) hours += 12
            if (period === 'AM' && hours === 12) hours = 0
            
           
            const eventDateTime = new Date(eventDate)
            eventDateTime.setHours(hours, minutes, 0, 0)
            
            return eventDateTime > now
          } catch (error) {
            console.error('Error parsing event datetime:', error, event)
           
            return true
          }
        })
        
        setUpcomingEvents(upcomingOnly)
      } catch (err) {
        setError("Failed to load upcoming events. Please try again later.")
        addToast("Failed to load upcoming events.", "error") 
        console.error("Error fetching upcoming events:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingEvents()
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchKeyword.trim()) {
      navigate(`/events?keyword=${encodeURIComponent(searchKeyword.trim())}`)
    } else {
      addToast("Please enter a search keyword.", "warning") 
    }
  }

  return (
    <div className="min-h-[calc(100vh-160px)]">
      <section className="relative bg-primary-light py-16 md:py-24 overflow-hidden rounded-lg shadow-lg mb-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary-dark leading-tight mb-6">
              Event planning <br /> made easier for <br /> everyone
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-lg mx-auto md:mx-0 mb-8">
              EventHub provides guidance and resources for a variety of event types including workshops, social
              gatherings, and academic conferences.
            </p>
            <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto md:mx-0">
              <input
                type="text"
                placeholder="Start Your Search"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full py-3 pl-12 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT shadow-sm text-gray-700"
              />
              <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div className="md:w-1/2 flex justify-center relative">
            <img
              src="https://www.onlinecoursereport.com/wp-content/uploads/2020/05/shutterstock_647550304-1024x737.jpg"
              alt="Event Planning"
              className="w-full max-w-xl rounded-lg shadow-xl"
            />
           
          </div>
        </div>
      </section>

      {/* Practice Interview Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="relative group">
            <a 
              href="https://hackcbs-client.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block relative overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group-hover:bg-gradient-to-r group-hover:from-purple-700 group-hover:via-purple-800 group-hover:to-indigo-700">
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/5 rounded-full blur-lg animate-bounce delay-75"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 animate-fade-in">
                      🚀 Try Practice Interview
                    </h3>
                    <p className="text-purple-100 text-sm md:text-base max-w-md">
                      Sharpen your interview skills with our AI-powered practice sessions. Get ready for your dream job!
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-white group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-lg font-semibold">Get Started</span>
                    <svg 
                      className="w-6 h-6 animate-bounce" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Our Features
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover powerful tools designed to enhance your event experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  Easy Event Discovery
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Browse and filter events by club, date, or category to find exactly what you're looking for with our intuitive search system.
                </p>
              </div>
              
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
                  Seamless Registration
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Quickly register for events and manage all your tickets from your personalized dashboard with just a few clicks.
                </p>
              </div>
              
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996-.608 2.296-.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                  Admin Event Management
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Club administrators can easily create, edit, and delete events, and manage attendee lists through our powerful admin panel.
                </p>
              </div>
              
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 rounded-lg shadow-md p-6 mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 text-center">Upcoming Events</h2>
        {loading && <p className="text-center text-gray-600">Loading events...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && upcomingEvents.length === 0 && !error && (
          <p className="text-center text-gray-600">No upcoming events found. Check back later!</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
