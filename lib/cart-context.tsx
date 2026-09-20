'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = {
  id: string
  title: string
  price: number
  image: string | null
  seller_id: string
  quantity: number
  stock: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isLoaded: boolean
}

const CartContext = createContext<CartContextType | null>(null)

const CART_KEY = 'novamarket-cart-v2'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadCart = () => {
      try {
        const stored = localStorage.getItem(CART_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setItems(parsed)
          }
        }
      } catch (e) {
        console.error('Failed to load cart:', e)
      } finally {
        setIsLoaded(true)
      }
    }

    const timer = setTimeout(loadCart, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save cart:', e)
    }
  }, [items, isLoaded])

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id)
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id
            ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, newItem.stock || 999) }
            : i
        )
      }
      return [...prev, newItem]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => {
    setItems([])
    try {
      localStorage.removeItem(CART_KEY)
    } catch {}
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
