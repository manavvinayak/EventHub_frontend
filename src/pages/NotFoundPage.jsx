import { Link } from "react-router-dom"

function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-extrabold text-blue-700 mb-4">404</h1>
      <p className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</p>
      <p className="text-lg text-gray-600 mb-8">Oops! The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 text-lg"
      >
        Go to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
