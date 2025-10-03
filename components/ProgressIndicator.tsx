"use client"

interface ProgressIndicatorProps {
  progress: number // 0-100
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  showPercentage?: boolean
  className?: string
}

export function ProgressIndicator({
  progress,
  label,
  description,
  size = 'md',
  variant = 'default',
  showPercentage = true,
  className = ''
}: ProgressIndicatorProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const barHeight = sizeClasses[size] ?? sizeClasses.md

  const variantClasses = {
    default: 'bg-pharma-blue',
    success: 'bg-pharma-green',
    warning: 'bg-warning',
    error: 'bg-error'
  }

  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-500">{clampedProgress}%</span>
          )}
        </div>
      )}

      <div className={`progress-bar ${barHeight} bg-gray-100 rounded overflow-hidden`}>
        <div
          className={`progress-fill ${variantClasses[variant]} h-full rounded transition-width duration-200`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const classes = `${sizeClasses[size] ?? sizeClasses.md} ${className}`

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-pharma-blue ${classes}`}></div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  title?: string
  description?: string
  progress?: number
  children?: React.ReactNode
}

export function LoadingOverlay({
  isVisible,
  title = "Processing...",
  description,
  progress,
  children
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl border border-gray-200 max-w-md w-full mx-4">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mb-4">{description}</p>
          )}
          {progress !== undefined && (
            <ProgressIndicator
              progress={progress}
              showPercentage={false}
              className="mb-4"
            />
          )}
          {children}
        </div>
      </div>
    </div>
  )
}