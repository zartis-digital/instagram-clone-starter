import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../lib/api"

// TODO [Step 7]: Implement useCreatePostMutation
// This hook should:
// 1. Use useMutation from @tanstack/react-query
// 2. Call POST /posts with { imageUrls, caption }
// 3. On success, invalidate feed, explore, profile, and userPosts queries
// Hint: Use api.post from ../lib/api
export function useCreatePostMutation() {
  return {
    mutate: (
      _data: { imageUrls: string[]; caption?: string },
      _options?: { onSuccess?: () => void }
    ) => {},
    isPending: false,
  }
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
