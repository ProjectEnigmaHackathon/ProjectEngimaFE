import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { X } from 'lucide-react'
import Button from './Button'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  variant?: 'default' | 'glass' | 'minimal' | 'gradient'
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  footer?: React.ReactNode
  className?: string
  overlayClassName?: string
  animation?: 'fade' | 'scale' | 'slide' | 'bounce'
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  className,
  overlayClassName,
  animation = 'scale',
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4',
  }

  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-2xl',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl',
    minimal: 'bg-white shadow-lg border-0',
    gradient: 'bg-gradient-to-br from-white via-blue-50 to-purple-50 border border-white/20 shadow-2xl',
  }

  const animationClasses = {
    fade: {
      enter: 'opacity-0',
      enterActive: 'opacity-100 transition-opacity duration-300',
      exit: 'opacity-100',
      exitActive: 'opacity-0 transition-opacity duration-300',
    },
    scale: {
      enter: 'opacity-0 scale-95',
      enterActive: 'opacity-100 scale-100 transition-all duration-300 ease-out',
      exit: 'opacity-100 scale-100',
      exitActive: 'opacity-0 scale-95 transition-all duration-200 ease-in',
    },
    slide: {
      enter: 'opacity-0 translate-y-8',
      enterActive: 'opacity-100 translate-y-0 transition-all duration-300 ease-out',
      exit: 'opacity-100 translate-y-0',
      exitActive: 'opacity-0 translate-y-8 transition-all duration-200 ease-in',
    },
    bounce: {
      enter: 'opacity-0 scale-50',
      enterActive: 'opacity-100 scale-100 transition-all duration-400 ease-out animate-bounce',
      exit: 'opacity-100 scale-100',
      exitActive: 'opacity-0 scale-95 transition-all duration-200 ease-in',
    },
  }

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose()
      }
    }

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const modal = modalRef.current
      if (!modal) return

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleFocusTrap)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleFocusTrap)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeOnEscape, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        overlayClassName
      )}
      onClick={handleBackdropClick}
    >
      {/* Enhanced Backdrop */}
      <div 
        className={clsx(
          'absolute inset-0 transition-opacity duration-300',
          variant === 'glass' 
            ? 'bg-black/20 backdrop-blur-sm' 
            : 'bg-black/50'
        )}
      />
      
      {/* Backdrop blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className={clsx(
          'relative w-full rounded-2xl overflow-hidden transform',
          sizeClasses[size],
          variantClasses[variant],
          animationClasses[animation].enterActive,
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-[1px] -z-10">
          <div className={clsx('w-full h-full rounded-2xl', variantClasses[variant])} />
        </div>

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="relative px-6 py-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              {title && (
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-auto hover:bg-gray-100 rounded-full p-2"
                  icon={<X className="h-4 w-4" />}
                />
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto chat-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200/50 bg-gray-50/50">
            {footer}
          </div>
        )}

        {/* Floating particles effect for gradient variant */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-1/3 left-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-8 right-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

// Preset modal configurations for common use cases
export const ModalPresets = {
  confirmation: (props: Pick<ModalProps, 'isOpen' | 'onClose' | 'children'> & Partial<Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>>) => (
    <Modal
      size="sm"
      variant="default"
      animation="scale"
      {...props}
    />
  ),
  form: (props: Pick<ModalProps, 'isOpen' | 'onClose' | 'children'> & Partial<Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>>) => (
    <Modal
      size="md"
      variant="gradient"
      animation="slide"
      {...props}
    />
  ),
  gallery: (props: Pick<ModalProps, 'isOpen' | 'onClose' | 'children'> & Partial<Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>>) => (
    <Modal
      size="xl"
      variant="glass"
      animation="fade"
      closeOnBackdropClick={true}
      showCloseButton={false}
      {...props}
    />
  ),
  fullscreen: (props: Pick<ModalProps, 'isOpen' | 'onClose' | 'children'> & Partial<Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>>) => (
    <Modal
      size="full"
      variant="minimal"
      animation="fade"
      {...props}
    />
  ),
}

export default Modal