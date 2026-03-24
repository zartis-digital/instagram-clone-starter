import { createFileRoute } from "@tanstack/react-router"
import { SendHorizontal } from "lucide-react"
import { useNewMessage } from "../../components/messages/new-message-context"

export const Route = createFileRoute("/direct/inbox")({
  component: InboxEmpty,
})

function InboxEmpty() {
  const openNewMessage = useNewMessage()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <div className="flex size-24 items-center justify-center rounded-full border-2 border-white">
        <SendHorizontal size={44} className="text-white" />
      </div>
      <h2 className="mt-3 text-xl font-semibold text-white">Your messages</h2>
      <p className="text-sm text-[#a8a8a8]">
        Send a message to start a chat.
      </p>
      <button
        type="button"
        onClick={openNewMessage}
        className="mt-3 rounded-lg bg-[#0095f6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1877f2]"
      >
        Send message
      </button>
    </div>
  )
}
