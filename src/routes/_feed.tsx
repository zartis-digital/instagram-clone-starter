import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { Sidebar } from "../components/sidebar/sidebar"
import { useSidebar } from "../components/sidebar/sidebar-context"
import { SearchSheet } from "../components/sidebar/search-sheet"
import { NotificationsSheet } from "../components/sidebar/notifications-sheet"
import { StoriesBar } from "../components/stories/stories-bar"
import { Feed } from "../components/feed/feed"
import { SuggestionsPanel } from "../components/suggestions/suggestions-panel"
import { MessagesWidget } from "../components/messages/messages-widget"

export const Route = createFileRoute("/_feed")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/sign-in" })
  },
  component: FeedLayout,
})

function FeedLayout() {
  const { activeSheet, closeSheet } = useSidebar()

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed left sidebar */}
      <Sidebar />

      {/* Slide-out sheets */}
      <SearchSheet />
      <NotificationsSheet />

      {/* Click-away overlay to close sheets */}
      {activeSheet && (
        <div
          className="fixed inset-0 z-30"
          onClick={closeSheet}
          aria-hidden="true"
        />
      )}

      {/* Main content area — offset by sidebar width */}
      <div className="pl-[72px]">
        <div className="mx-auto flex max-w-[935px] justify-center">
          {/* Center feed column */}
          <div className="w-full max-w-[630px] pt-4">
            <StoriesBar />
            <Feed />
          </div>

          {/* Right suggestions panel — visible on xl+ only */}
          <div className="hidden xl:block">
            <div className="sticky top-0">
              <SuggestionsPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Floating messages widget */}
      <MessagesWidget />

      {/* Modal overlay renders here via Outlet when navigating to child modal routes */}
      <Outlet />
    </div>
  )
}
