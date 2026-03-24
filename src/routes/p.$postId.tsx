import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { usePostQuery } from "../queries/posts"
import { PostDetailView } from "../components/post-detail/post-detail-view"

export const Route = createFileRoute("/p/$postId")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/sign-in" })
  },
  component: PostPage,
})

function PostPage() {
  const { postId } = Route.useParams()
  const { data: post, isLoading } = usePostQuery(postId)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Post not found</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-[#0095f6]">
            Back to feed
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back navigation */}
      <div className="border-b border-[#262626] px-4 py-3">
        <Link to="/" className="inline-flex items-center gap-2 text-white">
          <ArrowLeft className="size-5" />
          <span className="text-sm font-semibold">Back</span>
        </Link>
      </div>

      {/* Post detail */}
      <div className="mx-auto max-w-[1100px] py-8 px-4">
        <PostDetailView post={post} />
      </div>
    </div>
  )
}
