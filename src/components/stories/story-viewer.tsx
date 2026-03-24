import { useCallback, useEffect, useRef, useState } from "react"
import { Heart, MoreHorizontal, Send, Trash2, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { FeedStory } from "../../lib/types"
import { formatRelativeTime } from "../../lib/time"
import { useAuthUser } from "../../queries/auth"
import {
  useDeleteStoryMutation,
  useRecordStoryViewMutation,
  useStoryLikeMutation,
  useStoryReplyMutation,
  useStoryUnlikeMutation,
} from "../../queries/stories"

const STORY_DURATION_MS = 5000

export function StoryViewer({
  story: initialStory,
  allStories,
  onClose,
  onNavigateStory,
}: {
  story: FeedStory
  allStories: FeedStory[]
  onClose: () => void
  onNavigateStory?: (username: string) => void
}) {
  const [currentStory, setCurrentStory] = useState(initialStory)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [replySent, setReplySent] = useState(false)

  const { data: authUser } = useAuthUser()
  const recordViewMutation = useRecordStoryViewMutation()
  const likeMutation = useStoryLikeMutation()
  const unlikeMutation = useStoryUnlikeMutation()
  const replyMutation = useStoryReplyMutation()
  const deleteMutation = useDeleteStoryMutation()

  const isOwnStory = authUser?.id === currentStory.userId
  const viewRecordedRef = useRef<Set<number>>(new Set())

  const currentSegment = currentStory.segments[currentItemIndex]
  const storyIndex = allStories.findIndex(
    (s) => s.user?.username === currentStory.user?.username
  )

  const goToNextStory = useCallback(() => {
    const next = allStories[storyIndex + 1]
    if (next) {
      if (onNavigateStory) {
        onNavigateStory(next.user.username)
      }
      setCurrentStory(next)
      setCurrentItemIndex(0)
      setProgress(0)
    } else {
      onClose()
    }
  }, [allStories, storyIndex, onClose, onNavigateStory])

  const goToPrevStory = useCallback(() => {
    const prev = allStories[storyIndex - 1]
    if (prev) {
      if (onNavigateStory) {
        onNavigateStory(prev.user.username)
      }
      setCurrentStory(prev)
      setCurrentItemIndex(0)
      setProgress(0)
    }
  }, [allStories, storyIndex, onNavigateStory])

  // Auto-advance progress bar
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / (STORY_DURATION_MS / 50)
        if (next >= 100) {
          // Move to next item or next story
          if (currentItemIndex < currentStory.segments.length - 1) {
            setCurrentItemIndex((i) => i + 1)
            return 0
          } else {
            goToNextStory()
            return 0
          }
        }
        return next
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isPaused, currentItemIndex, currentStory, goToNextStory])

  // Reset on story change
  useEffect(() => {
    setCurrentStory(initialStory)
    setCurrentItemIndex(0)
    setProgress(0)
  }, [initialStory])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") handleTapRight()
      if (e.key === "ArrowLeft") handleTapLeft()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItemIndex, currentStory])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  // Record view when story changes (fire-and-forget)
  useEffect(() => {
    if (isOwnStory) return
    if (viewRecordedRef.current.has(currentStory.id)) return
    viewRecordedRef.current.add(currentStory.id)
    recordViewMutation.mutate(currentStory.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStory.id, isOwnStory])

  // Reset like state when story changes
  useEffect(() => {
    setIsLiked(false)
    setReplyText("")
    setReplySent(false)
  }, [currentStory.id])

  function handleLikeToggle() {
    setIsLiked((prev) => !prev)
    if (isLiked) {
      unlikeMutation.mutate(currentStory.id)
    } else {
      likeMutation.mutate(currentStory.id)
    }
  }

  function handleReply() {
    const text = replyText.trim()
    if (!text) return
    replyMutation.mutate(
      { storyId: currentStory.id, content: text },
      {
        onSuccess: () => {
          setReplyText("")
          setReplySent(true)
          setTimeout(() => setReplySent(false), 2000)
        },
      }
    )
  }

  function handleTapLeft() {
    if (currentItemIndex > 0) {
      setCurrentItemIndex((i) => i - 1)
      setProgress(0)
    } else {
      goToPrevStory()
    }
  }

  function handleTapRight() {
    if (currentItemIndex < currentStory.segments.length - 1) {
      setCurrentItemIndex((i) => i + 1)
      setProgress(0)
    } else {
      goToNextStory()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1a1a]">
      {/* Close button */}
      <button
        type="button"
        className="absolute top-4 right-4 z-[102]"
        onClick={onClose}
      >
        <X className="size-7 text-white" />
      </button>

      {/* Story container */}
      <div className="relative h-full w-full max-w-[420px] max-h-[95vh] my-auto">
        <div
          className="relative h-full overflow-hidden rounded-lg bg-black"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Story image */}
          <img
            src={currentSegment.mediaUrl}
            alt={`Story by ${currentStory.user.username}`}
            className="h-full w-full object-cover"
          />

          {/* Tap zones */}
          <button
            type="button"
            className="absolute left-0 top-0 h-full w-1/3 z-[101]"
            onClick={handleTapLeft}
            aria-label="Previous"
          />
          <button
            type="button"
            className="absolute right-0 top-0 h-full w-2/3 z-[101]"
            onClick={handleTapRight}
            aria-label="Next"
          />

          {/* Top gradient overlay */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

          {/* Bottom gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          {/* Progress bars */}
          <div className="absolute top-2 left-2 right-2 z-[102] flex gap-1">
            {currentStory.segments.map((segment, i) => (
              <div
                key={String(segment.id)}
                className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/30"
              >
                <div
                  className="h-full rounded-full bg-white transition-none"
                  style={{
                    width:
                      i < currentItemIndex
                        ? "100%"
                        : i === currentItemIndex
                          ? `${progress}%`
                          : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* User header */}
          <div className="absolute top-5 left-2 right-2 z-[102] flex items-center gap-2 px-1">
            <img
              src={currentStory.user.avatarUrl ?? ""}
              alt={currentStory.user.username}
              className="size-8 rounded-full border border-white/20 object-cover"
            />
            <span className="text-sm font-semibold text-white">
              {currentStory.user.username}
            </span>
            <span className="text-xs text-white/60">
              {formatRelativeTime(currentStory.createdAt)}
            </span>
            {isOwnStory ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-auto">
                  <MoreHorizontal className="size-5 text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() =>
                      deleteMutation.mutate(currentStory.id, {
                        onSuccess: () => goToNextStory(),
                      })
                    }
                  >
                    <Trash2 className="size-4" />
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button type="button" className="ml-auto">
                <MoreHorizontal className="size-5 text-white" />
              </button>
            )}
          </div>

          {/* Bottom input area */}
          {!isOwnStory && (
            <div className="absolute bottom-4 left-3 right-3 z-[102] flex items-center gap-3">
              {replySent ? (
                <span className="flex-1 text-center text-sm text-white/70">
                  Sent!
                </span>
              ) : (
                <input
                  type="text"
                  placeholder="Send message"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleReply()
                  }}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                  className="flex-1 rounded-full border border-white/30 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/60"
                />
              )}
              <button type="button" onClick={handleLikeToggle}>
                <Heart
                  className={`size-6 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`}
                />
              </button>
              <button
                type="button"
                onClick={handleReply}
                disabled={!replyText.trim() || replyMutation.isPending}
              >
                <Send className="size-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
