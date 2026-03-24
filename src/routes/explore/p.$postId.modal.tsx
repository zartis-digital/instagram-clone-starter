import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { PostDetailModal } from "../../components/post-detail/post-detail-modal"

export const Route = createFileRoute("/explore/p/$postId/modal")({
  component: ExplorePostModal,
})

function ExplorePostModal() {
  const { postId } = Route.useParams()
  const navigate = useNavigate()

  return (
    <PostDetailModal
      postId={postId}
      onClose={() => navigate({ to: "/explore" })}
    />
  )
}
