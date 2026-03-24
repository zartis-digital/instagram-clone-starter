import { useState, useRef, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import {
  ArrowLeft,
  Ellipsis,
  Expand,
  Image,
  MoreHorizontal,
  Pencil,
  Phone,
  SendHorizontal,
  Video,
  X,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useMessages } from "./messages-context"
import {
  conversationsQueryOptions,
  getMessagePreviewText,
  messagesInfiniteQueryOptions,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useMarkReadMutation,
  useNewConversationMutation,
  useSendMessageMutation,
} from "../../queries/messages"
import type { Conversation } from "../../queries/messages"
import { useAuthUser } from "../../queries/auth"
import { useChatWebSocket } from "../../hooks/use-chat-websocket"
import { env } from "../../env"

// ── Collapsed bar ────────────────────────────

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-label="Messenger"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12.003 1.131a10.487 10.487 0 0 0-10.87 10.57 10.194 10.194 0 0 0 3.412 7.771l.054 1.78a1.67 1.67 0 0 0 2.342 1.476l1.935-.872a11.108 11.108 0 0 0 3.127.45 10.487 10.487 0 0 0 10.87-10.57 10.487 10.487 0 0 0-10.87-10.605Zm6.007 8.15-2.931 4.687a1.517 1.517 0 0 1-2.188.457L10.58 12.76a.6.6 0 0 0-.726.007l-3.065 2.341a.477.477 0 0 1-.692-.632l2.931-4.687a1.517 1.517 0 0 1 2.188-.457l2.312 1.665a.6.6 0 0 0 .726-.007l3.065-2.341a.477.477 0 0 1 .692.632Z" />
    </svg>
  )
}

function CollapsedBar() {
  const { openInbox, openChat } = useMessages()
  const { data: conversations = [] } = useQuery(conversationsQueryOptions)

  const unreadCount = conversations.filter(
    (c) => (c.unreadCount ?? 0) > 0
  ).length

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3",
        "cursor-pointer rounded-full bg-[#262626] transition-colors hover:bg-[#363636]"
      )}
      onClick={openInbox}
    >
      <div className="relative">
        <MessengerIcon className="size-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 flex size-4.5 items-center justify-center rounded-full bg-[#ff3040] text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </div>

      <span className="text-sm font-semibold text-white">Messages</span>

      <div className="ml-auto flex -space-x-1.5">
        {conversations.slice(0, 3).map((c) =>
          c.otherUser ? (
            <Tooltip key={c.id}>
              <TooltipTrigger
                onClick={(e) => {
                  e.stopPropagation()
                  openChat(
                    {
                      id: c.otherUser!.id,
                      username: c.otherUser!.username,
                      displayName: c.otherUser!.displayName,
                      avatarUrl: c.otherUser!.avatarUrl,
                    },
                    c.id
                  )
                }}
                className="relative cursor-pointer"
              >
                <img
                  src={c.otherUser.avatarUrl ?? ""}
                  alt={c.otherUser.displayName}
                  className="size-6 rounded-full border-2 border-[#262626] object-cover"
                />
              </TooltipTrigger>
              <TooltipContent>{c.otherUser.displayName}</TooltipContent>
            </Tooltip>
          ) : null
        )}
      </div>

      <Ellipsis size={20} className="text-[#a8a8a8]" />
    </div>
  )
}

// ── Inbox header ─────────────────────────────

function InboxHeader() {
  const { close } = useMessages()

  return (
    <div className="flex items-center justify-between border-b border-[#262626] px-4 py-3">
      <span className="text-base font-bold text-white">Messages</span>
      <div className="flex items-center gap-1">
        <Link
          to="/direct/inbox"
          className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10"
          title="See all in Messenger"
        >
          <Expand size={16} />
        </Link>
        <button
          type="button"
          onClick={close}
          className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10"
          title="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Conversation list item ───────────────────

function ConversationItem({ conversation }: { conversation: Conversation }) {
  const { openChat } = useMessages()

  if (!conversation.otherUser) return null

  const otherUser = conversation.otherUser
  const lastMsg = conversation.lastMessage
  const hasUnread = (conversation.unreadCount ?? 0) > 0

  const timeStr = lastMsg?.createdAt
    ? formatRelativeTime(lastMsg.createdAt)
    : ""

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-white/5"
      onClick={() =>
        openChat(
          {
            id: otherUser.id,
            username: otherUser.username,
            displayName: otherUser.displayName,
            avatarUrl: otherUser.avatarUrl,
          },
          conversation.id
        )
      }
    >
      <img
        src={otherUser.avatarUrl ?? ""}
        alt={otherUser.username}
        className="size-12 shrink-0 rounded-full object-cover"
      />
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
          {timeStr && <span className="text-[#a8a8a8]"> · {timeStr}</span>}
        </p>
      </div>
      {hasUnread && (
        <span className="size-2 shrink-0 rounded-full bg-[#0095f6]" />
      )}
    </button>
  )
}

// ── Inbox view ───────────────────────────────

function InboxView() {
  const { data: conversations, isLoading } = useQuery(conversationsQueryOptions)

  return (
    <div className="flex h-full flex-col">
      <InboxHeader />
      <div className="scrollbar-thin flex-1 overflow-y-auto py-1">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-[#a8a8a8]" />
          </div>
        )}
        {!isLoading && (!conversations || conversations.length === 0) && (
          <p className="py-8 text-center text-sm text-[#a8a8a8]">
            No conversations yet
          </p>
        )}
        {conversations?.map((c) => (
          <ConversationItem key={c.id} conversation={c} />
        ))}
      </div>
    </div>
  )
}

// ── Chat header ──────────────────────────────

function ChatHeader() {
  const { chatUser, goBack, close } = useMessages()
  if (!chatUser) return null

  return (
    <div className="flex items-center gap-2 border-b border-[#262626] px-3 py-2.5">
      <button
        type="button"
        onClick={goBack}
        className="rounded-full p-1 text-white transition-colors hover:bg-white/10"
        title="Back to inbox"
      >
        <ArrowLeft size={18} />
      </button>
      <img
        src={chatUser.avatarUrl ?? ""}
        alt={chatUser.username}
        className="size-7 rounded-full object-cover"
      />
      <span className="flex-1 truncate text-sm font-semibold text-white">
        {chatUser.displayName}
      </span>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10"
        >
          <Phone size={16} />
        </button>
        <button
          type="button"
          className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10"
        >
          <Video size={16} />
        </button>
        <button
          type="button"
          onClick={close}
          className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Chat messages ────────────────────────────

function ChatMessages({
  typingUsers,
  onEdit,
  onDelete,
}: {
  typingUsers: { id: number; username: string }[]
  onEdit: (messageId: number, content: string) => void
  onDelete: (messageId: number) => void
}) {
  const { conversationId } = useMessages()
  const { data: authUser } = useAuthUser()
  const { data: messagesData, isLoading } = useInfiniteQuery(
    messagesInfiniteQueryOptions(conversationId ?? 0)
  )
  const messages = messagesData?.pages.flat()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages?.length])

  if (!conversationId) return null

  const startEditing = (msgId: number, content: string) => {
    setEditingId(msgId)
    setEditText(content)
    setMenuOpenId(null)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditText("")
  }

  const saveEdit = (msgId: number) => {
    const trimmed = editText.trim()
    if (!trimmed) return
    onEdit(msgId, trimmed)
    setEditingId(null)
    setEditText("")
  }

  return (
    <div
      ref={scrollRef}
      className="flex flex-1 flex-col-reverse gap-2 overflow-y-auto px-3 py-3"
    >
      {/* Typing indicator */}
      {typingUsers.length > 0 && (
        <div className="flex justify-start">
          <div className="rounded-2xl bg-[#262626] px-3 py-2 text-xs text-[#a8a8a8]">
            {typingUsers.map((u) => u.username).join(", ")}{" "}
            {typingUsers.length === 1 ? "is" : "are"} typing...
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-4 animate-spin text-[#a8a8a8]" />
        </div>
      )}

      {/* Messages are stored newest-first from the API, flex-col-reverse
          renders them so newest appears at the bottom */}
      {messages?.map((msg) => {
        const isMe = msg.senderId === authUser?.id
        const isEditing = editingId === msg.id

        if (msg.deletedAt) {
          return (
            <div
              key={msg.id}
              className={cn("flex", isMe ? "justify-end" : "justify-start")}
            >
              <div className="max-w-[75%] rounded-2xl bg-[#262626]/50 px-3 py-2 text-sm italic text-[#a8a8a8]">
                This message was deleted
              </div>
            </div>
          )
        }

        return (
          <div
            key={msg.id}
            className={cn("group flex", isMe ? "justify-end" : "justify-start")}
          >
            {isMe && !isEditing && (
              <div className="relative mr-1 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() =>
                    setMenuOpenId(menuOpenId === msg.id ? null : msg.id)
                  }
                  className="rounded-full p-1 text-[#a8a8a8] transition-colors hover:bg-white/10 hover:text-white"
                >
                  <MoreHorizontal size={14} />
                </button>
                {menuOpenId === msg.id && (
                  <div className="absolute right-full mr-1 rounded-lg border border-[#363636] bg-[#262626] py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => startEditing(msg.id, msg.content ?? "")}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/10"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(msg.id)
                        setMenuOpenId(null)
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-white/10"
                    >
                      <X size={12} />
                      Unsend
                    </button>
                  </div>
                )}
              </div>
            )}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                isMe ? "bg-[#3797f0] text-white" : "bg-[#262626] text-white"
              )}
            >
              {isEditing ? (
                <div className="flex flex-col gap-1.5">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(msg.id)
                      if (e.key === "Escape") cancelEditing()
                    }}
                    className="w-full rounded bg-white/20 px-2 py-1 text-sm text-white placeholder:text-white/50 focus:outline-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="rounded px-2 py-0.5 text-[10px] text-white/70 transition-colors hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => saveEdit(msg.id)}
                      className="rounded bg-white/20 px-2 py-0.5 text-[10px] text-white transition-colors hover:bg-white/30"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {msg.messageType === "post_share" && msg.sharedPost ? (
                    <a
                      href={`/p/${msg.sharedPost.id}`}
                      className="block overflow-hidden rounded-lg"
                    >
                      <img
                        src={
                          msg.sharedPost.images[0]?.imageUrl ??
                          msg.sharedPost.imageUrl
                        }
                        alt={msg.sharedPost.caption ?? "Shared post"}
                        className="aspect-square w-48 object-cover"
                      />
                      <div className="mt-1.5">
                        <p className="text-xs font-semibold">
                          {msg.sharedPost.user.username}
                        </p>
                        {msg.sharedPost.caption && (
                          <p className="line-clamp-2 text-xs opacity-70">
                            {msg.sharedPost.caption}
                          </p>
                        )}
                      </div>
                    </a>
                  ) : msg.messageType === "story_share" && msg.sharedStory ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={msg.sharedStory.segments[0]?.mediaUrl ?? ""}
                        alt="Shared story"
                        className="size-16 rounded-full object-cover"
                      />
                      <p className="text-xs font-semibold">
                        {msg.sharedStory.user.username}
                      </p>
                    </div>
                  ) : msg.messageType === "story_reply" && msg.sharedStory ? (
                    <div>
                      <div className="mb-1.5 flex items-center gap-2">
                        <img
                          src={msg.sharedStory.segments[0]?.mediaUrl ?? ""}
                          alt="Story"
                          className="size-16 rounded-full object-cover"
                        />
                        <p className="text-xs font-semibold">
                          {msg.sharedStory.user.username}
                        </p>
                      </div>
                      <p>{msg.content}</p>
                    </div>
                  ) : msg.messageType === "image" && msg.imageUrl ? (
                    <img
                      src={msg.imageUrl}
                      alt="Sent image"
                      className="max-w-48 rounded-lg"
                    />
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  <p
                    className={cn(
                      "mt-0.5 text-[10px]",
                      isMe ? "text-white/60" : "text-[#a8a8a8]"
                    )}
                  >
                    {formatTime(msg.createdAt)}
                    {msg.editedAt && (
                      <span className="ml-1 text-white/40">(edited)</span>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Chat input ───────────────────────────────

function ChatInput({
  onSend,
  onTyping,
}: {
  onSend: (content: string) => void
  onTyping: () => void
}) {
  const [text, setText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const typingThrottleRef = useRef<number>(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    // Throttle typing events to at most once per second
    const now = Date.now()
    if (now - typingThrottleRef.current > 1000) {
      typingThrottleRef.current = now
      onTyping()
    }
  }

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText("")
    inputRef.current?.focus()
  }

  return (
    <div className="border-t border-[#262626] px-3 py-2">
      <div className="flex items-center gap-2 rounded-full border border-[#363636] px-3 py-1.5">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Message..."
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-[#a8a8a8] focus:outline-none"
        />
        {text ? (
          <button
            type="button"
            onClick={handleSend}
            className="text-[#0095f6] transition-colors hover:text-white"
          >
            <SendHorizontal size={18} />
          </button>
        ) : (
          <button
            type="button"
            className="text-[#a8a8a8] transition-colors hover:text-white"
          >
            <Image size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Chat view ────────────────────────────────

function ChatView() {
  const { conversationId } = useMessages()
  const { data: authUser } = useAuthUser()
  const { sendTyping, typingUsers } = useChatWebSocket(conversationId)
  const sendMutation = useSendMessageMutation()
  const editMutation = useEditMessageMutation()
  const deleteMutation = useDeleteMessageMutation()
  const markReadMutation = useMarkReadMutation()

  useEffect(() => {
    if (conversationId) markReadMutation.mutate(conversationId)
    // Only re-fire when the conversation switches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  if (!conversationId || !authUser) return null

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />
      <ChatMessages
        typingUsers={typingUsers}
        onEdit={(messageId, content) =>
          editMutation.mutate({ conversationId, messageId, content })
        }
        onDelete={(messageId) =>
          deleteMutation.mutate({ conversationId, messageId })
        }
      />
      <ChatInput
        onSend={(content) =>
          sendMutation.mutate({
            conversationId,
            content,
            messageType: "text",
            me: authUser,
          })
        }
        onTyping={sendTyping}
      />
    </div>
  )
}

// ── New conversation flow ────────────────────

function NewConversationButton() {
  const { openChat } = useMessages()
  const [username, setUsername] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [error, setError] = useState("")
  const newConversationMutation = useNewConversationMutation()
  const isCreating = newConversationMutation.isPending

  const handleStart = async () => {
    if (!username.trim()) return
    setError("")

    try {
      const userRes = await fetch(
        `${env.VITE_API_URL}/users/${username.trim()}`,
        { credentials: "include" }
      )
      if (!userRes.ok) {
        setError("User not found")
        return
      }
      const userData = await userRes.json()

      const conv = await newConversationMutation.mutateAsync({
        recipientId: userData.id,
        content: "Hey! 👋",
      })

      openChat(
        {
          id: userData.id,
          username: userData.username,
          displayName: userData.displayName,
          avatarUrl: userData.avatarUrl,
        },
        conv.id
      )
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to create conversation"
      setError(message)
    }
  }

  if (!showInput) {
    return (
      <button
        type="button"
        onClick={() => setShowInput(true)}
        className="mx-4 my-2 rounded-lg bg-[#0095f6] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1877f2]"
      >
        New Message
      </button>
    )
  }

  return (
    <div className="border-t border-[#262626] px-4 py-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value)
            setError("")
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleStart()
          }}
          placeholder="Enter username..."
          className="min-w-0 flex-1 rounded-lg border border-[#363636] bg-transparent px-3 py-1.5 text-sm text-white placeholder:text-[#a8a8a8] focus:outline-none"
          autoFocus
        />
        <button
          type="button"
          onClick={handleStart}
          disabled={isCreating || !username.trim()}
          className="text-sm font-semibold text-[#0095f6] disabled:opacity-50"
        >
          {isCreating ? "..." : "Start"}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowInput(false)
            setUsername("")
            setError("")
          }}
          className="text-xs text-[#a8a8a8]"
        >
          Cancel
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ── Main widget ──────────────────────────────

export function MessagesWidget() {
  const { view } = useMessages()
  const { data: authUser } = useAuthUser()

  // Don't render if not logged in
  if (!authUser) return null

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {view === "closed" && <CollapsedBar />}

      {(view === "inbox" || view === "chat") && (
        <div className="h-[520px] w-[360px] overflow-hidden rounded-xl border border-[#262626] bg-black shadow-2xl">
          {view === "inbox" && (
            <div className="flex h-full flex-col">
              <InboxView />
              <NewConversationButton />
            </div>
          )}
          {view === "chat" && <ChatView />}
        </div>
      )}
    </div>
  )
}

// ── Helpers ──────────────────────────────────

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = Date.now()
  const diffMs = now - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return "now"
  if (diffMin < 60) return `${diffMin}m`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d`
  return `${Math.floor(diffDay / 7)}w`
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}
