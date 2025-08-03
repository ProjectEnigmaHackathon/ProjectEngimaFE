import React, { forwardRef } from 'react'
import { clsx } from 'clsx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  glow?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      glow = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'relative inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95 overflow-hidden'

    const variants = {
      primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus-visible:ring-blue-500 rounded-xl',
      secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-md hover:shadow-lg focus-visible:ring-gray-500 rounded-xl',
      outline: 'border-2 border-blue-500 bg-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 text-blue-600 hover:text-white hover:border-transparent transition-all duration-300 focus-visible:ring-blue-500 rounded-xl',
      ghost: 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-gray-900 focus-visible:ring-gray-500 rounded-xl',
      danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus-visible:ring-red-500 rounded-xl',
      success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus-visible:ring-green-500 rounded-xl',
      gradient: 'bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus-visible:ring-purple-500 rounded-xl',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-sm',
      lg: 'h-13 px-8 text-base',
      xl: 'h-16 px-10 text-lg',
    }

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    }

    const glowClasses = glow ? 'shadow-2xl hover:shadow-purple-500/25' : ''

    const isDisabled = disabled || loading

    return (
      <button
        className={clsx(
          baseClasses,
          variants[variant],
          sizes[size],
          glowClasses,
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-700 hover:translate-x-full opacity-0 hover:opacity-100" />
        
        {loading && (
          <div className="flex items-center">
            <svg
              className={clsx('animate-spin', iconSizes[size], children && 'mr-2')}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="ml-2">Loading...</span>
          </div>
        )}
        
        {!loading && (
          <div className="flex items-center relative z-10">
            {icon && iconPosition === 'left' && (
              <span className={clsx(iconSizes[size], children && 'mr-2')}>
                {icon}
              </span>
            )}
            
            {children}
            
            {icon && iconPosition === 'right' && (
              <span className={clsx(iconSizes[size], children && 'ml-2')}>
                {icon}
              </span>
            )}
          </div>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button