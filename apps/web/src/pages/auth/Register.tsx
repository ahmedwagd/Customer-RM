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
      <h2 className="font-[Hanken_Grotesk] text-[22px] font-[500] leading-[28px] text-[#181c20]">
        Create account
      </h2>

      {error && (
        <div className="rounded-lg bg-[#ffdad6] px-4 py-2 text-[14px] text-[#93000a]">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block font-[Inter] text-[14px] font-[500] leading-[20px] text-[#5f6368]">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-[#dadce0] px-3 py-2.5 font-[Inter] text-[14px] leading-[20px] text-[#181c20] outline-none transition-[border] focus:border-[#1a73e8] focus:border-2"
        />
      </div>

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
          minLength={8}
          className="w-full rounded-lg border border-[#dadce0] px-3 py-2.5 font-[Inter] text-[14px] leading-[20px] text-[#181c20] outline-none transition-[border] focus:border-[#1a73e8] focus:border-2"
        />
      </div>

      <div>
        <label className="mb-1 block font-[Inter] text-[14px] font-[500] leading-[20px] text-[#5f6368]">
          Confirm password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-lg border border-[#dadce0] px-3 py-2.5 font-[Inter] text-[14px] leading-[20px] text-[#181c20] outline-none transition-[border] focus:border-[#1a73e8] focus:border-2"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[#1a73e8] px-4 py-2.5 font-[Inter] text-[14px] font-[500] leading-[20px] text-[#ffffff] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center font-[Inter] text-[14px] leading-[20px] text-[#5f6368]">
        Already have an account?{' '}
        <Link to="/login" className="text-[#1a73e8] no-underline hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
