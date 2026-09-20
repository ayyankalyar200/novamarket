'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Search, ChevronDown, Check } from 'lucide-react'
import { ALL_COUNTRIES, POPULAR_COUNTRIES, Country } from '@/lib/data/countries'

type Props = {
  value: Country
  onChange: (country: Country) => void
  placeholder?: string
  showSearch?: boolean
}

export default function CountrySelect({
  value,
  onChange,
  placeholder = 'Select country',
  showSearch = true,
}: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Focus search when opened
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [open])

  // Filter countries by search
  const filteredCountries = useMemo(() => {
    if (!search.trim()) return ALL_COUNTRIES
    const query = search.toLowerCase().trim()
    return ALL_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.dialCode.includes(query) ||
        c.code.toLowerCase().includes(query)
    )
  }, [search])

  const handleSelect = (country: Country) => {
    onChange(country)
    setOpen(false)
    setSearch('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-lg hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
      >
        <span className="text-2xl">{value.flag}</span>
        <span className="font-medium text-gray-900">{value.dialCode}</span>
        <ChevronDown
          className={`w-4 h-4 ml-auto text-gray-400 transition ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-xl z-50 max-h-80 flex flex-col">
          {/* Search */}
          {showSearch && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {/* Popular countries */}
            {!search && (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                  Popular
                </div>
                {POPULAR_COUNTRIES.map((country) => (
                  <CountryItem
                    key={`pop-${country.code}`}
                    country={country}
                    selected={country.code === value.code}
                    onSelect={handleSelect}
                  />
                ))}
                <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                  All Countries ({ALL_COUNTRIES.length})
                </div>
              </>
            )}

            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <CountryItem
                  key={country.code}
                  country={country}
                  selected={country.code === value.code}
                  onSelect={handleSelect}
                  hideIfPopular={!search}
                />
              ))
            ) : (
              <div className="px-3 py-8 text-center text-sm text-gray-500">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function CountryItem({
  country,
  selected,
  onSelect,
  hideIfPopular = false,
}: {
  country: Country
  selected: boolean
  onSelect: (c: Country) => void
  hideIfPopular?: boolean
}) {
  if (hideIfPopular && POPULAR_COUNTRIES.some((c) => c.code === country.code)) {
    return null
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(country)}
      className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-50 text-left transition ${
        selected ? 'bg-purple-50' : ''
      }`}
    >
      <span className="text-xl">{country.flag}</span>
      <span className="flex-1 text-sm text-gray-900 truncate">{country.name}</span>
      <span className="text-sm text-gray-500 font-mono">{country.dialCode}</span>
      {selected && <Check className="w-4 h-4 text-purple-600" />}
    </button>
  )
}
