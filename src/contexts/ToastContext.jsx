"use client"

import { createContext, useContext, useState, useCallback } from "react"

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const TOAST_DURATION = 3000 // 3 seconds

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, message, type }])

    setTimeout(() => {
      removeToast(id)
    }, TOAST_DURATION)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const Toast = ({ message, type, onDismiss }) => {
  let bgColor = "bg-blue-500"
  let textColor = "text-white"

  switch (type) {
    case "success":
      bgColor = "bg-green-500"
      break
    case "error":
      bgColor = "bg-red-500"
      break
    case "warning":
      bgColor = "bg-yellow-500"
      textColor = "text-gray-800" // Yellow needs darker text
      break
    case "info":
    default:
      bgColor = "bg-blue-500"
      break
  }

  return (
    <div
      className={`${bgColor} ${textColor} p-4 rounded-lg shadow-lg flex items-center justify-between max-w-xs w-full`}
    >
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 text-lg font-bold leading-none opacity-70 hover:opacity-100">
        &times;
      </button>
    </div>
  )
}
