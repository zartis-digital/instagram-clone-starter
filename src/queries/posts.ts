import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "../lib/api"
import type { PaginatedFeedResponse, PostDetail, SavedPost } from "../lib/types"

export function postQueryOptions(postId: string) {
  return queryOptions({
    queryKey: ["post", postId],
    queryFn: () => api.get<PostDetail>(`/posts/${postId}`),
    enabled: !!postId,
  })
}

export function usePostQuery(postId: string) {
  return useQuery(postQueryOptions(postId))
}

export const feedQueryOptions = infiniteQueryOptions({
  queryKey: ["feed"],
  queryFn: ({ pageParam }) => {
    const params = new URLSearchParams({ limit: "10" })
    if (pageParam) params.set("cursor", String(pageParam))
    return api.get<PaginatedFeedResponse>(`/posts?${params}`)
  },
  initialPageParam: null as number | null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})

export function useFeedQuery() {
  return useInfiniteQuery(feedQueryOptions)
}

export const exploreQueryOptions = infiniteQueryOptions({
  queryKey: ["explore"],
  queryFn: ({ pageParam }) => {
    const params = new URLSearchParams({ limit: "20" })
    if (pageParam) params.set("cursor", String(pageParam))
    return api.get<PaginatedFeedResponse>(`/posts/explore?${params}`)
  },
  initialPageParam: null as number | null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})

export function useExploreQuery() {
  return useInfiniteQuery(exploreQueryOptions)
}

export const savedPostsQueryOptions = queryOptions({
  queryKey: ["savedPosts"],
  queryFn: () => api.get<SavedPost[]>("/posts/saved"),
})

export function useSavedPostsQuery() {
  return useQuery(savedPostsQueryOptions)
}

export function useLikeMutation() {
  // TODO: mutation implementation removed
  return {
    mutate: () => {},
    isPending: false,
    isError: false,
    error: null,
  }
}

export function useSaveMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) =>
      api.post<{ success: boolean; saved: boolean }>(`/posts/${postId}/save`),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] })
      const previous =
        queryClient.getQueryData<typeof feedQueryOptions>(["feed"])

      queryClient.setQueryData(
        ["feed"],
        (old: { pages: PaginatedFeedResponse[]; pageParams: unknown[] } | undefined) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post.id === postId
                  ? { ...post, savedByMe: !post.savedByMe }
                  : post
              ),
            })),
          }
        }
      )

      return { previous }
    },

    onError: (_err, _postId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["feed"], context.previous)
      }
    },

    onSettled: (_data, _err, postId) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] })
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] })
    },
  })
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) =>
      api.delete<{ success: boolean }>(`/posts/${postId}`),

    onSettled: (_data, _err, postId) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
      queryClient.invalidateQueries({ queryKey: ["explore"] })
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] })
    },
  })
}

// TODO [Step 8]: Implement useCommentLikeMutation
// This hook should:
// 1. If liked, call DELETE /posts/:postId/comments/:commentId/like
// 2. If not liked, call POST /posts/:postId/comments/:commentId/like
// 3. On success, invalidate the post query
export function useCommentLikeMutation() {
  return {
    mutate: (_data: {
      postId: number
      commentId: number
      liked: boolean
    }) => {},
    isPending: false,
  }
}

// TODO [Step 8]: Implement useCommentMutation
// This hook should:
// 1. Call POST /posts/:postId/comments with { content }
// 2. On success, invalidate the post query and feed query
export function useCommentMutation() {
  return {
    mutate: (
      _data: { postId: number; content: string },
      _options?: { onSuccess?: () => void }
    ) => {},
    isPending: false,
  }
}
