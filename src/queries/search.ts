import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { RecentSearch, SearchUser } from "../lib/types"

export const searchUsersQueryOptions = (query: string) =>
  queryOptions({
    queryKey: ["users", "search", query],
    queryFn: () => api.get<SearchUser[]>(`/users/search?q=${encodeURIComponent(query)}`),
    enabled: query.length > 0,
  })

export function useSearchUsersQuery(query: string) {
  return useQuery(searchUsersQueryOptions(query))
}

export const recentSearchesQueryOptions = queryOptions({
  queryKey: ["users", "search", "recent"],
  queryFn: () => api.get<RecentSearch[]>("/users/search/recent"),
})

export function useRecentSearchesQuery() {
  return useQuery(recentSearchesQueryOptions)
}

export function useRecordRecentSearchMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) =>
      api.post<{ success: boolean }>(`/users/search/recent/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "search", "recent"] })
    },
  })
}

export function useDeleteRecentSearchMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      api.delete<{ success: boolean }>(`/users/search/recent/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "search", "recent"] })
    },
  })
}

export function useClearRecentSearchesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      api.delete<{ success: boolean }>("/users/search/recent"),
    onSuccess: () => {
      queryClient.setQueryData(["users", "search", "recent"], [])
    },
  })
}
