import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { Lock, Loader2 } from "lucide-react"
import { Sidebar } from "../components/sidebar/sidebar"
import { useSidebar } from "../components/sidebar/sidebar-context"
import { SearchSheet } from "../components/sidebar/search-sheet"
import { NotificationsSheet } from "../components/sidebar/notifications-sheet"
import { MessagesWidget } from "../components/messages/messages-widget"
import { ProfileHeader } from "../components/profile/profile-header"
import { ProfileHighlights } from "../components/profile/profile-highlights"
import { ProfileGrid } from "../components/profile/profile-grid"
import { profileQueryOptions } from "../queries/profile"
import { ApiError } from "../lib/api"

export const Route = createFileRoute("/$username")({
  beforeLoad: async ({ context, params }) => {
    if (!context.user) throw redirect({ to: "/sign-in" })
    await context.queryClient.ensureQueryData(
      profileQueryOptions(params.username)
    )
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { username } = Route.useParams()
  const { data: profile, isLoading, error } = useQuery(profileQueryOptions(username))
  const { activeSheet, closeSheet } = useSidebar()

  const is404 = error instanceof ApiError && error.status === 404

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Sidebar />
        <div className="flex min-h-screen items-center justify-center pl-[72px]">
          <Loader2 className="size-8 animate-spin text-neutral-400" />
        </div>
      </div>
    )
  }

  if (is404 || !profile) {
    return (
      <div className="min-h-screen bg-black">
        <Sidebar />
        <SearchSheet />
        <NotificationsSheet />
        {activeSheet && (
          <div
            className="fixed inset-0 z-30"
            onClick={closeSheet}
            aria-hidden="true"
          />
        )}
        <div className="flex min-h-screen items-center justify-center pl-[72px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">User not found</h1>
            <p className="mt-2 text-sm text-neutral-400">
              The user @{username} doesn't exist.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const canSeeContent =
    profile.isOwnProfile ||
    !profile.isPrivate ||
    profile.followStatus === "following"

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <SearchSheet />
      <NotificationsSheet />
      {activeSheet && (
        <div
          className="fixed inset-0 z-30"
          onClick={closeSheet}
          aria-hidden="true"
        />
      )}

      <div className="pl-[72px]">
        <div className="mx-auto max-w-2xl px-4">
          <ProfileHeader profile={profile} />
          {canSeeContent && (
            <ProfileHighlights isOwnProfile={profile.isOwnProfile} />
          )}
        </div>
        <div className="mx-auto max-w-6xl px-4">
          {canSeeContent ? (
            <ProfileGrid username={username} />
          ) : (
            <div className="flex flex-col items-center gap-2 border-t border-neutral-800 py-16">
              <div className="flex size-16 items-center justify-center rounded-full border-2 border-white">
                <Lock size={32} className="text-white" />
              </div>
              <h2 className="mt-2 text-sm font-bold text-white">
                This account is private
              </h2>
              <p className="text-sm text-neutral-400">
                Follow this account to see their photos and videos.
              </p>
            </div>
          )}
        </div>
      </div>

      <MessagesWidget />

      {/* Modal overlay for post detail */}
      <Outlet />
    </div>
  )
}
