import React, { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, X, Search } from 'lucide-react'
import { clsx } from 'clsx'
import { SelectOption } from '@/types'

export interface MultiSelectProps {
  options: SelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  maxDisplayed?: number
  searchable?: boolean
  variant?: 'default' | 'modern' | 'pill'
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  disabled = false,
  className,
  maxDisplayed = 3,
  searchable = true,
  variant = 'modern',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options

  const selectedOptions = options.filter(option => value.includes(option.value))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleRemoveOption = (optionValue: string, event: React.MouseEvent) => {
    event.stopPropagation()
    onChange(value.filter(v => v !== optionValue))
  }

  const handleClearAll = (event: React.MouseEvent) => {
    event.stopPropagation()
    onChange([])
  }

  const displayText = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-gray-500 font-normal">{placeholder}</span>
    }

    if (selectedOptions.length <= maxDisplayed) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map(option => (
            <span
              key={option.value}
              className={clsx(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105',
                variant === 'pill'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm'
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200'
              )}
            >
              {option.label}
              <button
                onClick={(e) => handleRemoveOption(option.value, e)}
                className={clsx(
                  'ml-1 hover:scale-110 transition-transform duration-200',
                  variant === 'pill' ? 'hover:text-blue-200' : 'hover:text-blue-900'
                )}
                type="button"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )
    }

    return (
      <div className="flex items-center justify-between w-full">
        <span className="text-sm font-medium text-gray-700">
          {selectedOptions.length} item{selectedOptions.length !== 1 ? 's' : ''} selected
        </span>
        <button
          onClick={handleClearAll}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
          type="button"
          title="Clear all selections"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  const buttonClasses = clsx(
    'w-full h-10 px-3 py-2 text-left bg-white border rounded-lg transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:border-transparent transform',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none',
    'flex items-center justify-between shadow-sm hover:shadow-md focus:shadow-lg text-sm',
    isOpen
      ? 'ring-2 ring-blue-500/20 border-blue-500 shadow-lg translate-y-[-1px]'
      : 'border-gray-200 hover:border-gray-300 hover:translate-y-[-1px]'
  )

  const dropdownClasses = clsx(
    'absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl',
    'transform transition-all duration-300 origin-top',
    'backdrop-blur-sm bg-white/95 border border-white/20',
    isOpen 
      ? 'opacity-100 scale-100 translate-y-0' 
      : 'opacity-0 scale-95 translate-y-[-10px] pointer-events-none'
  )

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={buttonClasses}
      >
        <div className="flex-1 min-w-0 pr-2">
          {displayText()}
        </div>
        <div className="flex items-center space-x-2">
          {selectedOptions.length > 0 && (
            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
              {selectedOptions.length}
            </div>
          )}
          <ChevronDown
            size={18}
            className={clsx(
              'text-gray-400 transition-transform duration-300',
              isOpen && 'transform rotate-180 text-blue-500'
            )}
          />
        </div>
      </button>

      <div className={dropdownClasses}>
        {searchable && (
          <div className="p-2 border-b border-gray-100 bg-gray-50/50">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        )}

        <div className="py-1 max-h-48 overflow-auto chat-scrollbar">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                <Search size={16} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 font-medium">No options found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
            </div>
          ) : (
            filteredOptions.map(option => {
              const isSelected = value.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggleOption(option.value)}
                  disabled={option.disabled}
                  className={clsx(
                    'w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-all duration-200',
                    'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 focus:outline-none',
                    'disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent',
                    isSelected && [
                      'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-medium',
                      'border-l-3 border-blue-500'
                    ]
                  )}
                >
                  <span className="flex-1 truncate pr-2">{option.label}</span>
                  <div className="flex items-center space-x-1">
                    {isSelected && (
                      <div className="flex items-center justify-center w-4 h-4 bg-blue-500 text-white rounded-full">
                        <Check size={10} />
                      </div>
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer with selected count */}
        {selectedOptions.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-600">
            <span>{selectedOptions.length} selected</span>
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
              type="button"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiSelect