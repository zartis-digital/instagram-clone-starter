import { queryOptions, useQuery } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { FollowRequest } from "../lib/types"

export const followRequestsQueryOptions = queryOptions({
  queryKey: ["followRequests"],
  queryFn: () => api.get<FollowRequest[]>("/users/me/follow-requests"),
})

export function useFollowRequestsQuery() {
  return useQuery(followRequestsQueryOptions)
}

// TODO [Step 9]: Implement useAcceptFollowRequestMutation
// This hook should:
// 1. Call POST /users/me/follow-requests/:requesterId/accept
// 2. On success, invalidate followRequests, notifications, profile, and feed queries
export function useAcceptFollowRequestMutation() {
  return {
    mutate: (
      _requesterId: number,
      _options?: { onSuccess?: () => void }
    ) => {},
    isPending: false,
  }
}

// TODO [Step 9]: Implement useRejectFollowRequestMutation
// This hook should:
// 1. Call POST /users/me/follow-requests/:requesterId/reject
// 2. On success, invalidate followRequests queries
export function useRejectFollowRequestMutation() {
  return {
    mutate: (
      _requesterId: number,
      _options?: { onSuccess?: () => void }
    ) => {},
    isPending: false,
  }
}
