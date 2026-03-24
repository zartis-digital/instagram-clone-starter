import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { PostDetailModal } from "../../components/post-detail/post-detail-modal"

export const Route = createFileRoute("/$username/p/$postId/modal")({
  component: ProfilePostModal,
})

function ProfilePostModal() {
  const { postId, username } = Route.useParams()
  const navigate = useNavigate()

  return (
    <PostDetailModal
      postId={postId}
      onClose={() => navigate({ to: "/$username", params: { username } })}
    />
  )
}
