import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { PostDetailModal } from "../../components/post-detail/post-detail-modal"

export const Route = createFileRoute("/_feed/p/$postId/modal")({
  component: PostModal,
})

function PostModal() {
  const { postId } = Route.useParams()
  const navigate = useNavigate()

  return (
    <PostDetailModal postId={postId} onClose={() => navigate({ to: "/" })} />
  )
}
