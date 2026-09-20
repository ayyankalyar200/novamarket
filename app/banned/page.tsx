import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Ban, Mail, LogOut } from "lucide-react"
import LogoutButton from "@/components/LogoutButton"

export default async function BannedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, banned_reason, banned_at")
    .eq("id", user.id)
    .single()

  if (!profile || !profile.banned_at) {
    redirect("/")
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg text-center">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Ban className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Account Suspended
        </h1>
        <p className="text-gray-600 mb-6">
          Your NovaMarket account has been suspended by our administration team.
        </p>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 text-left">
          <div className="mb-3">
            <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">
              Account
            </p>
            <p className="font-bold text-gray-900">{profile.username}</p>
          </div>
          <div className="mb-3">
            <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">
              Reason
            </p>
            <p className="text-sm text-gray-700">
              {profile.banned_reason || "Violation of terms of service"}
            </p>
          </div>
          {profile.banned_at && (
            <div>
              <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">
                Suspended on
              </p>
              <p className="text-sm text-gray-700">
                {new Date(profile.banned_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Think this is a mistake?</strong>
          </p>
          <p className="text-xs text-blue-700 mb-3">
            If you believe this suspension was made in error, please contact our support team.
          </p>
          <a
            href="mailto:support@novamarket.com"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Mail className="w-4 h-4" />
            support@novamarket.com
          </a>
        </div>

        <LogoutButton />

        <div className="mt-6 pt-6 border-t">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-purple-600"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
