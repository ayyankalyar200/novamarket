'use client'

import { useState } from 'react'
import { Flag, AlertTriangle, Store } from 'lucide-react'
import ReportModal from './ReportModal'

type Props = {
  reportedUserId?: string
  reportedProductId?: string
  reportedName?: string
  type: 'product' | 'user'
  variant?: 'button' | 'icon' | 'link'
}

export default function ReportButton({
  reportedUserId,
  reportedProductId,
  reportedName,
  type,
  variant = 'button',
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition group"
          title={`Report ${type}`}
        >
          <Flag className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition" />
        </button>
        <ReportModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          reportedUserId={reportedUserId}
          reportedProductId={reportedProductId}
          reportedName={reportedName}
          type={type}
        />
      </>
    )
  }

  if (variant === 'link') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition"
        >
          <Flag className="w-3 h-3" />
          Report {type}
        </button>
        <ReportModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          reportedUserId={reportedUserId}
          reportedProductId={reportedProductId}
          reportedName={reportedName}
          type={type}
        />
      </>
    )
  }

  // BUTTON variant - Beautiful with icons and colors
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
          type === 'product'
            ? 'border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-900/20'
            : 'border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20'
        }`}
      >
        {type === 'product' ? (
          <>
            <AlertTriangle className="w-4 h-4" />
            Report Product
          </>
        ) : (
          <>
            <Store className="w-4 h-4" />
            Report Seller
          </>
        )}
      </button>
      <ReportModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        reportedUserId={reportedUserId}
        reportedProductId={reportedProductId}
        reportedName={reportedName}
        type={type}
      />
    </>
  )
}
