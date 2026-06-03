import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500">Welcome to the CRM dashboard</p>
      <Link
        to="/"
        className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default Dashboard
