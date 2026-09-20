import { countries, getEmojiFlag, TCountryCode } from 'countries-list'

export type Country = {
  code: string
  name: string
  dialCode: string
  flag: string
  maxDigits: number
  exampleFormat: string
}

// Country-specific phone digit lengths and examples
// Format: { maxDigits, example }
const PHONE_DATA: Record<string, { maxDigits: number; example: string }> = {
  PK: { maxDigits: 10, example: '3001234567' },
  US: { maxDigits: 10, example: '5551234567' },
  GB: { maxDigits: 10, example: '7911123456' },
  IN: { maxDigits: 10, example: '9876543210' },
  AE: { maxDigits: 9, example: '501234567' },
  SA: { maxDigits: 9, example: '501234567' },
  CA: { maxDigits: 10, example: '5551234567' },
  AU: { maxDigits: 9, example: '412345678' },
  DE: { maxDigits: 11, example: '15112345678' },
  FR: { maxDigits: 9, example: '612345678' },
  CN: { maxDigits: 11, example: '13812345678' },
  JP: { maxDigits: 10, example: '9012345678' },
  BD: { maxDigits: 10, example: '1712345678' },
  TR: { maxDigits: 10, example: '5012345678' },
  MY: { maxDigits: 10, example: '123456789' },
  SG: { maxDigits: 8, example: '81234567' },
  ID: { maxDigits: 11, example: '81234567890' },
  PH: { maxDigits: 10, example: '9171234567' },
  TH: { maxDigits: 9, example: '812345678' },
  VN: { maxDigits: 9, example: '912345678' },
  KR: { maxDigits: 10, example: '1012345678' },
  IT: { maxDigits: 10, example: '3123456789' },
  ES: { maxDigits: 9, example: '612345678' },
  NL: { maxDigits: 9, example: '612345678' },
  BE: { maxDigits: 9, example: '470123456' },
  CH: { maxDigits: 9, example: '791234567' },
  AT: { maxDigits: 10, example: '6641234567' },
  SE: { maxDigits: 9, example: '701234567' },
  NO: { maxDigits: 8, example: '91234567' },
  DK: { maxDigits: 8, example: '20123456' },
  FI: { maxDigits: 10, example: '4012345678' },
  PL: { maxDigits: 9, example: '512345678' },
  RU: { maxDigits: 10, example: '9123456789' },
  UA: { maxDigits: 9, example: '501234567' },
  EG: { maxDigits: 10, example: '1001234567' },
  ZA: { maxDigits: 9, example: '821234567' },
  NG: { maxDigits: 10, example: '8031234567' },
  KE: { maxDigits: 9, example: '712345678' },
  GH: { maxDigits: 9, example: '244123456' },
  BR: { maxDigits: 11, example: '11912345678' },
  MX: { maxDigits: 10, example: '5512345678' },
  AR: { maxDigits: 10, example: '91123456789' },
  CL: { maxDigits: 9, example: '912345678' },
  CO: { maxDigits: 10, example: '3012345678' },
  PE: { maxDigits: 9, example: '912345678' },
  IL: { maxDigits: 9, example: '501234567' },
  IR: { maxDigits: 10, example: '9123456789' },
  IQ: { maxDigits: 10, example: '7901234567' },
  AF: { maxDigits: 9, example: '701234567' },
  LK: { maxDigits: 9, example: '712345678' },
  NP: { maxDigits: 10, example: '9812345678' },
  MM: { maxDigits: 10, example: '9123456789' },
  KH: { maxDigits: 9, example: '12345678' },
  NZ: { maxDigits: 9, example: '211234567' },
  IE: { maxDigits: 9, example: '851234567' },
  PT: { maxDigits: 9, example: '912345678' },
  GR: { maxDigits: 10, example: '6912345678' },
  CZ: { maxDigits: 9, example: '601123456' },
  HU: { maxDigits: 9, example: '201234567' },
  RO: { maxDigits: 9, example: '712345678' },
  BG: { maxDigits: 9, example: '881234567' },
  HR: { maxDigits: 9, example: '911234567' },
  RS: { maxDigits: 9, example: '601234567' },
  SK: { maxDigits: 9, example: '901234567' },
  SI: { maxDigits: 9, example: '31123456' },
  LT: { maxDigits: 8, example: '61234567' },
  LV: { maxDigits: 8, example: '21234567' },
  EE: { maxDigits: 8, example: '51234567' },
  BY: { maxDigits: 9, example: '291234567' },
  KZ: { maxDigits: 10, example: '7012345678' },
  UZ: { maxDigits: 9, example: '901234567' },
  AZ: { maxDigits: 9, example: '501234567' },
  GE: { maxDigits: 9, example: '555123456' },
  AM: { maxDigits: 8, example: '77123456' },
}

// Default fallback for countries not in the list
const DEFAULT_PHONE_DATA = { maxDigits: 15, example: '1234567890' }

// Generate complete country list
export const ALL_COUNTRIES: Country[] = Object.entries(countries)
  .map(([code, data]) => {
    const phoneInfo = PHONE_DATA[code] || DEFAULT_PHONE_DATA
    return {
      code,
      name: data.name,
      dialCode: `+${data.phone}`,
      flag: getEmojiFlag(code as TCountryCode),
      maxDigits: phoneInfo.maxDigits,
      exampleFormat: phoneInfo.example,
    }
  })
  .filter((c) => c.dialCode !== '+')
  .sort((a, b) => a.name.localeCompare(b.name))

export function getCountryByCode(code: string): Country | undefined {
  return ALL_COUNTRIES.find((c) => c.code === code)
}

export function getDefaultCountry(): Country {
  return (
    ALL_COUNTRIES.find((c) => c.code === 'PK') ||
    ALL_COUNTRIES.find((c) => c.code === 'US') ||
    ALL_COUNTRIES[0]
  )
}

export const POPULAR_COUNTRIES: Country[] = [
  'PK', 'US', 'GB', 'IN', 'AE', 'SA', 'CA', 'AU', 'DE', 'FR', 'CN', 'JP',
]
  .map((code) => ALL_COUNTRIES.find((c) => c.code === code))
  .filter(Boolean) as Country[]

// Get flag emoji from country code
export function getFlag(code: string): string {
  try {
    return getEmojiFlag(code as TCountryCode)
  } catch {
    return '🌍'
  }
}
