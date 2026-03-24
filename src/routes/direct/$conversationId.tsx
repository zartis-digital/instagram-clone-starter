import { useState, useRef, useEffect, useCallback } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  Image,
  Info,
  Loader2,
  MoreHorizontal,
  Pencil,
  Phone,
  SendHorizontal,
  Video,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { useUploadFile } from "@better-upload/client"
import {
  conversationsQueryOptions,
  messagesInfiniteQueryOptions,
  useDeleteMessageMutation,
  useEditMessageMutation,
  useMarkReadMutation,
  useSendMessageMutation,
} from "../../queries/messages"
import { useAuthUser } from "../../queries/auth"
import { useChatWebSocket } from "../../hooks/use-chat-websocket"
import { env } from "../../env"

export const Route = createFileRoute("/direct/$conversationId")({
  component: ConversationChat,
})

function formatLastSeen(lastSeenAt: string | null | undefined): string {
  if (!lastSeenAt) return "Offline"
  const diff = Date.now() - new Date(lastSeenAt).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 5) return "Active now"
  if (minutes < 60) return `Active ${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Active ${hours}h ago`
  const days = Math.floor(hours / 24)
  return `Active ${days}d ago`
}

function ConversationChat() {
  const { conversationId: conversationIdStr } = Route.useParams()
  const conversationId = Number(conversationIdStr)
  const { data: authUser } = useAuthUser()
  const { data: conversations } = useQuery(conversationsQueryOptions)
  const {
    data: messagesData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(messagesInfiniteQueryOptions(conversationId))
  const messages = messagesData?.pages.flat()
  const { sendTyping, typingUsers } = useChatWebSocket(conversationId)
  const sendMutation = useSendMessageMutation()
  const editMutation = useEditMessageMutation()
  const deleteMutation = useDeleteMessageMutation()
  const markReadMutation = useMarkReadMutation()

  const imageInputRef = useRef<HTMLInputElement>(null)
  const { upload: uploadImage, isPending: isUploading } = useUploadFile({
    route: "messages",
    api: `${env.VITE_API_URL}/upload`,
    onUploadComplete({ file }) {
      if (!authUser) return
      const imageUrl = `${env.VITE_STORAGE_PUBLIC_URL}/${file.objectInfo.key}`
      sendMutation.mutate({
        conversationId,
        imageUrl,
        messageType: "image",
        me: authUser,
      })
    },
  })

  // Infinite scroll: load older messages when sentinel enters viewport
  const loadMoreObserver = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(node)
      return () => observer.disconnect()
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  const [text, setText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const typingThrottleRef = useRef<number>(0)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null)

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
    editMutation.mutate({
      conversationId,
      messageId: msgId,
      content: trimmed,
    })
    setEditingId(null)
    setEditText("")
  }

  const conversation = conversations?.find((c) => c.id === conversationId)
  const otherUser = conversation?.otherUser

  useEffect(() => {
    if (conversationId) markReadMutation.mutate(conversationId)
    // Only re-fire when the conversation switches.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  if (!otherUser) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[#a8a8a8]">Conversation not found</p>
      </div>
    )
  }

  const handleSend = () => {
    if (!authUser) return
    const trimmed = text.trim()
    if (!trimmed) return
    sendMutation.mutate({
      conversationId,
      content: trimmed,
      messageType: "text",
      me: authUser,
    })
    setText("")
    inputRef.current?.focus()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    const now = Date.now()
    if (now - typingThrottleRef.current > 1000) {
      typingThrottleRef.current = now
      sendTyping()
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-[#262626] px-5 py-3">
        <img
          src={otherUser.avatarUrl ?? ""}
          alt={otherUser.username}
          className="size-11 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-white">
            {otherUser.displayName}
          </p>
          <p className="text-xs text-[#a8a8a8]">{formatLastSeen(otherUser.lastSeenAt)}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
          >
            <Phone size={20} />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
          >
            <Video size={20} />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
          >
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col-reverse gap-2 overflow-y-auto px-5 py-4">
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

        {messages?.map((msg) => {
          const isMe = msg.senderId === authUser?.id
          const isEditing = editingId === msg.id

          if (msg.deletedAt) {
            return (
              <div
                key={msg.id}
                className={cn("flex", isMe ? "justify-end" : "justify-start")}
              >
                {!isMe && (
                  <img
                    src={otherUser.avatarUrl ?? ""}
                    alt=""
                    className="mr-2 size-7 self-end rounded-full object-cover"
                  />
                )}
                <div className="max-w-[60%] rounded-2xl bg-[#262626]/50 px-4 py-2.5 text-sm italic text-[#a8a8a8]">
                  This message was deleted
                </div>
              </div>
            )
          }

          return (
            <div
              key={msg.id}
              className={cn(
                "group flex",
                isMe ? "justify-end" : "justify-start"
              )}
            >
              {!isMe && (
                <img
                  src={otherUser.avatarUrl ?? ""}
                  alt=""
                  className="mr-2 size-7 self-end rounded-full object-cover"
                />
              )}
              {isMe && !isEditing && (
                <div className="relative mr-1.5 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() =>
                      setMenuOpenId(menuOpenId === msg.id ? null : msg.id)
                    }
                    className="rounded-full p-1 text-[#a8a8a8] transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {menuOpenId === msg.id && (
                    <div className="absolute right-full mr-1 rounded-lg border border-[#363636] bg-[#262626] py-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => startEditing(msg.id, msg.content ?? "")}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/10"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteMutation.mutate({
                            conversationId,
                            messageId: msg.id,
                          })
                          setMenuOpenId(null)
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-white/10"
                      >
                        <X size={14} />
                        Unsend
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div
                className={cn(
                  "max-w-[60%] rounded-2xl px-4 py-2.5 text-sm",
                  isMe ? "bg-[#3797f0] text-white" : "bg-[#262626] text-white"
                )}
              >
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(msg.id)
                        if (e.key === "Escape") cancelEditing()
                      }}
                      className="w-full rounded bg-white/20 px-2 py-1.5 text-sm text-white placeholder:text-white/50 focus:outline-none"
                      autoFocus
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="rounded px-2 py-0.5 text-xs text-white/70 transition-colors hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(msg.id)}
                        className="rounded bg-white/20 px-2 py-0.5 text-xs text-white transition-colors hover:bg-white/30"
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
                          className="aspect-square w-56 object-cover"
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
                          className="size-20 rounded-full object-cover"
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
                            className="size-20 rounded-full object-cover"
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
                        className="max-w-56 rounded-lg"
                      />
                    ) : (
                      <p>{msg.content}</p>
                    )}
                    {msg.editedAt && (
                      <p className="mt-0.5 text-[10px] text-white/40">
                        (edited)
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}

        {/* Load more sentinel */}
        {hasNextPage && (
          <div ref={loadMoreObserver} className="flex justify-center py-4">
            {isFetchingNextPage && (
              <Loader2 className="size-4 animate-spin text-[#a8a8a8]" />
            )}
          </div>
        )}

        {/* Profile intro */}
        <div className="mb-4 flex flex-col items-center gap-2 py-6">
          <img
            src={otherUser.avatarUrl ?? ""}
            alt={otherUser.username}
            className="size-20 rounded-full object-cover"
          />
          <p className="text-lg font-bold text-white">
            {otherUser.displayName}
          </p>
          <p className="text-sm text-[#a8a8a8]">
            {otherUser.username} · Instagram
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[#262626] px-5 py-3">
        <div className="flex items-center gap-3 rounded-full border border-[#363636] px-4 py-2.5">
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
              <SendHorizontal size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploading}
              className="text-[#a8a8a8] transition-colors hover:text-white disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Image size={20} />
              )}
            </button>
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) uploadImage(file)
              e.target.value = ""
            }}
          />
        </div>
      </div>
    </div>
  )
}
