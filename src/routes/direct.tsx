import { useState } from "react"
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useMatchRoute,
} from "@tanstack/react-router"
import { MessageCircle, Pencil, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { Sidebar } from "../components/sidebar/sidebar"
import { useSidebar } from "../components/sidebar/sidebar-context"
import { SearchSheet } from "../components/sidebar/search-sheet"
import { NotificationsSheet } from "../components/sidebar/notifications-sheet"
import { NewMessageDialog } from "../components/messages/new-message-dialog"
import { NewMessageProvider } from "../components/messages/new-message-context"
import {
  conversationsQueryOptions,
  getMessagePreviewText,
} from "../queries/messages"
import type { Conversation } from "../queries/messages"

export const Route = createFileRoute("/direct")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/sign-in" })
  },
  component: DirectLayout,
})

function ConversationRow({
  conversation,
  isActive,
}: {
  conversation: Conversation
  isActive: boolean
}) {
  const otherUser = conversation.otherUser
  if (!otherUser) return null

  const hasUnread = (conversation.unreadCount ?? 0) > 0
  const lastMsg = conversation.lastMessage
  const isOnline =
    !!otherUser.lastSeenAt &&
    Date.now() - new Date(otherUser.lastSeenAt).getTime() < 5 * 60000

  return (
    <Link
      to="/direct/$conversationId"
      params={{ conversationId: String(conversation.id) }}
      className={cn(
        "flex w-full items-center gap-3 px-5 py-2 text-left transition-colors",
        isActive ? "bg-[#1a1a1a]" : "hover:bg-white/5"
      )}
    >
      <div className="relative shrink-0">
        <img
          src={otherUser.avatarUrl ?? ""}
          alt={otherUser.username}
          className="size-14 rounded-full object-cover"
        />
        {isOnline && (
          <span className="absolute right-0 bottom-0 size-3.5 rounded-full border-2 border-black bg-green-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {otherUser.displayName}
        </p>
        <p
          className={cn(
            "truncate text-xs",
            hasUnread ? "font-semibold text-white" : "text-[#a8a8a8]"
          )}
        >
          {lastMsg?.deletedAt ? (
            <span className="italic">This message was deleted</span>
          ) : lastMsg ? (
            getMessagePreviewText(lastMsg)
          ) : ""}
        </p>
      </div>
      {hasUnread && (
        <span className="size-2 shrink-0 rounded-full bg-[#0095f6]" />
      )}
    </Link>
  )
}

function DirectLayout() {
  const { activeSheet, closeSheet } = useSidebar()
  const matchRoute = useMatchRoute()
  const activeConversationId = matchRoute({ to: "/direct/$conversationId" }) as
    | { conversationId?: string }
    | false
  const { data: conversations = [] } = useQuery(conversationsQueryOptions)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const openNewMessage = () => setDialogOpen(true)

  const filtered = search
    ? conversations.filter(
        (c) =>
          c.otherUser?.displayName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          c.otherUser?.username.toLowerCase().includes(search.toLowerCase())
      )
    : conversations

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <SearchSheet />
      <NotificationsSheet />
      {activeSheet && (
        <div
          className="fixed inset-0 z-30"
          onClick={closeSheet}
          aria-hidden="true"
        />
      )}

      <div className="flex h-screen pl-[72px]">
        {/* Left panel — conversation list */}
        <div className="flex w-[400px] shrink-0 flex-col border-r border-[#262626]">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <h1 className="text-xl font-bold text-white">Messages</h1>
            <button
              type="button"
              onClick={openNewMessage}
              className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10"
            >
              <Pencil size={20} />
            </button>
          </div>

          {/* Search input */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-[#a8a8a8]"
              />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-[#262626] py-2 pr-3 pl-9 text-sm text-white placeholder-[#a8a8a8] outline-none focus:ring-1 focus:ring-[#a8a8a8]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-8 pt-20 text-center">
                <MessageCircle size={48} className="text-[#a8a8a8]" />
                <p className="mt-4 text-sm text-[#a8a8a8]">
                  {search ? "No results found." : "No messages yet."}
                </p>
              </div>
            ) : (
              filtered.map((c) => (
                <ConversationRow
                  key={c.id}
                  conversation={c}
                  isActive={
                    activeConversationId !== false &&
                    activeConversationId.conversationId === String(c.id)
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Right panel — rendered by child route */}
        <NewMessageProvider value={openNewMessage}>
          <Outlet />
        </NewMessageProvider>
      </div>

      <NewMessageDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
