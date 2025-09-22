import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (import.meta?.env?.DEV) {
      // 仅在开发环境输出详细错误，避免污染生产环境控制台
      console.error('ErrorBoundary caught:', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-4 m-4 border rounded bg-red-50 text-red-700">
          <p>Something went wrong.</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
