import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "../lib/api"
import type { FeedStory } from "../lib/types"

export const feedStoriesQueryOptions = queryOptions({
  queryKey: ["stories", "feed"],
  queryFn: () => api.get<FeedStory[]>("/stories/feed"),
})

export const myStoriesQueryOptions = queryOptions({
  queryKey: ["stories", "me"],
  queryFn: () => api.get<FeedStory[]>("/stories/me"),
})

export function useFeedStoriesQuery() {
  return useQuery(feedStoriesQueryOptions)
}

export function useMyStoriesQuery() {
  return useQuery(myStoriesQueryOptions)
}

export function useAllStories() {
  const { data: myStories, isLoading: myLoading } = useMyStoriesQuery()
  const { data: feedStories, isLoading: feedLoading } = useFeedStoriesQuery()

  const allStories: FeedStory[] = [...(myStories ?? []), ...(feedStories ?? [])]
  return { allStories, isLoading: myLoading || feedLoading }
}

export function useRecordStoryViewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (storyId: number) => api.get(`/stories/${storyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", "feed"] })
    },
  })
}

export function useStoryLikeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (storyId: number) =>
      api.post<{ success: boolean }>(`/stories/${storyId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] })
    },
  })
}

export function useStoryUnlikeMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (storyId: number) =>
      api.delete<{ success: boolean }>(`/stories/${storyId}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] })
    },
  })
}

export function useStoryReplyMutation() {
  return useMutation({
    mutationFn: ({
      storyId,
      content,
    }: {
      storyId: number
      content: string
    }) => api.post(`/stories/${storyId}/reply`, { content }),
  })
}

export function useDeleteStoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (storyId: number) =>
      api.delete<{ success: boolean }>(`/stories/${storyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] })
    },
  })
}
