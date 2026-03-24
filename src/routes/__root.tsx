import type { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"

import { SidebarProvider } from "../components/sidebar/sidebar-context"
import { MessagesProvider } from "../components/messages/messages-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import { authUserQueryOptions } from "../queries/auth"
import { useUserWebSocket } from "../hooks/use-user-websocket"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authUserQueryOptions)
    return { user }
  },
  component: RootComponent,
  notFoundComponent: NotFound,
})

function UserPresence() {
  useUserWebSocket()
  return null
}

function RootComponent() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <MessagesProvider>
          <UserPresence />
          <Outlet />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </MessagesProvider>
      </SidebarProvider>
    </TooltipProvider>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found</p>
      </div>
    </div>
  )
}
