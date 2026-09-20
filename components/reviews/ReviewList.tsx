import StarRating from './StarRating'
import { User } from 'lucide-react'

type Review = {
  id: string
  rating: number
  comment: string
  created_at: string
  profiles: {
    username: string
    full_name: string | null
  } | null
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <p className="font-medium text-gray-900">
                  {review.profiles?.username || review.profiles?.full_name || 'Anonymous'}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <StarRating rating={review.rating} size="sm" />
              {review.comment && (
                <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
