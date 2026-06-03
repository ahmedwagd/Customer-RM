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
      <h2 className="font-heading text-title-lg text-on-surface">
        Sign in
      </h2>

      {error && (
        <div className="rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-label-lg text-brand-neutral">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded border border-outline-variant px-3 py-2.5 text-body-md text-on-surface outline-none transition-[border] focus:border-[#1a73e8] focus:border-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-label-lg text-brand-neutral">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded border border-outline-variant px-3 py-2.5 text-body-md text-on-surface outline-none transition-[border] focus:border-[#1a73e8] focus:border-2"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-primary-container px-4 py-2.5 text-label-lg text-on-primary-container transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-body-md text-brand-neutral">
        No account?{' '}
        <Link to="/register" className="text-primary-container no-underline hover:underline">
          Register
        </Link>
      </p>
    </form>
  )
}
