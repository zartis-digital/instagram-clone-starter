import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query"
import { api } from "../lib/api"
import type { AuthUser } from "./auth"

const MESSAGES_PAGE_SIZE = 30

export const conversationsQueryOptions = queryOptions({
  queryKey: ["conversations"],
  queryFn: async () => {
    try {
      return await api.get<Conversation[]>("/messages")
    } catch {
      return []
    }
  },
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchInterval: 30_000,
  staleTime: 10_000,
})

export function messagesInfiniteQueryOptions(conversationId: number) {
  return infiniteQueryOptions({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ limit: String(MESSAGES_PAGE_SIZE) })
      if (pageParam) params.set("cursor", String(pageParam))
      return api.get<Message[]>(
        `/messages/${conversationId}/messages?${params}`
      )
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length < MESSAGES_PAGE_SIZE) return undefined
      return lastPage[lastPage.length - 1]?.id
    },
    enabled: conversationId > 0,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  })
}

// Types matching the API response shape

export interface ConversationUser {
  id: number
  username: string
  displayName: string
  avatarUrl: string | null
  lastSeenAt?: string | null
}

export interface SharedPost {
  id: number
  imageUrl: string
  caption: string | null
  user: {
    id: number
    username: string
    displayName: string
    avatarUrl: string | null
  }
  images: { id: number; imageUrl: string; position: number }[]
}

export interface SharedStory {
  id: number
  user: {
    id: number
    username: string
    displayName: string
    avatarUrl: string | null
  }
  segments: {
    id: number
    mediaUrl: string
    mediaType: string
    position: number
  }[]
}

export interface Message {
  id: number
  conversationId: number
  senderId: number
  content: string | null
  imageUrl: string | null
  sharedPostId: number | null
  sharedStoryId: number | null
  messageType: string
  editedAt?: string | null
  createdAt: string
  deletedAt?: string | null
  sender?: ConversationUser
  sharedPost?: SharedPost | null
  sharedStory?: SharedStory | null
}

export interface Conversation {
  id: number
  user1Id: number
  user2Id: number
  createdAt: string
  lastMessage: Message | null
  unreadCount: number
  otherUser?: ConversationUser
}

export type MessagesCache = InfiniteData<Message[], number | undefined>

export function getMessagePreviewText(msg: Message): string {
  switch (msg.messageType) {
    case "post_share":
      return "Shared a post"
    case "story_share":
      return "Shared a story"
    case "story_reply":
      return "Replied to a story"
    case "image":
      return "Sent a photo"
    default:
      return msg.content ?? ""
  }
}

export const unreadMessagesCountQueryOptions = queryOptions({
  queryKey: ["messages", "unread-count"],
  queryFn: () => api.get<{ count: number }>("/messages/unread-count"),
  refetchInterval: 30_000,
  refetchOnWindowFocus: true,
})

export function useUnreadMessagesCount() {
  const { data } = useQuery(unreadMessagesCountQueryOptions)
  return data?.count ?? 0
}

export function useNewConversationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      recipientId: number
      content: string
      messageType?: string
      sharedPostId?: number
    }) =>
      api.post<Conversation>("/messages", {
        recipientId: data.recipientId,
        content: data.content,
        messageType: data.messageType ?? "text",
        sharedPostId: data.sharedPostId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}

interface SendMessageInput {
  conversationId: number
  content?: string
  imageUrl?: string
  sharedPostId?: number
  sharedStoryId?: number
  messageType?: string
  me: AuthUser
}

interface OptimisticContext {
  tempId: number
  previous: MessagesCache | undefined
}

let nextTempId = -1

function buildOptimisticMessage(input: SendMessageInput, tempId: number): Message {
  return {
    id: tempId,
    conversationId: input.conversationId,
    senderId: input.me.id,
    content: input.content ?? null,
    imageUrl: input.imageUrl ?? null,
    sharedPostId: input.sharedPostId ?? null,
    sharedStoryId: input.sharedStoryId ?? null,
    messageType: input.messageType ?? "text",
    createdAt: new Date().toISOString(),
    sender: {
      id: input.me.id,
      username: input.me.username,
      displayName: input.me.displayName,
      avatarUrl: input.me.avatarUrl,
    },
  }
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation<Message, Error, SendMessageInput, OptimisticContext>({
    mutationFn: (input) =>
      api.post<Message>(`/messages/${input.conversationId}/messages`, {
        content: input.content,
        imageUrl: input.imageUrl,
        sharedPostId: input.sharedPostId,
        sharedStoryId: input.sharedStoryId,
        messageType: input.messageType ?? "text",
      }),
    onMutate: async (input) => {
      const queryKey = ["messages", input.conversationId]
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<MessagesCache>(queryKey)
      const tempId = nextTempId--
      const optimistic = buildOptimisticMessage(input, tempId)

      queryClient.setQueryData<MessagesCache>(queryKey, (old) => {
        if (!old) {
          return {
            pageParams: [undefined],
            pages: [[optimistic]],
          }
        }
        const [firstPage, ...rest] = old.pages
        return {
          ...old,
          pages: [[optimistic, ...(firstPage ?? [])], ...rest],
        }
      })

      return { tempId, previous }
    },
    onError: (_err, input, context) => {
      if (!context) return
      queryClient.setQueryData<MessagesCache>(
        ["messages", input.conversationId],
        context.previous
      )
    },
    onSuccess: (real, input, context) => {
      // Replace the optimistic placeholder with the real server message.
      queryClient.setQueryData<MessagesCache>(
        ["messages", input.conversationId],
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((msg) => (msg.id === context.tempId ? real : msg))
            ),
          }
        }
      )
    },
    onSettled: (_data, _err, input) => {
      // Always re-sync after success or rollback.
      queryClient.invalidateQueries({ queryKey: ["messages", input.conversationId] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      queryClient.invalidateQueries({ queryKey: ["messages", "unread-count"] })
    },
  })
}

interface EditMessageInput {
  conversationId: number
  messageId: number
  content: string
}

export function useEditMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation<Message, Error, EditMessageInput, { previous: MessagesCache | undefined }>({
    mutationFn: (input) =>
      api.put<Message>(
        `/messages/${input.conversationId}/messages/${input.messageId}`,
        { content: input.content }
      ),
    onMutate: async (input) => {
      const queryKey = ["messages", input.conversationId]
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<MessagesCache>(queryKey)
      const editedAt = new Date().toISOString()
      queryClient.setQueryData<MessagesCache>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((m) =>
              m.id === input.messageId
                ? { ...m, content: input.content, editedAt }
                : m
            )
          ),
        }
      })
      return { previous }
    },
    onError: (_err, input, context) => {
      if (!context) return
      queryClient.setQueryData<MessagesCache>(
        ["messages", input.conversationId],
        context.previous
      )
    },
    onSettled: (_data, _err, input) => {
      queryClient.invalidateQueries({ queryKey: ["messages", input.conversationId] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}

interface DeleteMessageInput {
  conversationId: number
  messageId: number
}

export function useDeleteMessageMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ success: true }, Error, DeleteMessageInput, { previous: MessagesCache | undefined }>({
    mutationFn: (input) =>
      api.delete<{ success: true }>(
        `/messages/${input.conversationId}/messages/${input.messageId}`
      ),
    onMutate: async (input) => {
      const queryKey = ["messages", input.conversationId]
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<MessagesCache>(queryKey)
      const deletedAt = new Date().toISOString()
      queryClient.setQueryData<MessagesCache>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) =>
            page.map((m) =>
              m.id === input.messageId ? { ...m, deletedAt } : m
            )
          ),
        }
      })
      return { previous }
    },
    onError: (_err, input, context) => {
      if (!context) return
      queryClient.setQueryData<MessagesCache>(
        ["messages", input.conversationId],
        context.previous
      )
    },
    onSettled: (_data, _err, input) => {
      queryClient.invalidateQueries({ queryKey: ["messages", input.conversationId] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}

interface MarkReadContext {
  previousConversations: Conversation[] | undefined
  previousUnread: { count: number } | undefined
}

export function useMarkReadMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ success: true }, Error, number, MarkReadContext>({
    mutationFn: (conversationId) =>
      api.post<{ success: true }>(`/messages/${conversationId}/read`),
    onMutate: async (conversationId) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] })
      await queryClient.cancelQueries({ queryKey: ["messages", "unread-count"] })

      const previousConversations =
        queryClient.getQueryData<Conversation[]>(["conversations"])
      const previousUnread = queryClient.getQueryData<{ count: number }>([
        "messages",
        "unread-count",
      ])

      const target = previousConversations?.find((c) => c.id === conversationId)
      const clearedCount = target?.unreadCount ?? 0

      if (previousConversations) {
        queryClient.setQueryData<Conversation[]>(["conversations"], (old) =>
          old?.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          )
        )
      }

      if (previousUnread) {
        queryClient.setQueryData<{ count: number }>(
          ["messages", "unread-count"],
          { count: Math.max(0, previousUnread.count - clearedCount) }
        )
      }

      return { previousConversations, previousUnread }
    },
    onError: (_err, _conversationId, context) => {
      if (!context) return
      if (context.previousConversations) {
        queryClient.setQueryData(["conversations"], context.previousConversations)
      }
      if (context.previousUnread) {
        queryClient.setQueryData(["messages", "unread-count"], context.previousUnread)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
      queryClient.invalidateQueries({ queryKey: ["messages", "unread-count"] })
    },
  })
}
