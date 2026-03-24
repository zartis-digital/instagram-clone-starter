import { useEffect, useRef, useState, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import type { Message, MessagesCache } from "../queries/messages"
import { env } from "../env"

const WS_BASE = env.VITE_WS_URL
const MAX_RECONNECT_DELAY = 30_000

interface TypingUser {
  id: number
  username: string
}

interface UseChatWebSocketReturn {
  isConnected: boolean
  sendTyping: () => void
  typingUsers: TypingUser[]
}

/**
 * Real-time receive channel for a conversation.
 *
 * Persistence is handled by REST mutations in `queries/messages.ts`. This hook
 * subscribes to server-pushed events for OTHER participants' actions and
 * patches the local cache. We dedupe by message id so the sender's own REST
 * response and any echoed broadcast cannot duplicate a message.
 */
export function useChatWebSocket(
  conversationId: number | null
): UseChatWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const typingTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  )
  const shouldReconnectRef = useRef(true)
  const reconnectAttemptRef = useRef(0)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!conversationId) return

    shouldReconnectRef.current = true
    reconnectAttemptRef.current = 0

    function connect() {
      const ws = new WebSocket(
        `${WS_BASE}/ws/conversations/${conversationId}`
      )
      wsRef.current = ws

      ws.addEventListener("open", () => {
        setIsConnected(true)
        reconnectAttemptRef.current = 0
      })

      ws.addEventListener("close", () => {
        setIsConnected(false)
        if (shouldReconnectRef.current) {
          const delay = Math.min(
            1000 * 2 ** reconnectAttemptRef.current,
            MAX_RECONNECT_DELAY
          )
          reconnectAttemptRef.current++
          reconnectTimerRef.current = setTimeout(connect, delay)
        }
      })

      ws.addEventListener("message", (event) => {
        const data = JSON.parse(event.data)

        switch (data.type) {
          case "new_message": {
            const msg = data.message as Message
            queryClient.setQueryData<MessagesCache>(
              ["messages", conversationId],
              (old) => {
                if (!old) return old
                // Dedupe: if this message id is already in any page (from our
                // own REST response or a previous echo), skip it.
                for (const page of old.pages) {
                  if (page.some((m) => m.id === msg.id)) return old
                }
                const [firstPage, ...rest] = old.pages
                return {
                  ...old,
                  pages: [[msg, ...(firstPage ?? [])], ...rest],
                }
              }
            )
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
            queryClient.invalidateQueries({
              queryKey: ["messages", "unread-count"],
            })
            break
          }

          case "typing": {
            const user = data.user as TypingUser
            setTypingUsers((prev) => {
              if (prev.some((u) => u.id === user.id)) return prev
              return [...prev, user]
            })
            const existing = typingTimersRef.current.get(user.id)
            if (existing) clearTimeout(existing)
            typingTimersRef.current.set(
              user.id,
              setTimeout(() => {
                setTypingUsers((prev) => prev.filter((u) => u.id !== user.id))
                typingTimersRef.current.delete(user.id)
              }, 3000)
            )
            break
          }

          case "message_edited": {
            queryClient.setQueryData<MessagesCache>(
              ["messages", conversationId],
              (old) => {
                if (!old) return old
                return {
                  ...old,
                  pages: old.pages.map((page) =>
                    page.map((msg) =>
                      msg.id === data.messageId
                        ? { ...msg, content: data.content, editedAt: data.editedAt }
                        : msg
                    )
                  ),
                }
              }
            )
            break
          }

          case "message_deleted": {
            const deletedId = data.messageId as number
            queryClient.setQueryData<MessagesCache>(
              ["messages", conversationId],
              (old) => {
                if (!old) return old
                return {
                  ...old,
                  pages: old.pages.map((page) =>
                    page.map((m) =>
                      m.id === deletedId
                        ? { ...m, deletedAt: new Date().toISOString() }
                        : m
                    )
                  ),
                }
              }
            )
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
            break
          }

          case "read_receipt": {
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
            queryClient.invalidateQueries({
              queryKey: ["messages", "unread-count"],
            })
            break
          }
        }
      })
    }

    connect()

    return () => {
      shouldReconnectRef.current = false
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
      wsRef.current?.close()
      wsRef.current = null
      setIsConnected(false)
      setTypingUsers([])
      for (const timer of typingTimersRef.current.values()) {
        clearTimeout(timer)
      }
      typingTimersRef.current.clear()
    }
  }, [conversationId, queryClient])

  const sendTyping = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "typing" }))
    }
  }, [])

  return { isConnected, sendTyping, typingUsers }
}
