import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-[Hanken_Grotesk] text-[22px] font-[500] leading-[28px] text-[#181c20]">
        Sign in
      </h2>

      {error && (
        <div className="rounded-lg bg-[#ffdad6] px-4 py-2 text-[14px] text-[#93000a]">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block font-[Inter] text-[14px] font-[500] leading-[20px] text-[#5f6368]">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-[#dadce0] px-3 py-2.5 font-[Inter] text-[14px] leading-[20px] text-[#181c20] outline-none transition-[border] focus:border-[#1a73e8] focus:border-2"
        />
      </div>

      <div>
        <label className="mb-1 block font-[Inter] text-[14px] font-[500] leading-[20px] text-[#5f6368]">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-[#dadce0] px-3 py-2.5 font-[Inter] text-[14px] leading-[20px] text-[#181c20] outline-none transition-[border] focus:border-[#1a73e8] focus:border-2"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[#1a73e8] px-4 py-2.5 font-[Inter] text-[14px] font-[500] leading-[20px] text-[#ffffff] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center font-[Inter] text-[14px] leading-[20px] text-[#5f6368]">
        No account?{' '}
        <Link to="/register" className="text-[#1a73e8] no-underline hover:underline">
          Register
        </Link>
      </p>
    </form>
  )
}
