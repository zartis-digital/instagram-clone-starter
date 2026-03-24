import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { SharePostDialog } from "./share-post-dialog"
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Smile,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { PostDetail } from "../../lib/types"
import { formatRelativeTime } from "../../lib/time"
import { useAuthUser } from "../../queries/auth"
import {
  useLikeMutation,
  useSaveMutation,
  useCommentMutation,
  useCommentLikeMutation,
  useDeletePostMutation,
} from "../../queries/posts"

function formatCount(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`
  return n.toString()
}

function UserAvatar({
  user,
  size = "size-8",
}: {
  user: { username: string; avatarUrl: string | null }
  size?: string
}) {
  return user.avatarUrl ? (
    <img
      src={user.avatarUrl}
      alt={user.username}
      className={`${size} flex-shrink-0 rounded-full object-cover`}
    />
  ) : (
    <div
      className={`${size} flex flex-shrink-0 items-center justify-center rounded-full bg-neutral-700 text-xs font-bold text-white`}
    >
      {user.username[0]?.toUpperCase()}
    </div>
  )
}

export function PostDetailView({ post }: { post: PostDetail }) {
  const { data: authUser } = useAuthUser()
  const likeMutation = useLikeMutation()
  const saveMutation = useSaveMutation()
  const commentMutation = useCommentMutation()
  const commentLikeMutation = useCommentLikeMutation()
  const deleteMutation = useDeletePostMutation()
  const [commentText, setCommentText] = useState("")
  const [shareOpen, setShareOpen] = useState(false)
  const isOwner = authUser?.id === post.userId
  const mainImage = post.images[0]?.imageUrl ?? post.imageUrl

  const handleComment = () => {
    const trimmed = commentText.trim()
    if (!trimmed) return
    commentMutation.mutate(
      { postId: post.id, content: trimmed },
      { onSuccess: () => setCommentText("") }
    )
  }

  return (
    <div className="flex h-full max-h-[90vh] overflow-hidden rounded-sm bg-black">
      {/* Left: Image */}
      <div className="flex flex-1 items-center justify-center bg-black">
        <img
          src={mainImage}
          alt={post.caption ?? ""}
          className="max-h-[90vh] w-full object-contain"
        />
      </div>

      {/* Right: Details panel */}
      <div className="flex w-[400px] flex-shrink-0 flex-col border-l border-[#262626]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#262626] px-4 py-3">
          <Link to="/$username" params={{ username: post.user.username }}>
            <UserAvatar user={post.user} />
          </Link>
          <div className="flex-1">
            <Link
              to="/$username"
              params={{ username: post.user.username }}
              className="text-sm font-semibold text-white hover:opacity-70"
            >
              {post.user.username}
            </Link>
          </div>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontal className="size-5 text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => deleteMutation.mutate(post.id)}
                >
                  <Trash2 className="size-4" />
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Comments area */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {/* Caption as first "comment" */}
          {post.caption && (
            <div className="mb-4 flex gap-3">
              <UserAvatar user={post.user} />
              <div>
                <p className="text-sm text-white">
                  <span className="font-semibold">{post.user.username}</span>
                  {" "}
                  {post.caption}
                </p>
                <p className="mt-1 text-xs text-[#a8a8a8]">
                  {formatRelativeTime(post.createdAt)}
                </p>
              </div>
            </div>
          )}

          {/* Comments */}
          {post.comments.map((comment) => (
            <div key={comment.id} className="mb-4 flex gap-3">
              <UserAvatar user={comment.user} />
              <div className="flex-1">
                <p className="text-sm text-white">
                  <span className="font-semibold">
                    {comment.user.username}
                  </span>{" "}
                  {comment.content}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-[#a8a8a8]">
                  <span>{formatRelativeTime(comment.createdAt)}</span>
                  <button type="button" className="font-semibold">
                    Reply
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="self-start pt-1"
                onClick={() =>
                  commentLikeMutation.mutate({
                    postId: post.id,
                    commentId: comment.id,
                    liked: comment.likedByMe,
                  })
                }
              >
                <Heart
                  className={`size-3 transition-colors ${
                    comment.likedByMe
                      ? "fill-[#ff3040] text-[#ff3040]"
                      : "text-[#a8a8a8] hover:text-white/70"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div className="border-t border-[#262626] px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => likeMutation.mutate(post.id)}
              >
                <Heart
                  className={`size-6 transition-colors ${
                    post.likedByMe
                      ? "fill-[#ff3040] text-[#ff3040]"
                      : "text-white hover:text-white/70"
                  }`}
                />
              </button>
              <button type="button">
                <MessageCircle className="size-6 text-white hover:text-white/70" />
              </button>
              <button type="button" onClick={() => setShareOpen(true)}>
                <Send className="size-[22px] text-white hover:text-white/70" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => saveMutation.mutate(post.id)}
            >
              <Bookmark
                className={`size-6 transition-colors ${
                  post.savedByMe
                    ? "fill-white text-white"
                    : "text-white hover:text-white/70"
                }`}
              />
            </button>
          </div>
          <p className="mt-1 text-sm font-semibold text-white">
            {formatCount(post.likeCount)} likes
          </p>
          <p className="mt-0.5 text-[10px] uppercase text-[#a8a8a8]">
            {formatRelativeTime(post.createdAt)}
          </p>
        </div>

        {/* Add comment input */}
        <form
          className="flex items-center gap-3 border-t border-[#262626] px-4 py-3"
          onSubmit={(e) => {
            e.preventDefault()
            handleComment()
          }}
        >
          <Smile className="size-6 flex-shrink-0 text-white" />
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-[#a8a8a8] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || commentMutation.isPending}
            className="text-sm font-semibold text-[#0095f6] disabled:opacity-50"
          >
            Post
          </button>
        </form>
      </div>

      <SharePostDialog
        postId={post.id}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />

    </div>
  )
}
