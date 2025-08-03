import React from 'react'
import { clsx } from 'clsx'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'gradient' | 'dots' | 'pulse' | 'orbit'
  className?: string
  color?: string
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'gradient',
  className,
  color,
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'gradient':
        return (
          <div className={clsx('relative', sizeClasses[size])}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin">
              <div className="absolute inset-1 rounded-full bg-white"></div>
            </div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse"></div>
          </div>
        )

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={clsx(
                  'rounded-full bg-gradient-to-r from-blue-500 to-purple-600',
                  size === 'sm' ? 'w-1.5 h-1.5' : 
                  size === 'md' ? 'w-2 h-2' :
                  size === 'lg' ? 'w-3 h-3' : 'w-4 h-4',
                  'animate-pulse'
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s',
                }}
              />
            ))}
          </div>
        )

      case 'pulse':
        return (
          <div className={clsx('relative', sizeClasses[size])}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-20"></div>
            <div className="relative rounded-full bg-gradient-to-r from-blue-500 to-purple-600 h-full w-full animate-pulse"></div>
          </div>
        )

      case 'orbit':
        return (
          <div className={clsx('relative', sizeClasses[size])}>
            <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
            <div className="absolute inset-1 rounded-full border-t-2 border-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-500 rounded-full transform -translate-x-1/2 animate-pulse"></div>
          </div>
        )

      default:
        return (
          <div className={clsx('relative', sizeClasses[size])}>
            <div 
              className={clsx(
                'rounded-full border-2 border-gray-200 animate-spin',
                sizeClasses[size]
              )}
              style={{
                borderTopColor: color || '#3b82f6',
              }}
            />
          </div>
        )
    }
  }

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
      {renderSpinner()}
      {text && (
        <div className={clsx(
          'text-gray-600 font-medium text-center animate-pulse',
          textSizeClasses[size]
        )}>
          {text}
        </div>
      )}
    </div>
  )
}

// Preset loading states for common use cases
export const LoadingStates = {
  fetching: (
    <LoadingSpinner 
      variant="dots" 
      text="Loading repositories..." 
      size="md" 
    />
  ),
  processing: (
    <LoadingSpinner 
      variant="gradient" 
      text="Processing workflow..." 
      size="lg" 
    />
  ),
  saving: (
    <LoadingSpinner 
      variant="pulse" 
      text="Saving changes..." 
      size="sm" 
    />
  ),
  deploying: (
    <LoadingSpinner 
      variant="orbit" 
      text="Deploying release..." 
      size="xl" 
    />
  ),
}

export default LoadingSpinner