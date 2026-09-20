// NovaMarket Local Cities Database
// Top 250+ cities worldwide (no external dependencies)

export type CitySuggestion = {
  city: string
  country: string
  state?: string
  fullName: string
}

type RawCity = {
  c: string
  s: string
  n: string
}

const CITIES_DB: RawCity[] = [
  // PAKISTAN
  { c: 'Karachi', s: 'Sindh', n: 'Pakistan' },
  { c: 'Lahore', s: 'Punjab', n: 'Pakistan' },
  { c: 'Islamabad', s: 'Islamabad', n: 'Pakistan' },
  { c: 'Rawalpindi', s: 'Punjab', n: 'Pakistan' },
  { c: 'Faisalabad', s: 'Punjab', n: 'Pakistan' },
  { c: 'Multan', s: 'Punjab', n: 'Pakistan' },
  { c: 'Peshawar', s: 'KPK', n: 'Pakistan' },
  { c: 'Quetta', s: 'Balochistan', n: 'Pakistan' },
  { c: 'Hyderabad', s: 'Sindh', n: 'Pakistan' },
  { c: 'Gujranwala', s: 'Punjab', n: 'Pakistan' },
  { c: 'Sialkot', s: 'Punjab', n: 'Pakistan' },
  { c: 'Gujrat', s: 'Punjab', n: 'Pakistan' },
  { c: 'Sargodha', s: 'Punjab', n: 'Pakistan' },
  { c: 'Bahawalpur', s: 'Punjab', n: 'Pakistan' },
  { c: 'Sukkur', s: 'Sindh', n: 'Pakistan' },
  { c: 'Larkana', s: 'Sindh', n: 'Pakistan' },
  { c: 'Sahiwal', s: 'Punjab', n: 'Pakistan' },
  { c: 'Sheikhupura', s: 'Punjab', n: 'Pakistan' },
  { c: 'Mardan', s: 'KPK', n: 'Pakistan' },
  { c: 'Abbottabad', s: 'KPK', n: 'Pakistan' },
  { c: 'Mirpur Khas', s: 'Sindh', n: 'Pakistan' },
  { c: 'Nawabshah', s: 'Sindh', n: 'Pakistan' },
  { c: 'Kohat', s: 'KPK', n: 'Pakistan' },
  { c: 'Dera Ghazi Khan', s: 'Punjab', n: 'Pakistan' },
  { c: 'Kasur', s: 'Punjab', n: 'Pakistan' },
  { c: 'Okara', s: 'Punjab', n: 'Pakistan' },
  { c: 'Wah Cantt', s: 'Punjab', n: 'Pakistan' },
  { c: 'Muzaffarabad', s: 'AJK', n: 'Pakistan' },
  { c: 'Gilgit', s: 'Gilgit-Baltistan', n: 'Pakistan' },

  // INDIA
  { c: 'Mumbai', s: 'Maharashtra', n: 'India' },
  { c: 'Delhi', s: 'Delhi', n: 'India' },
  { c: 'Bangalore', s: 'Karnataka', n: 'India' },
  { c: 'Hyderabad', s: 'Telangana', n: 'India' },
  { c: 'Ahmedabad', s: 'Gujarat', n: 'India' },
  { c: 'Chennai', s: 'Tamil Nadu', n: 'India' },
  { c: 'Kolkata', s: 'West Bengal', n: 'India' },
  { c: 'Pune', s: 'Maharashtra', n: 'India' },
  { c: 'Jaipur', s: 'Rajasthan', n: 'India' },
  { c: 'Surat', s: 'Gujarat', n: 'India' },
  { c: 'Lucknow', s: 'Uttar Pradesh', n: 'India' },
  { c: 'Kanpur', s: 'Uttar Pradesh', n: 'India' },
  { c: 'Nagpur', s: 'Maharashtra', n: 'India' },
  { c: 'Indore', s: 'Madhya Pradesh', n: 'India' },
  { c: 'Bhopal', s: 'Madhya Pradesh', n: 'India' },
  { c: 'Patna', s: 'Bihar', n: 'India' },
  { c: 'Ludhiana', s: 'Punjab', n: 'India' },
  { c: 'Agra', s: 'Uttar Pradesh', n: 'India' },
  { c: 'Nashik', s: 'Maharashtra', n: 'India' },
  { c: 'Srinagar', s: 'Jammu and Kashmir', n: 'India' },

  // USA
  { c: 'New York', s: 'New York', n: 'United States' },
  { c: 'Los Angeles', s: 'California', n: 'United States' },
  { c: 'Chicago', s: 'Illinois', n: 'United States' },
  { c: 'Houston', s: 'Texas', n: 'United States' },
  { c: 'Phoenix', s: 'Arizona', n: 'United States' },
  { c: 'Philadelphia', s: 'Pennsylvania', n: 'United States' },
  { c: 'San Antonio', s: 'Texas', n: 'United States' },
  { c: 'San Diego', s: 'California', n: 'United States' },
  { c: 'Dallas', s: 'Texas', n: 'United States' },
  { c: 'San Jose', s: 'California', n: 'United States' },
  { c: 'Austin', s: 'Texas', n: 'United States' },
  { c: 'Jacksonville', s: 'Florida', n: 'United States' },
  { c: 'San Francisco', s: 'California', n: 'United States' },
  { c: 'Columbus', s: 'Ohio', n: 'United States' },
  { c: 'Indianapolis', s: 'Indiana', n: 'United States' },
  { c: 'Charlotte', s: 'North Carolina', n: 'United States' },
  { c: 'Seattle', s: 'Washington', n: 'United States' },
  { c: 'Denver', s: 'Colorado', n: 'United States' },
  { c: 'Boston', s: 'Massachusetts', n: 'United States' },
  { c: 'Nashville', s: 'Tennessee', n: 'United States' },
  { c: 'Detroit', s: 'Michigan', n: 'United States' },
  { c: 'Portland', s: 'Oregon', n: 'United States' },
  { c: 'Las Vegas', s: 'Nevada', n: 'United States' },
  { c: 'Miami', s: 'Florida', n: 'United States' },
  { c: 'Atlanta', s: 'Georgia', n: 'United States' },
  { c: 'Washington', s: 'District of Columbia', n: 'United States' },

  // UK
  { c: 'London', s: 'England', n: 'United Kingdom' },
  { c: 'Birmingham', s: 'England', n: 'United Kingdom' },
  { c: 'Manchester', s: 'England', n: 'United Kingdom' },
  { c: 'Glasgow', s: 'Scotland', n: 'United Kingdom' },
  { c: 'Liverpool', s: 'England', n: 'United Kingdom' },
  { c: 'Edinburgh', s: 'Scotland', n: 'United Kingdom' },
  { c: 'Leeds', s: 'England', n: 'United Kingdom' },
  { c: 'Bristol', s: 'England', n: 'United Kingdom' },
  { c: 'Cardiff', s: 'Wales', n: 'United Kingdom' },
  { c: 'Belfast', s: 'Northern Ireland', n: 'United Kingdom' },

  // UAE
  { c: 'Dubai', s: 'Dubai', n: 'United Arab Emirates' },
  { c: 'Abu Dhabi', s: 'Abu Dhabi', n: 'United Arab Emirates' },
  { c: 'Sharjah', s: 'Sharjah', n: 'United Arab Emirates' },
  { c: 'Al Ain', s: 'Abu Dhabi', n: 'United Arab Emirates' },
  { c: 'Ajman', s: 'Ajman', n: 'United Arab Emirates' },

  // SAUDI ARABIA
  { c: 'Riyadh', s: 'Riyadh', n: 'Saudi Arabia' },
  { c: 'Jeddah', s: 'Makkah', n: 'Saudi Arabia' },
  { c: 'Mecca', s: 'Makkah', n: 'Saudi Arabia' },
  { c: 'Medina', s: 'Al Madinah', n: 'Saudi Arabia' },
  { c: 'Dammam', s: 'Eastern Province', n: 'Saudi Arabia' },

  // CANADA
  { c: 'Toronto', s: 'Ontario', n: 'Canada' },
  { c: 'Vancouver', s: 'British Columbia', n: 'Canada' },
  { c: 'Montreal', s: 'Quebec', n: 'Canada' },
  { c: 'Calgary', s: 'Alberta', n: 'Canada' },
  { c: 'Ottawa', s: 'Ontario', n: 'Canada' },
  { c: 'Edmonton', s: 'Alberta', n: 'Canada' },

  // AUSTRALIA
  { c: 'Sydney', s: 'New South Wales', n: 'Australia' },
  { c: 'Melbourne', s: 'Victoria', n: 'Australia' },
  { c: 'Brisbane', s: 'Queensland', n: 'Australia' },
  { c: 'Perth', s: 'Western Australia', n: 'Australia' },
  { c: 'Adelaide', s: 'South Australia', n: 'Australia' },
  { c: 'Canberra', s: 'Australian Capital Territory', n: 'Australia' },

  // CHINA
  { c: 'Beijing', s: 'Beijing', n: 'China' },
  { c: 'Shanghai', s: 'Shanghai', n: 'China' },
  { c: 'Guangzhou', s: 'Guangdong', n: 'China' },
  { c: 'Shenzhen', s: 'Guangdong', n: 'China' },
  { c: 'Chengdu', s: 'Sichuan', n: 'China' },
  { c: 'Hangzhou', s: 'Zhejiang', n: 'China' },
  { c: 'Wuhan', s: 'Hubei', n: 'China' },
  { c: 'Hong Kong', s: 'Hong Kong', n: 'Hong Kong' },

  // JAPAN
  { c: 'Tokyo', s: 'Tokyo', n: 'Japan' },
  { c: 'Osaka', s: 'Osaka', n: 'Japan' },
  { c: 'Yokohama', s: 'Kanagawa', n: 'Japan' },
  { c: 'Nagoya', s: 'Aichi', n: 'Japan' },
  { c: 'Sapporo', s: 'Hokkaido', n: 'Japan' },
  { c: 'Kyoto', s: 'Kyoto', n: 'Japan' },

  // GERMANY
  { c: 'Berlin', s: 'Berlin', n: 'Germany' },
  { c: 'Munich', s: 'Bavaria', n: 'Germany' },
  { c: 'Hamburg', s: 'Hamburg', n: 'Germany' },
  { c: 'Frankfurt', s: 'Hesse', n: 'Germany' },
  { c: 'Cologne', s: 'North Rhine-Westphalia', n: 'Germany' },
  { c: 'Stuttgart', s: 'Baden-Wurttemberg', n: 'Germany' },
  { c: 'Dusseldorf', s: 'North Rhine-Westphalia', n: 'Germany' },

  // FRANCE
  { c: 'Paris', s: 'Ile-de-France', n: 'France' },
  { c: 'Marseille', s: 'Provence', n: 'France' },
  { c: 'Lyon', s: 'Auvergne', n: 'France' },
  { c: 'Toulouse', s: 'Occitanie', n: 'France' },
  { c: 'Nice', s: 'Provence', n: 'France' },

  // ITALY
  { c: 'Rome', s: 'Lazio', n: 'Italy' },
  { c: 'Milan', s: 'Lombardy', n: 'Italy' },
  { c: 'Naples', s: 'Campania', n: 'Italy' },
  { c: 'Turin', s: 'Piedmont', n: 'Italy' },
  { c: 'Florence', s: 'Tuscany', n: 'Italy' },
  { c: 'Venice', s: 'Veneto', n: 'Italy' },

  // SPAIN
  { c: 'Madrid', s: 'Madrid', n: 'Spain' },
  { c: 'Barcelona', s: 'Catalonia', n: 'Spain' },
  { c: 'Valencia', s: 'Valencia', n: 'Spain' },
  { c: 'Seville', s: 'Andalusia', n: 'Spain' },

  // TURKEY
  { c: 'Istanbul', s: 'Istanbul', n: 'Turkey' },
  { c: 'Ankara', s: 'Ankara', n: 'Turkey' },
  { c: 'Izmir', s: 'Izmir', n: 'Turkey' },
  { c: 'Bursa', s: 'Bursa', n: 'Turkey' },
  { c: 'Antalya', s: 'Antalya', n: 'Turkey' },

  // BANGLADESH
  { c: 'Dhaka', s: 'Dhaka', n: 'Bangladesh' },
  { c: 'Chittagong', s: 'Chittagong', n: 'Bangladesh' },
  { c: 'Khulna', s: 'Khulna', n: 'Bangladesh' },
  { c: 'Rajshahi', s: 'Rajshahi', n: 'Bangladesh' },
  { c: 'Sylhet', s: 'Sylhet', n: 'Bangladesh' },

  // INDONESIA
  { c: 'Jakarta', s: 'Jakarta', n: 'Indonesia' },
  { c: 'Surabaya', s: 'East Java', n: 'Indonesia' },
  { c: 'Bandung', s: 'West Java', n: 'Indonesia' },
  { c: 'Medan', s: 'North Sumatra', n: 'Indonesia' },
  { c: 'Bali', s: 'Bali', n: 'Indonesia' },

  // MALAYSIA
  { c: 'Kuala Lumpur', s: 'Kuala Lumpur', n: 'Malaysia' },
  { c: 'George Town', s: 'Penang', n: 'Malaysia' },
  { c: 'Johor Bahru', s: 'Johor', n: 'Malaysia' },

  // SINGAPORE
  { c: 'Singapore', s: 'Singapore', n: 'Singapore' },

  // RUSSIA
  { c: 'Moscow', s: 'Moscow', n: 'Russia' },
  { c: 'Saint Petersburg', s: 'Saint Petersburg', n: 'Russia' },

  // BRAZIL
  { c: 'Sao Paulo', s: 'Sao Paulo', n: 'Brazil' },
  { c: 'Rio de Janeiro', s: 'Rio de Janeiro', n: 'Brazil' },
  { c: 'Brasilia', s: 'Federal District', n: 'Brazil' },

  // MEXICO
  { c: 'Mexico City', s: 'Mexico City', n: 'Mexico' },
  { c: 'Guadalajara', s: 'Jalisco', n: 'Mexico' },
  { c: 'Monterrey', s: 'Nuevo Leon', n: 'Mexico' },
  { c: 'Cancun', s: 'Quintana Roo', n: 'Mexico' },

  // EGYPT
  { c: 'Cairo', s: 'Cairo', n: 'Egypt' },
  { c: 'Alexandria', s: 'Alexandria', n: 'Egypt' },

  // NIGERIA
  { c: 'Lagos', s: 'Lagos', n: 'Nigeria' },
  { c: 'Abuja', s: 'FCT', n: 'Nigeria' },

  // SOUTH AFRICA
  { c: 'Johannesburg', s: 'Gauteng', n: 'South Africa' },
  { c: 'Cape Town', s: 'Western Cape', n: 'South Africa' },
  { c: 'Durban', s: 'KwaZulu-Natal', n: 'South Africa' },

  // KENYA
  { c: 'Nairobi', s: 'Nairobi', n: 'Kenya' },

  // IRAN
  { c: 'Tehran', s: 'Tehran', n: 'Iran' },
  { c: 'Isfahan', s: 'Isfahan', n: 'Iran' },
  { c: 'Mashhad', s: 'Razavi Khorasan', n: 'Iran' },

  // IRAQ
  { c: 'Baghdad', s: 'Baghdad', n: 'Iraq' },
  { c: 'Basra', s: 'Basra', n: 'Iraq' },

  // AFGHANISTAN
  { c: 'Kabul', s: 'Kabul', n: 'Afghanistan' },
  { c: 'Kandahar', s: 'Kandahar', n: 'Afghanistan' },
  { c: 'Herat', s: 'Herat', n: 'Afghanistan' },

  // SRI LANKA
  { c: 'Colombo', s: 'Western', n: 'Sri Lanka' },
  { c: 'Kandy', s: 'Central', n: 'Sri Lanka' },

  // NEPAL
  { c: 'Kathmandu', s: 'Bagmati', n: 'Nepal' },
  { c: 'Pokhara', s: 'Gandaki', n: 'Nepal' },

  // NETHERLANDS
  { c: 'Amsterdam', s: 'North Holland', n: 'Netherlands' },
  { c: 'Rotterdam', s: 'South Holland', n: 'Netherlands' },

  // BELGIUM
  { c: 'Brussels', s: 'Brussels', n: 'Belgium' },

  // SWITZERLAND
  { c: 'Zurich', s: 'Zurich', n: 'Switzerland' },
  { c: 'Geneva', s: 'Geneva', n: 'Switzerland' },

  // SWEDEN
  { c: 'Stockholm', s: 'Stockholm', n: 'Sweden' },

  // NORWAY
  { c: 'Oslo', s: 'Oslo', n: 'Norway' },

  // DENMARK
  { c: 'Copenhagen', s: 'Capital Region', n: 'Denmark' },

  // FINLAND
  { c: 'Helsinki', s: 'Uusimaa', n: 'Finland' },

  // POLAND
  { c: 'Warsaw', s: 'Masovia', n: 'Poland' },
  { c: 'Krakow', s: 'Lesser Poland', n: 'Poland' },

  // GREECE
  { c: 'Athens', s: 'Attica', n: 'Greece' },

  // PORTUGAL
  { c: 'Lisbon', s: 'Lisbon', n: 'Portugal' },

  // IRELAND
  { c: 'Dublin', s: 'Leinster', n: 'Ireland' },

  // NEW ZEALAND
  { c: 'Auckland', s: 'Auckland', n: 'New Zealand' },
  { c: 'Wellington', s: 'Wellington', n: 'New Zealand' },

  // THAILAND
  { c: 'Bangkok', s: 'Bangkok', n: 'Thailand' },
  { c: 'Chiang Mai', s: 'Chiang Mai', n: 'Thailand' },
  { c: 'Phuket', s: 'Phuket', n: 'Thailand' },

  // VIETNAM
  { c: 'Hanoi', s: 'Hanoi', n: 'Vietnam' },
  { c: 'Ho Chi Minh City', s: 'Ho Chi Minh', n: 'Vietnam' },

  // PHILIPPINES
  { c: 'Manila', s: 'Metro Manila', n: 'Philippines' },
  { c: 'Cebu', s: 'Central Visayas', n: 'Philippines' },

  // SOUTH KOREA
  { c: 'Seoul', s: 'Seoul', n: 'South Korea' },
  { c: 'Busan', s: 'Busan', n: 'South Korea' },

  // ISRAEL
  { c: 'Tel Aviv', s: 'Tel Aviv', n: 'Israel' },
  { c: 'Jerusalem', s: 'Jerusalem', n: 'Israel' },

  // QATAR
  { c: 'Doha', s: 'Ad Dawhah', n: 'Qatar' },

  // KUWAIT
  { c: 'Kuwait City', s: 'Al Asimah', n: 'Kuwait' },

  // BAHRAIN
  { c: 'Manama', s: 'Capital', n: 'Bahrain' },

  // OMAN
  { c: 'Muscat', s: 'Muscat', n: 'Oman' },

  // JORDAN
  { c: 'Amman', s: 'Amman', n: 'Jordan' },

  // LEBANON
  { c: 'Beirut', s: 'Beirut', n: 'Lebanon' },

  // UKRAINE
  { c: 'Kyiv', s: 'Kyiv', n: 'Ukraine' },

  // ROMANIA
  { c: 'Bucharest', s: 'Bucharest', n: 'Romania' },

  // CZECH
  { c: 'Prague', s: 'Prague', n: 'Czech Republic' },

  // HUNGARY
  { c: 'Budapest', s: 'Budapest', n: 'Hungary' },

  // AUSTRIA
  { c: 'Vienna', s: 'Vienna', n: 'Austria' },

  // ARGENTINA
  { c: 'Buenos Aires', s: 'Buenos Aires', n: 'Argentina' },

  // CHILE
  { c: 'Santiago', s: 'Santiago', n: 'Chile' },

  // COLOMBIA
  { c: 'Bogota', s: 'Bogota', n: 'Colombia' },

  // PERU
  { c: 'Lima', s: 'Lima', n: 'Peru' },
]

const CITIES: CitySuggestion[] = CITIES_DB.map((c) => ({
  city: c.c,
  state: c.s,
  country: c.n,
  fullName: c.s ? `${c.c}, ${c.s}, ${c.n}` : `${c.c}, ${c.n}`,
}))

export function searchCities(query: string, limit: number = 8): CitySuggestion[] {
  if (!query || query.trim().length < 2) return []

  const q = query.toLowerCase().trim()
  const results: Array<{ city: CitySuggestion; score: number }> = []

  for (const city of CITIES) {
    const cityLower = city.city.toLowerCase()
    const countryLower = city.country.toLowerCase()
    const stateLower = city.state?.toLowerCase() || ''

    let score = 0

    if (cityLower === q) score = 1000
    else if (cityLower.startsWith(q)) score = 500 - cityLower.length
    else if (countryLower.startsWith(q)) score = 400 - countryLower.length
    else if (stateLower.startsWith(q)) score = 300 - stateLower.length
    else if (cityLower.includes(q)) score = 200 - cityLower.length
    else if (countryLower.includes(q)) score = 150 - countryLower.length
    else if (stateLower.includes(q)) score = 100 - stateLower.length
    else continue

    results.push({ city, score })
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, limit).map((r) => r.city)
}

export function getTotalCityCount(): number {
  return CITIES.length
}
