import { useState } from "react"

function CustomCalendar({ value, onChange, onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    const formattedDate = date.toISOString().split('T')[0]
    onChange(formattedDate)
    onClose()
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    handleDateClick(today)
  }

  const isToday = (date) => {
    const today = new Date()
    return date && 
           date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const isSelected = (date) => {
    return selectedDate && date &&
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear()
  }
  const days = getDaysInMonth(currentDate)

  return (
    <>
      {/* Backdrop to prevent interaction with other elements */}
      <div className="fixed inset-0 z-[9998]" onClick={onClose}></div>
      
      {/* Calendar popup */}
      <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-6 z-[9999] min-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-blue-50 rounded-xl transition-colors duration-200 text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-800">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>
        
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-blue-50 rounded-xl transition-colors duration-200 text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((date, index) => (
          <button
            key={index}
            type="button"
            onClick={() => date && handleDateClick(date)}
            disabled={!date}
            className={`
              h-10 w-10 rounded-xl text-sm font-medium transition-all duration-200
              ${!date 
                ? 'invisible' 
                : isSelected(date)
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-110'
                  : isToday(date)
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 font-bold'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:scale-105'
              }
            `}
          >
            {date && date.getDate()}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={goToToday}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        >
          Today
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          Close
        </button>      </div>
    </div>
    </>
  )
}

export default CustomCalendar
