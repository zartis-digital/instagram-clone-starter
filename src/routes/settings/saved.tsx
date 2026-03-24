import { createFileRoute, Link } from "@tanstack/react-router"
import { Bookmark, Copy, Loader2 } from "lucide-react"
import { useSavedPostsQuery } from "../../queries/posts"

export const Route = createFileRoute("/settings/saved")({
  component: SavedPostsPage,
})

function SavedPostsPage() {
  const { data: posts, isLoading } = useSavedPostsQuery()

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-white">Saved</h2>
      <p className="mb-6 text-sm text-neutral-400">
        Only you can see what you've saved.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-neutral-400" />
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="flex size-16 items-center justify-center rounded-full border-2 border-white">
            <Bookmark className="size-8 text-white" />
          </div>
          <h3 className="text-sm font-bold text-white">Save</h3>
          <p className="max-w-xs text-center text-sm text-neutral-400">
            Save photos and videos that you want to see again. No one is
            notified, and only you can see what you've saved.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <Link
              key={post.id}
              to="/p/$postId/modal"
              params={{ postId: String(post.id) }}
              mask={{ to: "/p/$postId", params: { postId: String(post.id) } }}
              className="group relative aspect-square overflow-hidden rounded"
            >
              <img
                src={post.imageUrl}
                alt=""
                className="h-full w-full object-cover transition-opacity group-hover:opacity-70"
              />
              {post.images && post.images.length > 1 && (
                <div className="absolute top-2 right-2">
                  <Copy className="size-4 text-white drop-shadow" />
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
