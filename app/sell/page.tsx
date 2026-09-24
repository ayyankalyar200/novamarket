'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Upload, Store, Package, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function SellPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '1',
    category_id: '',
    condition: 'new',
    return_days: '7',
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?redirect=/sell')
        return
      }
      setUser(user)

      // Check role
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(prof)

      // Agar seller ya admin nahi hai to dashboard pe bhejein with message
      if (prof?.role !== 'seller' && prof?.role !== 'admin') {
        router.push('/?error=seller_only')
        return
      }

      const { data } = await supabase.from('categories').select('*').order('id')
      setCategories(data || [])
      setChecking(false)
    }
    init()
  }, [router])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles((prev) => [...prev, ...files])
    const urls = files.map((f) => URL.createObjectURL(f))
    setImageUrls((prev) => [...prev, ...urls])
  }

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const uploadedUrls: string[] = []

      for (const file of imageFiles) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`
        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file)

        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path)

        uploadedUrls.push(urlData.publicUrl)
      }

      const { data, error: insertError } = await supabase
        .from('products')
        .insert({
          seller_id: user.id,
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          category_id: form.category_id ? parseInt(form.category_id) : null,
          condition: form.condition,
          return_days: parseInt(form.return_days),
          images: uploadedUrls,
          status: 'active',
        })
        .select()
        .single()

      if (insertError) throw insertError

      router.push(`/product/${data.id}`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Sell a Product</h1>
        <p className="text-gray-500">List your product on NovaMarket</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900">Product Title *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. iPhone 15 Pro Max 256GB"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your product..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Price (USD) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="99.99"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Stock *</label>
            <input
              type="number"
              min="0"
              required
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Condition</label>
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>
        </div>

        
        {/* Return Policy */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900 dark:text-white">
              Return Policy *
            </h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            Decide how many days buyers can return this product. This will be shown on your product page.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
            {[
              { value: '0', label: 'No Returns', desc: 'Final sale' },
              { value: '3', label: '3 Days', desc: 'Short window' },
              { value: '7', label: '7 Days', desc: 'Recommended' },
              { value: '14', label: '14 Days', desc: 'Standard' },
              { value: '30', label: '30 Days', desc: 'Generous' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setForm({ ...form, return_days: option.value })}
                className={`p-3 rounded-lg border-2 transition text-left ${
                  form.return_days === option.value
                    ? 'border-blue-600 bg-white dark:bg-slate-800'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 bg-white dark:bg-slate-800'
                }`}
              >
                <p className="font-bold text-xs dark:text-white">{option.label}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {option.desc}
                </p>
              </button>
            ))}
          </div>

          {form.return_days === '0' ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-2 text-xs text-red-700 dark:text-red-400">
              ⚠️ Buyers will see: "This is a final sale. No returns accepted."
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-2 text-xs text-green-700 dark:text-green-400">
              ✅ Buyers will see: "Return accepted within {form.return_days} days of delivery."
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click to upload images</span>
          </label>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative aspect-square">
                  <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Publishing...' : 'Publish Product'}
        </button>
      </form>
    </div>
  )
}


