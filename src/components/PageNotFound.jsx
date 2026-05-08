import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-7xl font-bold text-cyan-400">404</h1>

      <p className="text-2xl mt-4 font-semibold">Page Not Found</p>

      <p className="text-slate-400 mt-2">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-xl transition"
      >
        Go Back Home
      </Link>
    </div>
  )
}

export default NotFound
