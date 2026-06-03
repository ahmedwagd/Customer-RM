import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">CRM</h1>
      <p className="text-gray-500">Customer Management System</p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          to="/dashboard"
          className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}

export default Home
