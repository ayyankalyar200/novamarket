import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

// ============================================
// API KEY MANAGEMENT
// ============================================

type Provider = 'gemini' | 'groq'

type AIProvider = {
  provider: Provider
  client: any
  keyIndex: number
}

// Collect all available keys
function getGeminiKeys(): string[] {
  const keys: string[] = []
  for (let i = 1; i <= 5; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`]
    if (key && key.trim()) keys.push(key.trim())
  }
  return keys
}

function getGroqKeys(): string[] {
  const keys: string[] = []
  for (let i = 1; i <= 5; i++) {
    const key = process.env[`GROQ_API_KEY_${i}`]
    if (key && key.trim()) keys.push(key.trim())
  }
  return keys
}

// Current key rotation indexes
let geminiKeyIndex = 0
let groqKeyIndex = 0

// ============================================
// GENERATE TEXT WITH FALLBACK
// ============================================

export async function generateAIText(
  prompt: string,
  options?: { maxTokens?: number; temperature?: number }
): Promise<{ text: string; provider: Provider }> {
  const geminiKeys = getGeminiKeys()
  const groqKeys = getGroqKeys()

  const errors: string[] = []

  // ============================================
  // TRY GEMINI FIRST
  // ============================================
  for (let i = 0; i < geminiKeys.length; i++) {
    const idx = (geminiKeyIndex + i) % geminiKeys.length
    const key = geminiKeys[idx]

    try {
      const genAI = new GoogleGenerativeAI(key)
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-latest',
        generationConfig: {
          maxOutputTokens: options?.maxTokens || 1000,
          temperature: options?.temperature || 0.7,
        },
      })

      const result = await model.generateContent(prompt)
      const text = result.response.text()

      // Success - update index for next call
      geminiKeyIndex = (idx + 1) % geminiKeys.length

      return { text, provider: 'gemini' }
    } catch (err: any) {
      errors.push(`Gemini key ${idx + 1}: ${err.message}`)
      console.warn(`Gemini key ${idx + 1} failed:`, err.message)
      // Try next key
    }
  }

  // ============================================
  // FALLBACK TO GROQ
  // ============================================
  for (let i = 0; i < groqKeys.length; i++) {
    const idx = (groqKeyIndex + i) % groqKeys.length
    const key = groqKeys[idx]

    try {
      const groq = new Groq({ apiKey: key })

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        max_tokens: options?.maxTokens || 1000,
        temperature: options?.temperature || 0.7,
      })

      const text = completion.choices[0]?.message?.content || ''

      // Success - update index
      groqKeyIndex = (idx + 1) % groqKeys.length

      return { text, provider: 'groq' }
    } catch (err: any) {
      errors.push(`Groq key ${idx + 1}: ${err.message}`)
      console.warn(`Groq key ${idx + 1} failed:`, err.message)
    }
  }

  // All providers failed
  throw new Error(
    `All AI providers failed:\n${errors.join('\n')}`
  )
}

// ============================================
// CHECK IF AI IS AVAILABLE
// ============================================

export function isAIAvailable(): boolean {
  return getGeminiKeys().length > 0 || getGroqKeys().length > 0
}

// ============================================
// USAGE EXAMPLES
// ============================================

export async function generateProductDescription(
  productTitle: string,
  category?: string,
  keywords?: string
): Promise<string> {
  const prompt = `Write a compelling, professional product description for an e-commerce marketplace.

Product Title: ${productTitle}
${category ? `Category: ${category}` : ''}
${keywords ? `Key Features: ${keywords}` : ''}

Requirements:
- 100-200 words
- Engaging and persuasive
- Highlight key benefits
- Natural, conversational tone
- No emojis
- No markdown formatting
- Just plain text

Write ONLY the description, nothing else.`

  const { text } = await generateAIText(prompt, {
    maxTokens: 500,
    temperature: 0.7,
  })

  return text.trim()
}

export async function aiSearch(
  query: string,
  products: any[]
): Promise<any[]> {
  if (products.length === 0) return []

  const productList = products
    .slice(0, 30)
    .map((p, i) => `${i + 1}. ${p.title} - $${p.price} - ${p.description?.slice(0, 100) || 'No description'}`)
    .join('\n')

  const prompt = `You are an AI shopping assistant for an e-commerce marketplace.

User query: "${query}"

Available products:
${productList}

Based on the user's query, identify the BEST matching products.
Return ONLY a JSON array of product numbers (1-based indexes) in order of relevance.
Example: [3, 7, 1]
Return at least 1, at most 8 products. If nothing matches well, return the closest alternatives.

Return ONLY the JSON array, nothing else.`

  try {
    const { text } = await generateAIText(prompt, {
      maxTokens: 200,
      temperature: 0.3,
    })

    // Parse JSON array from text
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
