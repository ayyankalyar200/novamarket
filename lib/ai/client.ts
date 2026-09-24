import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

// ============================================
// CONFIG
// ============================================
type Provider = 'gemini' | 'groq'
type Language = 'en' | 'ur' | 'auto'

type AIProvider = {
  provider: Provider
  keyIndex: number
  key: string
}

// Detect language from message
function detectLanguage(text: string): 'en' | 'ur' {
  const urduRegex = /[\u0600-\u06FF]/
  return urduRegex.test(text) ? 'ur' : 'en'
}

// ============================================
// API KEY MANAGEMENT (4 APIs each)
// ============================================

function getGeminiKeys(): string[] {
  const keys: string[] = []
  for (let i = 1; i <= 4; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`]
    if (key && key.trim()) keys.push(key.trim())
  }
  return keys
}

function getGroqKeys(): string[] {
  const keys: string[] = []
  for (let i = 1; i <= 4; i++) {
    const key = process.env[`GROQ_API_KEY_${i}`]
    if (key && key.trim()) keys.push(key.trim())
  }
  return keys
}

// Rotation indexes
let geminiKeyIndex = 0
let groqKeyIndex = 0

// ============================================
// CORE: GENERATE TEXT WITH 4-API ROTATION
// ============================================

export async function generateAIText(
  prompt: string,
  options?: {
    maxTokens?: number
    temperature?: number
    systemPrompt?: string
  }
): Promise<{ text: string; provider: Provider; keyUsed: number }> {
  const geminiKeys = getGeminiKeys()
  const groqKeys = getGroqKeys()

  const errors: string[] = []

  // ==========================================
  // TRY ALL GEMINI KEYS (rotation)
  // ==========================================
  for (let i = 0; i < geminiKeys.length; i++) {
    const idx = (geminiKeyIndex + i) % geminiKeys.length
    const key = geminiKeys[idx]

    try {
      const genAI = new GoogleGenerativeAI(key)
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.5-flash',
        generationConfig: {
          maxOutputTokens: options?.maxTokens || 1500,
          temperature: options?.temperature || 0.7,
        },
      })

      const fullPrompt = options?.systemPrompt
        ? `${options.systemPrompt}\n\n${prompt}`
        : prompt

      const result = await model.generateContent(fullPrompt)
      const text = result.response.text()

      // Success — rotate to next key for next request
      geminiKeyIndex = (idx + 1) % geminiKeys.length

      return { text, provider: 'gemini', keyUsed: idx + 1 }
    } catch (err: any) {
      errors.push(`Gemini #${idx + 1}: ${err.message?.slice(0, 100)}`)
      console.warn(`Gemini key ${idx + 1} failed, trying next...`)
    }
  }

  // ==========================================
  // FALLBACK: TRY ALL GROQ KEYS
  // ==========================================
  for (let i = 0; i < groqKeys.length; i++) {
    const idx = (groqKeyIndex + i) % groqKeys.length
    const key = groqKeys[idx]

    try {
      const groq = new Groq({ apiKey: key })

      const messages: any[] = []
      
      if (options?.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt })
      }
      
      messages.push({ role: 'user', content: prompt })

      const completion = await groq.chat.completions.create({
        messages,
        model: 'openai/gpt-oss-20b',
        max_tokens: options?.maxTokens || 1500,
        temperature: options?.temperature || 0.7,
      })

      const text = completion.choices[0]?.message?.content || ''

      groqKeyIndex = (idx + 1) % groqKeys.length

      return { text, provider: 'groq', keyUsed: idx + 1 }
    } catch (err: any) {
      errors.push(`Groq #${idx + 1}: ${err.message?.slice(0, 100)}`)
      console.warn(`Groq key ${idx + 1} failed, trying next...`)
    }
  }

  throw new Error(
    `All AI providers exhausted:\n${errors.join('\n')}`
  )
}

// ============================================
// CHECK AI AVAILABILITY
// ============================================

export function isAIAvailable(): boolean {
  return getGeminiKeys().length > 0 || getGroqKeys().length > 0
}

export function getAIStats() {
  return {
    geminiKeys: getGeminiKeys().length,
    groqKeys: getGroqKeys().length,
    totalAPIs: getGeminiKeys().length + getGroqKeys().length,
  }
}

// ============================================
// 🛍️ BUYER AI ASSISTANT
// ============================================

export async function buyerAIAssistant(
  message: string,
  products: any[],
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ text: string; provider: Provider }> {
  const language = detectLanguage(message)
  
  const productContext = products
    .slice(0, 20)
    .map((p: any) => `• ${p.title} - $${p.price} (${p.stock || 0} in stock)`)
    .join('\n')

  const historyContext = conversationHistory.length > 0
    ? `\nPrevious conversation:\n${conversationHistory.map((h) => `${h.role}: ${h.content}`).join('\n')}`
    : ''

  const systemPrompt = language === 'ur'
    ? `Aap NovaMarket ke AI Shopping Assistant hain. Aap users ki madad karte hain:
- Products dhundhne mein
- Best options suggest karne mein
- Price comparison mein
- Product recommendations mein

Aap bilkul friendly aur helpful hain. User ke sawal ka jawab URDU mein dein.

Available products:
${productContext}

Ahmiyat ki baatein:
- Concise jawab dein (2-3 sentences)
- Kabhi kabhi product names mention karein
- Agar user English mein baat kare to English mein jawab dein`
    : `You are NovaMarket's AI Shopping Assistant. You help users:
- Find products
- Suggest best options
- Compare prices
- Recommend products

You are friendly and helpful. Match the user's language (English or Urdu).

Available products:
${productContext}

Important:
- Be concise (2-3 sentences)
- Sometimes mention product names
- Match user's language`

  const fullPrompt = `User message: "${message}"${historyContext}

Respond helpfully in the same language as the user.`

  const { text, provider } = await generateAIText(fullPrompt, {
    systemPrompt,
    maxTokens: 500,
    temperature: 0.8,
  })

  return { text: text.trim(), provider }
}

// ============================================
// 🏪 SELLER AI ASSISTANT
// ============================================

export async function sellerAIAssistant(
  message: string,
  sellerContext?: {
    storeName?: string
    totalProducts?: number
    totalRevenue?: number
    totalOrders?: number
  }
): Promise<{ text: string; provider: Provider }> {
  const language = detectLanguage(message)

  const contextInfo = sellerContext
    ? `
Store info:
- Name: ${sellerContext.storeName || 'Your Store'}
- Products: ${sellerContext.totalProducts || 0}
- Revenue: $${sellerContext.totalRevenue?.toFixed(2) || '0.00'}
- Orders: ${sellerContext.totalOrders || 0}
`
    : ''

  const systemPrompt = language === 'ur'
    ? `Aap NovaMarket ke Seller AI Assistant hain. Aap sellers ki madad karte hain:
- Product listings likhne mein
- Pricing strategies mein
- Sales analytics samajhne mein
- Customer service improve karne mein

${contextInfo}

Aap business-minded aur helpful hain. User ke sawal ka jawab URDU mein dein.

Important:
- Practical advice dein
- 2-4 sentences
- Actionable steps suggest karein`
    : `You are NovaMarket's Seller AI Assistant. You help sellers with:
- Writing product listings
- Pricing strategies
- Understanding sales analytics
- Improving customer service

${contextInfo}

You are business-minded and helpful. Match user's language.

Important:
- Give practical advice
- 2-4 sentences
- Suggest actionable steps`

  const fullPrompt = `Seller question: "${message}"

Provide helpful business advice in the same language.`

  const { text, provider } = await generateAIText(fullPrompt, {
    systemPrompt,
    maxTokens: 600,
    temperature: 0.7,
  })

  return { text: text.trim(), provider }
}

// ============================================
// 📝 PRODUCT DESCRIPTION GENERATOR
// ============================================

export async function generateProductDescription(
  productTitle: string,
  category?: string,
  keywords?: string,
  language: 'en' | 'ur' = 'en'
): Promise<string> {
  const prompt = language === 'ur'
    ? `Is product ka compelling description likhein:

Product: ${productTitle}
${category ? `Category: ${category}` : ''}
${keywords ? `Features: ${keywords}` : ''}

Requirements:
- 100-150 words
- URDU mein likhein
- Professional aur engaging
- Key benefits highlight karein
- No emojis, no markdown
- Sirf description likhein`
    : `Write a compelling product description:

Product: ${productTitle}
${category ? `Category: ${category}` : ''}
${keywords ? `Key Features: ${keywords}` : ''}

Requirements:
- 100-150 words
- Professional and engaging
- Highlight key benefits
- Natural tone
- No emojis, no markdown
- Write ONLY the description`

  const { text } = await generateAIText(prompt, {
    maxTokens: 400,
    temperature: 0.7,
  })

  return text.trim()
}

// ============================================
// 🔍 AI PRODUCT SEARCH
// ============================================

export async function aiSearch(
  query: string,
  products: any[]
): Promise<any[]> {
  if (products.length === 0) return []

  const productList = products
    .slice(0, 30)
    .map((p, i) => `${i + 1}. ${p.title} - $${p.price}`)
    .join('\n')

  const prompt = `User is searching for: "${query}"

Available products:
${productList}

Return ONLY a JSON array of product numbers (1-based) in order of relevance.
Example: [3, 7, 1]
Return 1-8 products. If nothing matches, return closest alternatives.

Return ONLY the JSON array:`

  try {
    const { text } = await generateAIText(prompt, {
      maxTokens: 200,
      temperature: 0.3,
    })

    const match = text.match(/\[[\d,\s]+\]/)
    if (!match) return products.slice(0, 8)

    const indexes: number[] = JSON.parse(match[0])

    return indexes
      .filter((i) => i >= 1 && i <= products.length)
      .map((i) => products[i - 1])
      .filter(Boolean)
  } catch (err) {
    console.error('AI search error:', err)
    return products.slice(0, 8)
  }
}





// ============================================
// 📷 IMAGE SEARCH (Gemini Vision)
// ============================================

export async function analyzeImageForSearch(
  imageBase64: string,
  mimeType: string,
  products: any[]
): Promise<{ keywords: string[]; bestMatches: any[] }> {
  const geminiKeys = getGeminiKeys()
  
  if (geminiKeys.length === 0) {
    throw new Error('No Gemini API key available for image search')
  }

  const productList = products
    .slice(0, 30)
    .map((p, i) => `${i + 1}. ${p.title} - $${p.price} - ${p.description?.slice(0, 60) || ''}`)
    .join('\n')

  const prompt = `You are an AI product search assistant. Analyze this image and identify what product it shows.

Then, from the available products list below, find the BEST matching products.

Available products:
${productList}

Return ONLY a JSON object in this exact format:
{
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "matches": [3, 7, 1]
}

Where "keywords" are the main features you identified (color, type, brand, etc.) in max 5 words, and "matches" is an array of product indexes (1-based) sorted by relevance. Return max 8 products. If no good match, return closest alternatives.

Return ONLY the JSON, no other text.`

  const errors: string[] = []

  for (let i = 0; i < geminiKeys.length; i++) {
    const idx = (geminiKeyIndex + i) % geminiKeys.length
    const key = geminiKeys[idx]

    try {
      const genAI = new GoogleGenerativeAI(key)
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.5-flash',
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.3,
        },
      })

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType,
          },
        },
      ])

      const text = result.response.text()
      
      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      const keywords = parsed.keywords || []
      const matches = parsed.matches || []

      const bestMatches = matches
        .filter((i: number) => i >= 1 && i <= products.length)
        .map((i: number) => products[i - 1])
        .filter(Boolean)

      // Rotate to next key
      geminiKeyIndex = (idx + 1) % geminiKeys.length

      return { keywords, bestMatches }
    } catch (err: any) {
      errors.push(`Gemini #${idx + 1}: ${err.message?.slice(0, 100)}`)
      console.warn(`Gemini key ${idx + 1} failed for image search`)
    }
  }

  throw new Error(`All AI providers failed for image search:\n${errors.join('\n')}`)
}
