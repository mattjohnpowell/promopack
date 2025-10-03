"use client"

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'rounded' | 'circular'
}

export function Skeleton({ className = '', variant = 'default' }: SkeletonProps) {
  const baseClasses = 'skeleton animate-pulse bg-gray-200'

  const variantClasses = {
    default: 'rounded',
    rounded: 'rounded-lg',
    circular: 'rounded-full'
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  )
}

interface SkeletonTextProps {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 1, className = '' }: SkeletonTextProps) {
  if (lines === 1) {
    return <Skeleton className={`h-4 w-full ${className}`} />
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <div className={`card-professional p-6 space-y-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

interface SkeletonListProps {
  count?: number
  className?: string
}

export function SkeletonList({ count = 3, className = '' }: SkeletonListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
          <Skeleton variant="circular" className="w-8 h-8" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  )
}

interface SkeletonDashboardProps {
  className?: string
}

export function SkeletonDashboard({ className = '' }: SkeletonDashboardProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Projects list skeleton */}
      <div className="card-professional p-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <SkeletonList count={4} />
      </div>
    </div>
  )
}