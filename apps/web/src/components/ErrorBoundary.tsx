import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-surface-container-lowest p-6">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-container text-3xl text-on-error-container">
              !
            </div>
            <h1 className="font-heading text-headline-lg text-on-surface">Something went wrong</h1>
            <p className="mt-2 text-body-md text-brand-neutral">
              An unexpected error occurred. Please try again.
            </p>
            {this.state.error && (
              <p className="mt-4 rounded bg-surface-container-high px-4 py-2 text-left text-label-sm text-brand-neutral">
                {this.state.error.message}
              </p>
            )}
            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-6 rounded bg-primary-container px-6 py-2.5 text-label-lg text-on-primary-container transition-opacity hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
