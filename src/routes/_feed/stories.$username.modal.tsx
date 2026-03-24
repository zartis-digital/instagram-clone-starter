import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useAllStories } from "../../queries/stories"
import { StoryViewer } from "../../components/stories/story-viewer"

export const Route = createFileRoute("/_feed/stories/$username/modal")({
  component: StoryModal,
})

function StoryModal() {
  const { username } = Route.useParams()
  const navigate = useNavigate()
  const { allStories, isLoading } = useAllStories()
  const story = allStories.find((s) => s.user?.username === username)

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
        <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  if (!story) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
        onClick={() => navigate({ to: "/" })}
      >
        <p className="text-white">Story not found</p>
      </div>
    )
  }

  return (
    <StoryViewer
      story={story}
      allStories={allStories}
      onClose={() => navigate({ to: "/" })}
      onNavigateStory={(newUsername) =>
        navigate({
          to: "/stories/$username/modal",
          params: { username: newUsername },
          mask: { to: "/stories/$username", params: { username: newUsername } },
          replace: true,
        })
      }
    />
  )
}
