import { useEffect } from "react"
import { X } from "lucide-react"
import { usePostQuery } from "../../queries/posts"
import { PostDetailView } from "./post-detail-view"

export function PostDetailModal({
  postId,
  onClose,
}: {
  postId: string
  onClose: () => void
}) {
  const { data: post, isLoading } = usePostQuery(postId)

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65"
        onClick={onClose}
      >
        <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  if (!post) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65"
        onClick={onClose}
      >
        <p className="text-white">Post not found</p>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        className="absolute top-4 right-4 z-[101]"
        onClick={onClose}
      >
        <X className="size-6 text-white" />
      </button>

      {/* Modal content — stop click propagation */}
      <div
        className="relative mx-4 max-h-[95vh] w-full max-w-[1100px]"
        onClick={(e) => e.stopPropagation()}
      >
        <PostDetailView post={post} />
      </div>
    </div>
  )
}
