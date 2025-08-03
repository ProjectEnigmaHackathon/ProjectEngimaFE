import React, { forwardRef, useState } from 'react'
import { clsx } from 'clsx'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
  variant?: 'default' | 'floating' | 'outlined'
  success?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      variant = 'default',
      success = false,
      value,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const hasValue = value !== undefined && value !== ''

    const baseInputClasses = 'w-full transition-all duration-300 focus:outline-none'
    
    const variantClasses = {
      default: clsx(
        'px-4 py-3 border rounded-xl text-sm',
        'focus:ring-2 focus:border-transparent',
        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
        error
          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500/20 focus:border-red-500'
          : success
          ? 'border-green-300 text-green-900 focus:ring-green-500/20 focus:border-green-500'
          : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500',
        'shadow-sm hover:shadow-md focus:shadow-lg transform hover:translate-y-[-1px] focus:translate-y-[-2px]',
        leftIcon && 'pl-11',
        rightIcon && 'pr-11'
      ),
      floating: clsx(
        'px-4 pt-5 pb-1 border rounded-xl text-sm peer',
        'focus:ring-2 focus:border-transparent',
        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
        error
          ? 'border-red-300 text-red-900 focus:ring-red-500/20 focus:border-red-500'
          : success
          ? 'border-green-300 text-green-900 focus:ring-green-500/20 focus:border-green-500'
          : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500',
        'shadow-sm hover:shadow-md focus:shadow-lg transform hover:translate-y-[-1px] focus:translate-y-[-2px]',
        leftIcon && 'pl-11',
        rightIcon && 'pr-11'
      ),
      outlined: clsx(
        'px-4 py-3 border-2 rounded-xl text-sm',
        'focus:ring-0 focus:outline-none',
        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
        error
          ? 'border-red-400 text-red-900 placeholder-red-300 focus:border-red-600'
          : success
          ? 'border-green-400 text-green-900 focus:border-green-600'
          : 'border-gray-300 focus:border-blue-500',
        'shadow-sm hover:shadow-md focus:shadow-lg transform hover:translate-y-[-1px] focus:translate-y-[-2px]',
        leftIcon && 'pl-11',
        rightIcon && 'pr-11'
      )
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    return (
      <div className={clsx('space-y-1', containerClassName)}>
        <div className="relative">
          {/* Floating label for floating variant */}
                     {variant === 'floating' && label && (
             <label
               htmlFor={inputId}
               className={clsx(
                 'absolute left-4 transition-all duration-300 pointer-events-none z-10',
                 'peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm',
                 'peer-focus:top-1 peer-focus:text-xs peer-focus:font-medium',
                 (isFocused || hasValue) ? 'top-1 text-xs font-medium' : 'top-2.5 text-sm',
                 error
                   ? 'text-red-600 peer-focus:text-red-600'
                   : success
                   ? 'text-green-600 peer-focus:text-green-600'
                   : 'text-gray-600 peer-focus:text-blue-600'
               )}
             >
               {label}
             </label>
           )}

          {/* Regular label for non-floating variants */}
          {variant !== 'floating' && label && (
            <label
              htmlFor={inputId}
              className={clsx(
                'block text-sm font-medium mb-2 transition-colors duration-200',
                error ? 'text-red-700' : success ? 'text-green-700' : 'text-gray-700'
              )}
            >
              {label}
            </label>
          )}
          
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-20">
              <span className={clsx(
                'transition-colors duration-200',
                error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-400'
              )}>
                {leftIcon}
              </span>
            </div>
          )}
          
          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            value={value}
            placeholder={variant === 'floating' ? ' ' : placeholder}
            className={clsx(
              baseInputClasses,
              variantClasses[variant],
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {/* Right icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-20">
              <span className={clsx(
                'transition-colors duration-200',
                error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-400'
              )}>
                {rightIcon}
              </span>
            </div>
          )}

          {/* Success indicator */}
          {success && !rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          {/* Error indicator */}
          {error && !rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          {/* Focus ring effect */}
          <div className={clsx(
            'absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300',
            isFocused ? 'opacity-100' : 'opacity-0',
            error
              ? 'bg-gradient-to-r from-red-500/10 to-pink-500/10'
              : success
              ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10'
              : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'
          )} />
        </div>
        
        {/* Helper text or error message */}
        {(error || helperText) && (
          <div className="flex items-start space-x-1">
            {error && (
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <p
              className={clsx(
                'text-xs leading-relaxed',
                error ? 'text-red-600' : 'text-gray-500'
              )}
            >
              {error || helperText}
            </p>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input