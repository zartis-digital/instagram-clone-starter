import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Bookmark, Heart, MessageCircle, Send } from "lucide-react"
import { useLikeMutation, useSaveMutation } from "../../queries/posts"
import { SharePostDialog } from "../post-detail/share-post-dialog"

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`
  return n.toString()
}

export function PostActions({
  postId,
  isLiked,
  isBookmarked,
  likes,
  commentCount,
}: {
  postId: number
  isLiked: boolean
  isBookmarked: boolean
  likes: number
  commentCount: number
}) {
  const likeMutation = useLikeMutation()
  const saveMutation = useSaveMutation()
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between px-1 pt-2.5 pb-1">
        {/* Left: heart + count, comment + count, share */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-1.5"
            onClick={() => likeMutation.mutate(postId)}
          >
            <Heart
              className={`size-6 transition-colors ${
                isLiked
                  ? "fill-[#ff3040] text-[#ff3040]"
                  : "text-white hover:text-white/70"
              }`}
            />
            <span className="text-[13px] font-semibold text-white">
              {formatCount(likes)}
            </span>
          </button>

          <Link
            to="/p/$postId/modal"
            params={{ postId: String(postId) }}
            mask={{ to: "/p/$postId", params: { postId: String(postId) } }}
            className="flex items-center gap-1.5"
          >
            <MessageCircle className="size-6 text-white hover:text-white/70" />
            {commentCount > 0 && (
              <span className="text-[13px] font-semibold text-white">
                {formatCount(commentCount)}
              </span>
            )}
          </Link>

          <button type="button" onClick={() => setShareOpen(true)}>
            <Send className="size-[22px] text-white hover:text-white/70" />
          </button>
        </div>

        {/* Right: bookmark */}
        <button type="button" onClick={() => saveMutation.mutate(postId)}>
          <Bookmark
            className={`size-6 transition-colors ${
              isBookmarked
                ? "fill-white text-white"
                : "text-white hover:text-white/70"
            }`}
          />
        </button>
      </div>

      <SharePostDialog
        postId={postId}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </>
  )
}
