import { useState, useEffect } from "react"

function CustomTimePicker({ value, onChange, onClose }) {
  const [selectedHour, setSelectedHour] = useState(12)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState("AM")

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':')
      const hour24 = parseInt(hours)
      const minute = parseInt(minutes)
      
      if (hour24 === 0) {
        setSelectedHour(12)
        setSelectedPeriod("AM")
      } else if (hour24 < 12) {
        setSelectedHour(hour24)
        setSelectedPeriod("AM")
      } else if (hour24 === 12) {
        setSelectedHour(12)
        setSelectedPeriod("PM")
      } else {
        setSelectedHour(hour24 - 12)
        setSelectedPeriod("PM")
      }
      
      setSelectedMinute(minute)
    }
  }, [value])

  const handleTimeSelect = () => {
    let hour24 = selectedHour
    
    if (selectedPeriod === "AM" && selectedHour === 12) {
      hour24 = 0
    } else if (selectedPeriod === "PM" && selectedHour !== 12) {
      hour24 = selectedHour + 12
    }
    
    const formattedTime = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`
    onChange(formattedTime)
    onClose()
  }
  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  return (
    <>
      {/* Backdrop to prevent interaction with other elements */}
      <div className="fixed inset-0 z-[9998]" onClick={onClose}></div>
      
      {/* Time picker popup */}
      <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-purple-100 p-6 z-[9999] min-w-[300px]">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Select Time</h3>
        <div className="text-2xl font-bold text-purple-600">
          {selectedHour.toString().padStart(2, '0')}:{selectedMinute.toString().padStart(2, '0')} {selectedPeriod}
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {/* Hours */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Hour</label>
          <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
            {hours.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => setSelectedHour(hour)}
                className={`w-full px-3 py-2 text-center transition-all duration-200 ${
                  selectedHour === hour
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                {hour.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        {/* Minutes */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Minute</label>
          <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
            {minutes.filter(m => m % 5 === 0).map((minute) => (
              <button
                key={minute}
                type="button"
                onClick={() => setSelectedMinute(minute)}
                className={`w-full px-3 py-2 text-center transition-all duration-200 ${
                  selectedMinute === minute
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                {minute.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        {/* AM/PM */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Period</label>
          <div className="space-y-1">
            {['AM', 'PM'].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`w-full px-3 py-2 text-center rounded-lg transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold shadow-lg'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700 border border-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Time Buttons */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Select</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '9:00 AM', hour: 9, minute: 0, period: 'AM' },
            { label: '12:00 PM', hour: 12, minute: 0, period: 'PM' },
            { label: '6:00 PM', hour: 6, minute: 0, period: 'PM' },
          ].map((time) => (
            <button
              key={time.label}
              type="button"
              onClick={() => {
                setSelectedHour(time.hour)
                setSelectedMinute(time.minute)
                setSelectedPeriod(time.period)
              }}
              className="px-3 py-2 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 border border-purple-200"
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => {
            const now = new Date()
            let currentHour = now.getHours()
            const currentMinute = Math.round(now.getMinutes() / 5) * 5
            const currentPeriod = currentHour >= 12 ? 'PM' : 'AM'
            
            if (currentHour === 0) {
              currentHour = 12
            } else if (currentHour > 12) {
              currentHour = currentHour - 12
            }
            
            setSelectedHour(currentHour)
            setSelectedMinute(currentMinute)
            setSelectedPeriod(currentPeriod)
          }}
          className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
        >
          Now
        </button>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleTimeSelect}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Select
          </button>        </div>
      </div>
    </div>
    </>
  )
}

export default CustomTimePicker
