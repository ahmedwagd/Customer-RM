import { Link } from 'react-router-dom'
import logo from '../assets/Ma5zan-logo.png'

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-surface">
      <h1 className="font-heading text-display-lg text-on-surface">
        <img src={logo} alt="Ma5zan" className="mx-auto h-32 w-auto" />
      </h1>
      <p className="font-body text-body-lg text-brand-neutral">
        Luminous Enterprise
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="rounded bg-primary-container px-6 py-2 text-label-lg text-on-primary-container transition-opacity hover:opacity-90"
        >
          Login
        </Link>
        <Link
          to="/dashboard"
          className="rounded border border-outline-variant bg-surface-container-lowest px-6 py-2 text-label-lg text-brand-neutral transition-colors hover:bg-surface-container-high"
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}

export default Home
