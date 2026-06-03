import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setSubmitting(true)
    try {
      await register(email, name, password)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-heading text-title-lg text-on-surface">
        Create account
      </h2>

      {error && (
        <div className="rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-label-lg text-brand-neutral">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded border border-outline-variant px-3 py-2.5 text-body-md text-on-surface outline-none transition-[border] focus:border-[#1a73e8] focus:border-2"
        />
      </div>

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
          minLength={8}
          className="w-full rounded border border-outline-variant px-3 py-2.5 text-body-md text-on-surface outline-none transition-[border] focus:border-[#1a73e8] focus:border-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-label-lg text-brand-neutral">
          Confirm password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded border border-outline-variant px-3 py-2.5 text-body-md text-on-surface outline-none transition-[border] focus:border-[#1a73e8] focus:border-2"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-primary-container px-4 py-2.5 text-label-lg text-on-primary-container transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-body-md text-brand-neutral">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-container no-underline hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
