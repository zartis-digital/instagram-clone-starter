import { useState } from "react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSearchUsersQuery } from "../../queries/search"
import { useNewConversationMutation } from "../../queries/messages"
import type { SearchUser } from "../../lib/types"

export function SharePostDialog({
  postId,
  open,
  onOpenChange,
}: {
  postId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null)
  const { data: results = [] } = useSearchUsersQuery(search)
  const sendMutation = useNewConversationMutation()

  function handleSend() {
    if (!selectedUser) return
    sendMutation.mutate(
      {
        recipientId: selectedUser.id,
        content: "",
        messageType: "post_share",
        sharedPostId: postId,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          resetState()
        },
      }
    )
  }

  function resetState() {
    setSearch("")
    setSelectedUser(null)
  }

  function handleClose(next: boolean) {
    onOpenChange(next)
    if (!next) resetState()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[480px] flex-col gap-0 overflow-hidden rounded-xl border border-[#363636] bg-[#262626] p-0 sm:max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#363636] px-4 py-3">
          <div className="size-5" />
          <DialogTitle className="text-base font-bold text-white">
            Share
          </DialogTitle>
          <button type="button" onClick={() => handleClose(false)}>
            <X className="size-5 text-white" />
          </button>
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
                onClick={() => setSelectedUser(null)}
                className="text-[#0095f6]"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent py-1 text-sm text-white placeholder-[#a8a8a8] outline-none"
              autoFocus
            />
          )}
        </div>

        {/* Search results */}
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
                  onClick={() => {
                    setSelectedUser(user)
                    setSearch("")
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-white/5"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="size-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-11 items-center justify-center rounded-full bg-neutral-700 text-sm font-bold text-white">
                      {user.username[0]?.toUpperCase()}
                    </div>
                  )}
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
            <div className="flex flex-1 items-end justify-center p-4">
              <button
                type="button"
                onClick={handleSend}
                disabled={sendMutation.isPending}
                className="w-full rounded-lg bg-[#0095f6] py-2.5 text-sm font-semibold text-white hover:bg-[#1877f2] disabled:opacity-50"
              >
                {sendMutation.isPending ? "Sending..." : "Send"}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
