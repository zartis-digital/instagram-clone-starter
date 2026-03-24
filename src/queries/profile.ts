import {
  infiniteQueryOptions,
  queryOptions,
} from "@tanstack/react-query"
import { api } from "../lib/api"
import type { PaginatedFeedResponse, UserProfile } from "../lib/types"

export function profileQueryOptions(username: string) {
  return queryOptions({
    queryKey: ["profile", username],
    queryFn: () => api.get<UserProfile>(`/users/${username}`),
  })
}

export function userPostsQueryOptions(username: string) {
  return infiniteQueryOptions({
    queryKey: ["userPosts", username],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams({ limit: "12" })
      if (pageParam) params.set("cursor", String(pageParam))
      return api.get<PaginatedFeedResponse>(`/users/${username}/posts?${params}`)
    },
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}

// TODO [Step 9]: Implement useProfileFollowMutation
// This hook should:
// 1. Call POST /users/:userId/follow
// 2. Optimistically update the profile cache (set followStatus, increment followersCount)
// 3. On error, revert the optimistic update
// 4. On settle, invalidate profile, userPosts, suggestions, and feed queries
// Hint: Use useMutation + useQueryClient from @tanstack/react-query
export function useProfileFollowMutation(_username: string) {
  return {
    mutate: (_userId: number) => {},
    isPending: false,
  }
}

// TODO [Step 9]: Implement useProfileUnfollowMutation
// This hook should:
// 1. Call DELETE /users/:userId/follow
// 2. Optimistically update the profile cache (set followStatus to "none", decrement followersCount)
// 3. On error, revert the optimistic update
// 4. On settle, invalidate profile, userPosts, suggestions, and feed queries
export function useProfileUnfollowMutation(_username: string) {
  return {
    mutate: (_userId: number) => {},
    isPending: false,
  }
}
