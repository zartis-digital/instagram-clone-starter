import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSearchUsersQuery } from "../../queries/search"
import { useNewConversationMutation } from "../../queries/messages"
import type { SearchUser } from "../../lib/types"

export function NewMessageDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const { data: results = [] } = useSearchUsersQuery(search)
  const sendMutation = useNewConversationMutation()

  function handleSelectUser(user: SearchUser) {
    setSelectedUser(user)
    setSearch("")
  }

  function handleClearSelected() {
    setSelectedUser(null)
  }

  function handleSend() {
    if (!selectedUser || !message.trim()) return

    sendMutation.mutate(
      { recipientId: selectedUser.id, content: message.trim() },
      {
        onSuccess: (conversation) => {
          onOpenChange(false)
          setSearch("")
          setSelectedUser(null)
          setMessage("")
          navigate({
            to: "/direct/$conversationId",
            params: { conversationId: String(conversation.id) },
          })
        },
      }
    )
  }

  function handleClose(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      setSearch("")
      setSelectedUser(null)
      setMessage("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton
        className="flex max-h-[480px] flex-col gap-0 overflow-hidden rounded-xl border border-[#363636] bg-[#262626] p-0 sm:max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-center border-b border-[#363636] px-4 py-3">
          <DialogTitle className="text-base font-bold text-white">
            New message
          </DialogTitle>
        </div>

        {/* To: field */}
        <div className="flex items-center gap-2 border-b border-[#363636] px-4 py-2">
          <span className="text-sm font-semibold text-white">To:</span>
          {selectedUser ? (
            <div className="flex items-center gap-1.5 rounded-xl bg-[#e0f1ff]/15 px-3 py-1">
              <span className="text-sm font-semibold text-[#0095f6]">
                {selectedUser.username}
              </span>
              <button
                type="button"
                onClick={handleClearSelected}
                className="text-[#0095f6]"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-1 text-sm text-white placeholder-[#a8a8a8] outline-none"
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Search results or message input */}
        <div className="flex min-h-0 flex-1 flex-col">
          {!selectedUser ? (
            <div className="flex-1 overflow-y-auto">
              {search && results.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-[#a8a8a8]">
                  No account found.
                </p>
              )}
              {results.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectUser(user)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-white/5"
                >
                  <img
                    src={user.avatarUrl ?? ""}
                    alt={user.username}
                    className="size-11 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.displayName}
                    </p>
                    <p className="truncate text-sm text-[#a8a8a8]">
                      {user.username}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col justify-end p-4">
              <div className="flex items-end gap-2">
                <textarea
                  placeholder="Message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  rows={3}
                  className="flex-1 resize-none rounded-xl border border-[#363636] bg-transparent px-4 py-3 text-sm text-white placeholder-[#a8a8a8] outline-none focus:border-[#a8a8a8]"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!message.trim() || sendMutation.isPending}
                  className="rounded-lg bg-[#0095f6] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1877f2] disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
