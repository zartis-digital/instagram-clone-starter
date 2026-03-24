import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "../lib/api"
import type { PaginatedNotificationsResponse } from "../lib/types"

export const notificationsQueryOptions = infiniteQueryOptions({
  queryKey: ["notifications"],
  queryFn: ({ pageParam }) => {
    const params = new URLSearchParams({ limit: "20" })
    if (pageParam) params.set("cursor", String(pageParam))
    return api.get<PaginatedNotificationsResponse>(
      `/notifications?${params}`
    )
  },
  initialPageParam: null as number | null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})

export function useNotificationsQuery(enabled = true) {
  return useInfiniteQuery({
    ...notificationsQueryOptions,
    enabled,
    refetchInterval: enabled ? 30_000 : false,
  })
}

export const unreadCountQueryOptions = queryOptions({
  queryKey: ["notifications", "unread-count"],
  queryFn: () => api.get<{ count: number }>("/notifications/unread-count"),
  refetchInterval: 30_000,
})

export function useUnreadCountQuery() {
  return useQuery(unreadCountQueryOptions)
}

export function useMarkReadMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.post<{ success: boolean }>("/notifications/read"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      })
    },
  })
}
