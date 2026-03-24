import { createContext, useCallback, useContext, useState } from "react"

export type WidgetView = "closed" | "inbox" | "chat"

export interface ChatUser {
  id: number
  username: string
  displayName: string
  avatarUrl: string | null
}

interface MessagesContextValue {
  view: WidgetView
  chatUser: ChatUser | null
  conversationId: number | null
  openInbox: () => void
  openChat: (user: ChatUser, conversationId: number) => void
  goBack: () => void
  close: () => void
}

const MessagesContext = createContext<MessagesContextValue | null>(null)

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<WidgetView>("closed")
  const [chatUser, setChatUser] = useState<ChatUser | null>(null)
  const [conversationId, setConversationId] = useState<number | null>(null)

  const openInbox = useCallback(() => {
    setView("inbox")
    setChatUser(null)
    setConversationId(null)
  }, [])

  const openChat = useCallback((user: ChatUser, convId: number) => {
    setChatUser(user)
    setConversationId(convId)
    setView("chat")
  }, [])

  const goBack = useCallback(() => {
    setView("inbox")
    setChatUser(null)
    setConversationId(null)
  }, [])

  const close = useCallback(() => {
    setView("closed")
    setChatUser(null)
    setConversationId(null)
  }, [])

  return (
    <MessagesContext
      value={{ view, chatUser, conversationId, openInbox, openChat, goBack, close }}
    >
      {children}
    </MessagesContext>
  )
}

export function useMessages() {
  const ctx = useContext(MessagesContext)
  if (!ctx) throw new Error("useMessages must be used within MessagesProvider")
  return ctx
}
