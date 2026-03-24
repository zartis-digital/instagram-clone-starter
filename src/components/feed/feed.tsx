import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useFeedQuery } from "../../queries/posts"
import { useIntersectionObserver } from "../../hooks/use-intersection-observer"
import { PostCard } from "./post-card"

function PostSkeleton() {
  return (
    <div className="mx-auto mb-3 max-w-[468px] animate-pulse border-b border-[#262626] pb-3">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 px-1 py-2">
        <div className="size-8 rounded-full bg-[#262626]" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-24 rounded bg-[#262626]" />
        </div>
      </div>
      {/* Image skeleton */}
      <div className="aspect-[468/585] w-full rounded bg-[#262626]" />
      {/* Actions skeleton */}
      <div className="flex gap-3 px-1 pt-3">
        <div className="h-6 w-6 rounded bg-[#262626]" />
        <div className="h-6 w-6 rounded bg-[#262626]" />
        <div className="h-6 w-6 rounded bg-[#262626]" />
      </div>
    </div>
  )
}

export function Feed() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">(
    "for-you"
  )

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFeedQuery()

  const posts = data?.pages.flatMap((p) => p.posts) ?? []

  const sentinelRef = useIntersectionObserver(
    () => fetchNextPage(),
    { enabled: hasNextPage && !isFetchingNextPage }
  )

  return (
    <div>
      <div className="flex border-b border-[#262626]">
        <button
          type="button"
          className={`flex-1 cursor-pointer py-3 text-center text-sm font-semibold ${
            activeTab === "for-you"
              ? "border-b border-white text-white"
              : "text-[#a8a8a8]"
          }`}
          onClick={() => setActiveTab("for-you")}
        >
          For you
        </button>
        <button
          type="button"
          className={`flex-1 cursor-pointer py-3 text-center text-sm font-semibold ${
            activeTab === "following"
              ? "border-b border-white text-white"
              : "text-[#a8a8a8]"
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
      </div>
      <div className="pt-2">
        {isLoading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center text-[#a8a8a8]">
            No posts yet.
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Sentinel div for infinite scroll */}
            <div ref={sentinelRef} className="h-1" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-6">
                <Loader2 className="size-6 animate-spin text-[#a8a8a8]" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
