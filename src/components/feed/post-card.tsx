import { Link } from "@tanstack/react-router"
import { UserRound } from "lucide-react"
import type { FeedPost } from "../../lib/types"
import { PostActions } from "./post-actions"
import { PostHeader } from "./post-header"

export function PostCard({ post }: { post: FeedPost }) {
  const postId = String(post.id)
  const imageCount = post.images.length || 1

  return (
    <div className="mx-auto mb-3 max-w-[468px] border-b border-[#262626] pb-3">
      <PostHeader
        postId={post.id}
        postOwnerId={post.userId}
        user={post.user}
        createdAt={post.createdAt}
      />

      {/* Image — click opens post detail modal */}
      <Link
        to="/p/$postId/modal"
        params={{ postId }}
        mask={{ to: "/p/$postId", params: { postId } }}
        className="relative mt-1 block overflow-hidden rounded-[4px]"
      >
        <img
          src={post.images[0]?.imageUrl ?? post.imageUrl}
          alt={post.caption ?? ""}
          className="aspect-[468/585] w-full object-cover"
        />

        {/* User tag icon — bottom left */}
        <div className="absolute bottom-3 left-3 flex size-7 items-center justify-center rounded-full bg-black/60">
          <UserRound className="size-3.5 text-white" />
        </div>

        {/* Carousel dots — bottom center */}
        {imageCount > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1">
            {Array.from({ length: imageCount }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full ${
                  i === 0
                    ? "size-[6px] bg-[#0095f6]"
                    : "size-[5px] bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </Link>

      {/* Actions row */}
      <PostActions
        postId={post.id}
        isLiked={post.likedByMe}
        isBookmarked={post.savedByMe}
        likes={post.likeCount}
        commentCount={post.commentCount}
      />

      {/* Caption: username + text */}
      {post.caption && (
        <div className="px-1 pt-0.5">
          <p className="text-[13px] leading-[18px] text-white">
            <span className="font-semibold">{post.user.username}</span>
            {" "}
            {post.caption}
          </p>
        </div>
      )}

      {/* "See translation" link */}
      {post.caption && (
        <button
          type="button"
          className="px-1 pt-0.5 text-[13px] font-semibold text-[#a8a8a8]"
        >
          See translation
        </button>
      )}

      {/* View comments — also opens post detail modal */}
      {post.commentCount > 0 && (
        <Link
          to="/p/$postId/modal"
          params={{ postId }}
          mask={{ to: "/p/$postId", params: { postId } }}
          className="block px-1 pt-1 text-[13px] text-[#a8a8a8] hover:text-[#c8c8c8]"
        >
          View all {post.commentCount} comments
        </Link>
      )}
    </div>
  )
}
