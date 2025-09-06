"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

interface SelectProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
  id?: string
  ref?: React.RefObject<HTMLButtonElement | null>
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

interface SelectValueProps {
  placeholder?: string
  className?: string
}

const SelectContext = React.createContext<{
  isOpen: boolean
  selectedValue: string
  onToggle: () => void
  onSelect: (value: string) => void
} | null>(null)

export function Select({ children, value, onValueChange, className }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(value || "")
  const selectRef = React.useRef<HTMLDivElement>(null)
  
  // Sync with external value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])
  
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log('Click outside detected', { 
        isOpen, 
        target: event.target,
        selectRefCurrent: selectRef.current,
        contains: selectRef.current?.contains(event.target as Node)
      })
      
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        console.log('Closing dropdown due to click outside')
        setIsOpen(false)
      } else {
        console.log('Click was inside select container, not closing')
      }
    }

    if (isOpen) {
      console.log('Adding click outside listener')
      // Use a small delay to ensure the dropdown is fully rendered
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 10)

      return () => {
        console.log('Removing click outside listener')
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  // Close dropdown on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        console.log('Closing dropdown due to escape key')
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen])
  
  const handleSelect = (newValue: string) => {
    console.log('Selecting value:', newValue)
    setInternalValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  const handleToggle = () => {
    console.log('Toggling dropdown, current state:', isOpen)
    setIsOpen(!isOpen)
  }

  const contextValue = {
    isOpen,
    selectedValue: internalValue,
    onToggle: handleToggle,
    onSelect: handleSelect,
  }

  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={selectRef} className={`relative ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className, ref, ...props }: SelectTriggerProps) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("SelectTrigger must be used within a Select component")
  }

  return (
    <button
      ref={ref}
      type="button"
      className={`flex items-center justify-between w-full px-3 py-2 text-left border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus-ring ${className}`}
      onClick={context.onToggle}
      {...props}
    >
      {children}
      <ChevronDown className={`h-4 w-4 transition-transform ${context.isOpen ? 'rotate-180' : ''}`} />
    </button>
  )
}

export function SelectContent({ children, className }: SelectContentProps) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("SelectContent must be used within a Select component")
  }

  if (!context.isOpen) {
    return null
  }

  return (
    <div className={`absolute top-full left-0 right-0 z-[100] mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-auto ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          const childProps = child.props as SelectItemProps
          return React.cloneElement(child as React.ReactElement<SelectItemProps>, {
            onClick: () => context.onSelect(childProps.value),
          })
        }
        return child
      })}
    </div>
  )
}

export function SelectItem({ children, className, onClick }: SelectItemProps & { onClick?: () => void }) {
  return (
    <button
      type="button"
      className={`w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700 text-slate-900 dark:text-slate-100 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const context = React.useContext(SelectContext)
  const displayValue = context?.selectedValue || placeholder

  return (
    <span className={`text-slate-900 dark:text-slate-100 ${className}`}>
      {displayValue}
    </span>
  )
}
