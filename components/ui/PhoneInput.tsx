'use client'

import { useState, useEffect } from 'react'
import { Country } from '@/lib/data/countries'
import CountrySelect from './CountrySelect'

type Props = {
  country: Country
  onCountryChange: (country: Country) => void
  phone: string
  onPhoneChange: (phone: string) => void
  required?: boolean
  label?: string
  disabled?: boolean
}

export default function PhoneInput({
  country,
  onCountryChange,
  phone,
  onPhoneChange,
  required = false,
  label = 'Phone Number',
  disabled = false,
}: Props) {
  const [digits, setDigits] = useState(phone.replace(/\D/g, ''))
  const [showLimit, setShowLimit] = useState(false)

  // Update digits when phone prop changes externally
  useEffect(() => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned !== digits) {
      setDigits(cleaned)
    }
  }, [phone])

  // Reset phone when country changes
  useEffect(() => {
    setDigits('')
    onPhoneChange('')
  }, [country.code])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // Remove non-digits
    let newDigits = input.replace(/\D/g, '')

    // Enforce max digits
    if (newDigits.length > country.maxDigits) {
      newDigits = newDigits.slice(0, country.maxDigits)
      setShowLimit(true)
      setTimeout(() => setShowLimit(false), 1500)
    }

    setDigits(newDigits)
    onPhoneChange(newDigits)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Block non-numeric keys (except backspace, delete, tab, arrows)
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight',
      'Home', 'End', 'Enter',
    ]

    if (
      !allowedKeys.includes(e.key) &&
      !/^\d$/.test(e.key) &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text')
    let newDigits = pasted.replace(/\D/g, '')

    if (newDigits.length > country.maxDigits) {
      newDigits = newDigits.slice(0, country.maxDigits)
    }

    setDigits(newDigits)
    onPhoneChange(newDigits)
  }

  // Format display: add spaces every 3-4 digits for readability
  const formatDisplay = (value: string) => {
    if (value.length <= 4) return value
    if (country.code === 'PK') {
      // Pakistan: 300 1234567 (3-7 format)
      return `${value.slice(0, 3)} ${value.slice(3)}`.trim()
    }
    if (country.code === 'US' || country.code === 'CA') {
      // US/CA: (555) 123-4567
      if (value.length <= 3) return value
      if (value.length <= 6) return `(${value.slice(0, 3)}) ${value.slice(3)}`
      return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`
    }
    // Default: spaces every 3-4 digits
    return value.replace(/(\d{3})(?=\d)/g, '$1 ')
  }

  const remainingDigits = country.maxDigits - digits.length
  const isComplete = digits.length === country.maxDigits

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-2">
        {/* Country Selector */}
        <div className="min-w-[150px]">
          <CountrySelect
            value={country}
            onChange={onCountryChange}
          />
        </div>

        {/* Phone Input */}
        <div className="flex-1 relative">
          <input
            type="tel"
            inputMode="numeric"
            value={formatDisplay(digits)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            required={required}
            disabled={disabled}
            placeholder={country.exampleFormat}
            maxLength={country.maxDigits + 5} // Allow for formatting spaces
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
              isComplete
                ? 'border-green-400 bg-green-50'
                : showLimit
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300'
            }`}
          />

          {/* Digit Counter */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            {isComplete && (
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
                ✓ Complete
              </span>
            )}
            {!isComplete && digits.length > 0 && (
              <span className="text-xs text-gray-400">
                {digits.length}/{country.maxDigits}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hint text */}
      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span className="text-gray-500">
          {country.flag} {country.name} number format: <strong>{country.exampleFormat}</strong>
        </span>
        {!isComplete && digits.length > 0 && remainingDigits > 0 && (
          <span className="text-orange-500">
            {remainingDigits} more digit{remainingDigits !== 1 ? 's' : ''} needed
          </span>
        )}
        {showLimit && (
          <span className="text-red-500 font-medium">
            Maximum {country.maxDigits} digits allowed
          </span>
        )}
        {isComplete && (
          <span className="text-green-600 font-medium">
            Ready to submit
          </span>
        )}
      </div>
    </div>
  )
}
