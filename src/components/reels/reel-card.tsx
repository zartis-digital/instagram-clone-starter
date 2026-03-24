import { useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  BadgeCheck,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Music,
  Send,
} from "lucide-react"
import type { MockReel } from "../../lib/mock-data"

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`
  return n.toString()
}

export function ReelCard({ reel }: { reel: MockReel }) {
  const [isLiked, setIsLiked] = useState(reel.isLiked)
  const [likes, setLikes] = useState(reel.likes)
  const [isFollowing, setIsFollowing] = useState(reel.isFollowing)
  const [isBookmarked, setIsBookmarked] = useState(false)

  function handleToggleLike() {
    setIsLiked((prev) => {
      setLikes((l) => (prev ? l - 1 : l + 1))
      return !prev
    })
  }

  return (
    <div className="flex h-screen w-full snap-start items-center justify-center">
      {/* Reel image + info overlay */}
      <div className="relative my-4 h-full max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-hidden rounded-lg">
        <img
          src={reel.imageUrl}
          alt={reel.caption}
          className="h-full w-full object-cover"
        />

        {/* Bottom gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Bottom-left: user info + caption */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="mb-3 flex items-center gap-2">
            <Link to="/$username" params={{ username: reel.user.username }}>
              <img
                src={reel.user.avatarUrl}
                alt={reel.user.username}
                className="size-10 rounded-full border border-white/20 object-cover"
              />
            </Link>
            <Link
              to="/$username"
              params={{ username: reel.user.username }}
              className="text-sm font-semibold text-white"
            >
              {reel.user.username}
            </Link>
            {reel.user.isVerified && (
              <BadgeCheck className="size-3.5 fill-[#0095f6] text-black" />
            )}
            {!isFollowing && (
              <button
                type="button"
                className="ml-1 rounded-lg border border-white/30 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                onClick={() => setIsFollowing(true)}
              >
                Follow
              </button>
            )}
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-white">
            {reel.caption}
          </p>

          <div className="flex items-center gap-2">
            <Music className="size-3 text-white" />
            <span className="text-xs text-white">{reel.audioName}</span>
          </div>
        </div>
      </div>

      {/* Action buttons — outside the reel on the right */}
      <div className="flex flex-col items-center gap-5 self-end mb-8 ml-3">
        <button
          type="button"
          className="flex flex-col items-center gap-1"
          onClick={handleToggleLike}
        >
          <Heart
            className={`size-7 ${
              isLiked
                ? "fill-[#ff3040] text-[#ff3040]"
                : "text-white"
            }`}
          />
          <span className="text-xs font-semibold text-white">
            {formatCount(likes)}
          </span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1">
          <MessageCircle className="size-7 text-white" />
          <span className="text-xs font-semibold text-white">
            {formatCount(reel.comments)}
          </span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1">
          <Send className="size-6 text-white" />
        </button>

        <button
          type="button"
          className="flex flex-col items-center gap-1"
          onClick={() => setIsBookmarked((prev) => !prev)}
        >
          <Bookmark
            className={`size-6 ${
              isBookmarked ? "fill-white text-white" : "text-white"
            }`}
          />
        </button>

        <button type="button">
          <MoreHorizontal className="size-6 text-white" />
        </button>

        {/* Audio thumbnail */}
        <div className="mt-1 size-7 overflow-hidden rounded-md border border-white/20">
          <img
            src={reel.user.avatarUrl}
            alt="Audio"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
