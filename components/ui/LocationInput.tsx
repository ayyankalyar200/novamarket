'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { MapPin, Search, Check, AlertCircle, Loader2 } from 'lucide-react'
import { searchCities, CitySuggestion } from '@/lib/data/cities'

type Props = {
  value: string
  onChange: (value: string) => void
  onValidSelection: (selected: CitySuggestion) => void
  required?: boolean
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
}

export default function LocationInput({
  value,
  onChange,
  onValidSelection,
  required = false,
  label = 'Location',
  placeholder = 'Start typing your city...',
  disabled = false,
  error: externalError,
}: Props) {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isValidSelection, setIsValidSelection] = useState(false)
  const [searching, setSearching] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSelectedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    // If empty, reset
    if (!value || value.trim().length < 2) {
      setSuggestions([])
      setSearching(false)
      setIsValidSelection(false)
      return
    }

    // If user has already selected, don't re-search
    if (isValidSelection) return

    setSearching(true)

    debounceRef.current = setTimeout(() => {
      try {
        const results = searchCities(value, 8)
        setSuggestions(results)
        setOpen(true)
        setSearching(false)
      } catch (err) {
        console.error('Location search error:', err)
        setSearching(false)
      }
    }, 250)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value, isValidSelection])

  const handleSelect = (suggestion: CitySuggestion) => {
    onChange(suggestion.fullName)
    onValidSelection(suggestion)
    setIsValidSelection(true)
    setOpen(false)
    setSuggestions([])
    setSelectedIndex(-1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    setIsValidSelection(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Enter') e.preventDefault()
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => (i < suggestions.length - 1 ? i + 1 : i))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => (i > 0 ? i - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setSelectedIndex(-1)
    }
  }

  const hasError = externalError || (value.trim().length >= 2 && !isValidSelection && !searching)

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 && !isValidSelection) setOpen(true)
          }}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
            isValidSelection
              ? 'border-green-400 bg-green-50 focus:ring-green-500'
              : hasError
              ? 'border-red-400 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-500'
          }`}
        />

        {/* Right icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {searching && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
          {!searching && isValidSelection && (
            <Check className="w-5 h-5 text-green-600" />
          )}
          {!searching && !isValidSelection && value.trim().length >= 2 && (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
        </div>

        {/* Dropdown */}
        {open && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 sticky top-0 border-b">
              <Search className="w-3 h-3 inline mr-1" />
              {suggestions.length} matches — click to select
            </div>

            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.city}-${suggestion.country}-${index}`}
                type="button"
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition ${
                  index === selectedIndex ? 'bg-purple-50' : 'hover:bg-gray-50'
                }`}
              >
                <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.city}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {suggestion.state ? `${suggestion.state}, ` : ''}{suggestion.country}
                  </p>
                </div>
                {index === selectedIndex && (
                  <Check className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* No results message */}
        {open && suggestions.length === 0 && !searching && value.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-xl z-50">
            <div className="px-3 py-6 text-center">
              <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                No locations found for "<strong>{value}</strong>"
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different spelling or city name
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Helper text */}
      <div className="mt-1.5 text-xs">
        {isValidSelection ? (
          <span className="text-green-600 font-medium flex items-center gap-1">
            <Check className="w-3 h-3" />
            Location verified
          </span>
        ) : hasError ? (
          <span className="text-red-500 font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Please select a location from the dropdown
          </span>
        ) : (
          <span className="text-gray-500">
            💡 Type at least 2 letters, then select from dropdown
          </span>
        )}
      </div>
    </div>
  )
}

