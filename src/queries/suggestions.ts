import { queryOptions, useQuery } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { SuggestedUser } from "../lib/types"

export const suggestionsQueryOptions = queryOptions({
  queryKey: ["suggestions"],
  queryFn: () => api.get<SuggestedUser[]>("/users/suggested"),
})

export function useSuggestionsQuery() {
  return useQuery(suggestionsQueryOptions)
}

// TODO [Step 9]: Implement useFollowMutation for suggestion cards
// This hook should:
// 1. Call POST /users/:userId/follow
// 2. On success, invalidate suggestions, profile, and feed queries
export function useFollowMutation() {
  return {
    mutate: (
      _userId: number,
      _options?: {
        onSuccess?: (data: {
          success: boolean
          status: "following" | "requested"
        }) => void
      }
    ) => {},
    isPending: false,
  }
}

// TODO [Step 9]: Implement useUnfollowMutation for suggestion cards
// This hook should:
// 1. Call DELETE /users/:userId/follow
// 2. On success, invalidate suggestions, profile, and feed queries
export function useUnfollowMutation() {
  return {
    mutate: (
      _userId: number,
      _options?: { onSuccess?: () => void }
    ) => {},
    isPending: false,
  }
}
