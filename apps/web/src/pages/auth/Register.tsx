import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'
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

      <Input label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />

      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />

      <Input label="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />

      <Button type="submit" loading={submitting} className="w-full">
        {submitting ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-center text-body-md text-on-surface-variant">
        Already have an account?{' '}
        <Link to="/login" className="text-primary no-underline hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
