// TODO [Step 6]: Implement useUpdateProfileMutation
// This hook should:
// 1. Use useMutation from @tanstack/react-query
// 2. Call PATCH /users/me with { displayName?, bio?, avatarUrl?, isPrivate? }
// 3. On success, update the "authUser" query cache and invalidate "profile" queries
// Hint: Use api.patch from ../lib/api
export function useUpdateProfileMutation() {
  return {
    mutate: (
      _data: {
        displayName?: string
        bio?: string
        avatarUrl?: string
        isPrivate?: boolean
      },
      _options?: { onSuccess?: () => void }
    ) => {},
    isPending: false,
  }
}
