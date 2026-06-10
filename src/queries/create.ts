import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api"

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      imageUrls: string[]
      caption?: string
      location?: string
      altText?: string
      hideLikes?: boolean
      hideComments?: boolean
    }) => api.post("/posts", data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] })
      queryClient.invalidateQueries({ queryKey: ["explore"] })
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      queryClient.invalidateQueries({ queryKey: ["userPosts"] })
    },
  })
}

export function useCreateStoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      segments: { mediaUrl: string; mediaType: "image" | "video" }[]
    }) => api.post("/stories", data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] })
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}
