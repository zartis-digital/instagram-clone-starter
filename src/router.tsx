import { QueryClient } from "@tanstack/react-query"
import {
  createRouteMask,
  createRouter as createTanStackRouter,
} from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

// Mask the modal route to show the standalone post URL
// Navigate to: /p/:postId/modal (renders modal over feed)
// URL displays: /p/:postId (the standalone post page)
// Shared/refreshed: loads /p/:postId (full post page, not modal)
const postModalMask = createRouteMask({
  routeTree,
  from: "/p/$postId/modal",
  to: "/p/$postId",
  params: (prev) => ({ postId: prev.postId }),
})

// Mask the explore post modal route to the same standalone URL
const explorePostModalMask = createRouteMask({
  routeTree,
  from: "/explore/p/$postId/modal",
  to: "/p/$postId",
  params: (prev) => ({ postId: prev.postId }),
})

// Mask the story modal route to show the standalone story URL
const storyModalMask = createRouteMask({
  routeTree,
  from: "/stories/$username/modal",
  to: "/stories/$username",
  params: (prev) => ({ username: prev.username }),
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
})

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    context: { queryClient },
    routeMasks: [postModalMask, explorePostModalMask, storyModalMask],
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
