import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'
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

      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      <Button type="submit" loading={submitting} className="w-full">
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="text-center text-body-md text-on-surface-variant">
        No account?{' '}
        <Link to="/register" className="text-primary no-underline hover:underline">
          Register
        </Link>
      </p>
    </form>
  )
}
