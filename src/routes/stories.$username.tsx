import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useAllStories } from "../queries/stories"
import { feedStoriesQueryOptions, myStoriesQueryOptions } from "../queries/stories"
import { StoryViewer } from "../components/stories/story-viewer"

export const Route = createFileRoute("/stories/$username")({
  beforeLoad: async ({ context }) => {
    if (!context.user) throw redirect({ to: "/sign-in" })
    await Promise.all([
      context.queryClient.ensureQueryData(feedStoriesQueryOptions),
      context.queryClient.ensureQueryData(myStoriesQueryOptions),
    ])
  },
  component: StoryPage,
})

function StoryPage() {
  const { username } = Route.useParams()
  const navigate = Route.useNavigate()
  const { allStories, isLoading } = useAllStories()
  const story = allStories.find((s) => s.user?.username === username)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
        <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Story not found</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-[#0095f6]">
            Back to feed
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Back button overlay */}
      <div className="absolute top-4 left-4 z-[103]">
        <Link
          to="/"
          className="flex items-center gap-2 text-white hover:text-white/80"
        >
          <ArrowLeft className="size-5" />
        </Link>
      </div>

      <StoryViewer
        story={story}
        allStories={allStories}
        onClose={() => navigate({ to: "/" })}
        onNavigateStory={(newUsername) =>
          navigate({
            to: "/stories/$username",
            params: { username: newUsername },
            replace: true,
          })
        }
      />
    </div>
  )
}
