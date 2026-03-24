import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { api, ApiError } from "../lib/api"

export interface AuthUser {
  id: number
  username: string
  displayName: string
  email: string
  avatarUrl: string | null
  bio: string | null
  isPrivate: boolean
  createdAt: string
}

export const authUserQueryOptions = queryOptions({
  queryKey: ["authUser"],
  queryFn: async (): Promise<AuthUser | null> => {
    try {
      return await api.get<AuthUser>("/auth/me")
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return null
      throw e
    }
  },
  staleTime: 60_000,
})

export function useAuthUser() {
  return useQuery(authUserQueryOptions)
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<AuthUser>("/auth/login", data),
    onSuccess: (user) => {
      queryClient.setQueryData(["authUser"], user)
      router.navigate({ to: "/" })
    },
  })
}

export function useRegisterMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: {
      email: string
      password: string
      username: string
      displayName: string
    }) => api.post<AuthUser>("/auth/register", data),
    onSuccess: (user) => {
      queryClient.setQueryData(["authUser"], user)
      router.navigate({ to: "/" })
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null)
      router.navigate({ to: "/sign-in" })
    },
  })
}
