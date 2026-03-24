import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthUser } from "../queries/auth"
import { env } from "../env"

const WS_BASE = env.VITE_WS_URL
const MAX_RECONNECT_DELAY = 30_000

/**
 * Connects a single user-level WebSocket to `/ws/users/me` while the user is
 * authenticated. Receives push events that should reach the user regardless of
 * which page they have open — currently `conversation_updated`, used to keep
 * the inbox list and unread count fresh in real-time.
 *
 * Mounted once from the root layout; the per-conversation WS in
 * `useChatWebSocket` is independent and complementary.
 */
export function useUserWebSocket() {
  const { data: authUser } = useAuthUser()
  const queryClient = useQueryClient()
  const userId = authUser?.id ?? null
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!userId) return

    let cancelled = false
    let reconnectAttempt = 0
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    function connect() {
      if (cancelled) return
      const ws = new WebSocket(`${WS_BASE}/ws/users/me`)
      wsRef.current = ws

      ws.addEventListener("open", () => {
        reconnectAttempt = 0
      })

      ws.addEventListener("close", () => {
        if (cancelled) return
        const delay = Math.min(
          1000 * 2 ** reconnectAttempt,
          MAX_RECONNECT_DELAY
        )
        reconnectAttempt++
        reconnectTimer = setTimeout(connect, delay)
      })

      ws.addEventListener("message", (event) => {
        let data: { type?: string; senderId?: number }
        try {
          data = JSON.parse(event.data)
        } catch {
          return
        }

        switch (data.type) {
          case "conversation_updated": {
            // A new message landed somewhere this user participates in.
            // Refresh the inbox + unread badge. The per-conversation WS,
            // if open for that conversation, has already patched the
            // messages cache directly — this is the inbox-side complement.
            queryClient.invalidateQueries({ queryKey: ["conversations"] })
            if (data.senderId !== userId) {
              queryClient.invalidateQueries({
                queryKey: ["messages", "unread-count"],
              })
            }
            break
          }
        }
      })
    }

    connect()

    return () => {
      cancelled = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [userId, queryClient])
}
