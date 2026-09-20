'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Ban,
  CheckCircle,
  MoreVertical,
  Shield,
  ShieldOff,
  User,
  Store,
  Loader2,
  X,
  AlertTriangle,
} from 'lucide-react'

type Props = {
  user: {
    id: string
    username: string
    role: string
    is_banned: boolean
  }
  currentAdminId: string
}

export default function UserActions({ user, currentAdminId }: Props) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showBanModal, setShowBanModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [banReason, setBanReason] = useState('')
  const [selectedRole, setSelectedRole] = useState(user.role)

  const isSelf = user.id === currentAdminId

  // Hard reload helper - cache clear karta hai
  const hardReload = () => {
    router.refresh()
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const handleBan = async () => {
    if (!banReason.trim()) {
      alert('Please provide a reason for banning')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ban', reason: banReason }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      setShowBanModal(false)
      setBanReason('')
      hardReload()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUnban = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unban' }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      setShowMenu(false)
      hardReload()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async () => {
    if (selectedRole === user.role) {
      setShowRoleModal(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_role', role: selectedRole }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      setShowRoleModal(false)
      hardReload()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAdmin = async () => {
    if (!confirm('Remove admin access? User will become a buyer.')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove_admin', role: 'buyer' }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      setShowMenu(false)
      hardReload()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (isSelf) {
    return (
      <span className="text-xs text-gray-400 italic px-3 py-1.5">
        (You)
      </span>
    )
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MoreVertical className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
              {!user.is_banned ? (
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowBanModal(true)
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 text-sm w-full"
                >
                  <Ban className="w-4 h-4" />
                  Ban User
                </button>
              ) : (
                <button
                  onClick={handleUnban}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-green-600 text-sm w-full"
                >
                  <CheckCircle className="w-4 h-4" />
                  Unban User
                </button>
              )}

              <div className="border-t"></div>

              <button
                onClick={() => {
                  setShowMenu(false)
                  setSelectedRole(user.role)
                  setShowRoleModal(true)
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-blue-600 text-sm w-full"
              >
                <Shield className="w-4 h-4" />
                Change Role
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={handleRemoveAdmin}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 text-orange-600 text-sm w-full border-t"
                >
                  <ShieldOff className="w-4 h-4" />
                  Remove Admin Access
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Ban className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Ban User</h3>
              </div>
              <button
                onClick={() => setShowBanModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800">
                <strong>{user.username}</strong> will no longer be able to log in or use NovaMarket.
              </p>
            </div>

            <label className="block text-sm font-medium mb-2">
              Reason for ban
            </label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={3}
              placeholder="e.g. Violation of terms, spam, fraudulent activity..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBanModal(false)
                  setBanReason('')
                }}
                disabled={loading}
                className="flex-1 py-2.5 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBan}
                disabled={loading}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Ban className="w-4 h-4" />
                    Ban
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Change Role</h3>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Current role: <strong>{user.role}</strong>
            </p>

            <div className="space-y-2 mb-6">
              <button
                onClick={() => setSelectedRole('buyer')}
                className={`w-full flex items-center gap-3 p-3 border-2 rounded-lg transition ${
                  selectedRole === 'buyer'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-5 h-5 text-purple-600" />
                <div className="text-left flex-1">
                  <p className="font-medium text-sm">Buyer</p>
                  <p className="text-xs text-gray-500">Can only buy products</p>
                </div>
                {selectedRole === 'buyer' && (
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                )}
              </button>

              <button
                onClick={() => setSelectedRole('seller')}
                className={`w-full flex items-center gap-3 p-3 border-2 rounded-lg transition ${
                  selectedRole === 'seller'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Store className="w-5 h-5 text-blue-600" />
                <div className="text-left flex-1">
                  <p className="font-medium text-sm">Seller</p>
                  <p className="text-xs text-gray-500">Can sell and buy products</p>
                </div>
                {selectedRole === 'seller' && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </button>

              <button
                onClick={() => setSelectedRole('admin')}
                className={`w-full flex items-center gap-3 p-3 border-2 rounded-lg transition ${
                  selectedRole === 'admin'
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Shield className="w-5 h-5 text-red-600" />
                <div className="text-left flex-1">
                  <p className="font-medium text-sm">Admin</p>
                  <p className="text-xs text-gray-500">Full platform access</p>
                </div>
                {selectedRole === 'admin' && (
                  <CheckCircle className="w-5 h-5 text-red-600" />
                )}
              </button>
            </div>

            {selectedRole === 'admin' && user.role !== 'admin' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-800">
                  ⚠️ Admin has full access. Only promote trusted users.
                </p>
              </div>
            )}

            {selectedRole !== 'admin' && user.role === 'admin' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-orange-800">
                  ⚠️ Admin access hat jayega. User <strong>{selectedRole}</strong> ban jayega.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                disabled={loading}
                className="flex-1 py-2.5 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeRole}
                disabled={loading || selectedRole === user.role}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Confirm Change'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
