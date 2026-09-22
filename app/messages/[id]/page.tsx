import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import ChatWindow from "@/components/chat/ChatWindow"

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: conversation } = await supabase
    .from("conversations")
    .select(`
      *,
      buyer:buyer_id (id, username, avatar_url),
      seller:seller_id (id, username, avatar_url)
    `)
    .eq("id", id)
    .single()

  if (!conversation) notFound()

  // Verify user is part
  if (
    conversation.buyer_id !== user.id &&
    conversation.seller_id !== user.id
  ) {
    redirect("/messages")
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })

  const isBuyer = conversation.buyer_id === user.id
  const otherUser = isBuyer ? conversation.seller : conversation.buyer

  // Reset unread count
  const updateField = isBuyer
    ? "buyer_unread_count"
    : "seller_unread_count"

  await supabase
    .from("conversations")
    .update({ [updateField]: 0 })
    .eq("id", id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ChatWindow
        conversationId={id}
        currentUserId={user.id}
        otherUser={otherUser}
        initialMessages={messages || []}
      />
    </div>
  )
}
