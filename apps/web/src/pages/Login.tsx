import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-gray-500">Sign in to your account</p>
      <Link
        to="/"
        className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default Login
