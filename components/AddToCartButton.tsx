'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import WishlistButton from './WishlistButton'

type Props = {
  product: {
    id: string
    title: string
    price: number
    images: string[] | null
    seller_id: string
    stock: number
  }
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (product.stock < 1) return

    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || null,
      seller_id: product.seller_id,
      quantity,
      stock: product.stock,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 hover:bg-gray-100"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="px-4 py-1 border-x min-w-[3rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-3 py-1 hover:bg-gray-100"
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stock < 1}
          className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>
        <WishlistButton productId={product.id} variant="icon" />
      </div>
    </div>
  )
}
