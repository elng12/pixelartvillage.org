import logger from '@/utils/logger'

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
      logger.error('ErrorBoundary caught:', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      const errMsg = this.state.error && (this.state.error.message || String(this.state.error))
      let suspect = false
      try {
        if (typeof window !== 'undefined') {
          if (window.BacklinkPilot) suspect = true
          const scripts = Array.from(document.scripts || [])
          if (!suspect) suspect = scripts.some((s) => /plasmo|autofill|BacklinkPilot|parcel-runtime/i.test(s.getAttribute('src') || ''))
        }
      } catch { /* ignore */ }
      const isUseContextCrash = /useContext|Cannot read properties of null/i.test(errMsg || '')
      const buildId = (typeof __BUILD_ID__ !== 'undefined') ? __BUILD_ID__ : ''
      // 暂时禁用自动刷新以避免文件上传时的页面刷新问题
      const hardRefresh = () => {
        logger.debug('ErrorBoundary: 自动刷新已禁用，避免文件上传问题')
        // 在开发环境中不自动刷新，只记录错误
        if (!import.meta?.env?.DEV) {
          try {
            const u = new URL(window.location.href)
            u.searchParams.set('_r', String(Date.now()))
            window.location.replace(u.toString())
          } catch { window.location.reload() }
        }
      }
      return (
        <div role="alert" className="p-4 m-4 border rounded bg-red-50 text-red-700 text-sm">
          <p className="font-semibold">Something went wrong.</p>
          {buildId ? <p className="mt-1 opacity-70">Build: {buildId}</p> : null}
          {isUseContextCrash || suspect ? (
            <div className="mt-2 text-red-800">
              <p>
                A browser extension may have injected a dev runtime (e.g., Plasmo/BacklinkPilot) and broke the page.
                Please disable such extensions on this site and hard‑refresh (Ctrl/Cmd+Shift+R).
              </p>
              {errMsg ? <pre className="mt-2 whitespace-pre-wrap text-xs opacity-80">{String(errMsg)}</pre> : null}
              <button type="button" onClick={hardRefresh} className="mt-3 inline-flex items-center rounded border border-red-300 px-2 py-1 bg-white hover:bg-red-50">
                Hard refresh
              </button>
            </div>
          ) : null}
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
