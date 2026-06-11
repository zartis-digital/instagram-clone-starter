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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) =>
      api.post<{ success: boolean; liked: boolean }>(`/posts/${postId}/like`),

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["feed"] })
      await queryClient.cancelQueries({ queryKey: ["post", String(postId)] })

      const previousFeed = queryClient.getQueryData(["feed"])
      const previousPost = queryClient.getQueryData(["post", String(postId)])

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
                  ? {
                      ...post,
                      likedByMe: !post.likedByMe,
                      likeCount: post.likedByMe ? post.likeCount - 1 : post.likeCount + 1,
                    }
                  : post
              ),
            })),
          }
        }
      )

      queryClient.setQueryData(
        ["post", String(postId)],
        (old: PostDetail | undefined) => {
          if (!old) return old
          return {
            ...old,
            likedByMe: !old.likedByMe,
            likeCount: old.likedByMe ? old.likeCount - 1 : old.likeCount + 1,
          }
        }
      )

      return { previousFeed, previousPost }
    },

    onError: (_err, postId, context) => {
      if (context?.previousFeed) queryClient.setQueryData(["feed"], context.previousFeed)
      if (context?.previousPost) queryClient.setQueryData(["post", String(postId)], context.previousPost)
    },

    onSettled: (_data, _err, postId) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] })
    },
  })
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

export function useCommentLikeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId, liked }: { postId: number; commentId: number; liked: boolean }) =>
      liked
        ? api.delete<{ success: boolean }>(`/posts/${postId}/comments/${commentId}/like`)
        : api.post<{ success: boolean }>(`/posts/${postId}/comments/${commentId}/like`),

    onMutate: async ({ postId, commentId, liked }) => {
      await queryClient.cancelQueries({ queryKey: ["post", String(postId)] })
      const previous = queryClient.getQueryData(["post", String(postId)])

      queryClient.setQueryData(
        ["post", String(postId)],
        (old: PostDetail | undefined) => {
          if (!old) return old
          return {
            ...old,
            comments: old.comments.map((c) =>
              c.id === commentId ? { ...c, likedByMe: !liked } : c
            ),
          }
        }
      )

      return { previous }
    },

    onError: (_err, { postId }, context) => {
      if (context?.previous) queryClient.setQueryData(["post", String(postId)], context.previous)
    },

    onSettled: (_data, _err, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] })
    },
  })
}

export function useCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, content }: { postId: number; content: string }) =>
      api.post<{ success: boolean }>(`/posts/${postId}/comments`, { content }),

    onSettled: (_data, _err, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] })
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    },
  })
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      api.delete<{ success: boolean }>(`/posts/${postId}/comments/${commentId}`),

    onMutate: async ({ postId, commentId }) => {
      await queryClient.cancelQueries({ queryKey: ["post", String(postId)] })
      const previous = queryClient.getQueryData(["post", String(postId)])

      queryClient.setQueryData(
        ["post", String(postId)],
        (old: PostDetail | undefined) => {
          if (!old) return old
          return { ...old, comments: old.comments.filter((c) => c.id !== commentId) }
        }
      )

      return { previous }
    },

    onError: (_err, { postId }, context) => {
      if (context?.previous) queryClient.setQueryData(["post", String(postId)], context.previous)
    },

    onSettled: (_data, _err, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] })
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    },
  })
}
