import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { Copy, Grid3X3, Loader2, PlaySquare, UserSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { userPostsQueryOptions } from "../../queries/profile"
import { useIntersectionObserver } from "../../hooks/use-intersection-observer"

type Tab = "posts" | "reels" | "tagged"

export function ProfileGrid({ username: profileUsername }: { username: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("posts")
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(userPostsQueryOptions(profileUsername))

  const loadMoreRef = useIntersectionObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage()
    },
    { enabled: hasNextPage && !isFetchingNextPage }
  )

  const posts = data?.pages.flatMap((p) => p.posts) ?? []

  const tabs: { id: Tab; icon: React.ReactNode }[] = [
    { id: "posts", icon: <Grid3X3 className="size-4" /> },
    { id: "reels", icon: <PlaySquare className="size-4" /> },
    { id: "tagged", icon: <UserSquare className="size-4" /> },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-t border-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-wider transition-colors",
              activeTab === tab.id
                ? "border-t border-white text-white"
                : "text-neutral-400"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.id}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {activeTab === "posts" && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-6 animate-spin text-neutral-400" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-neutral-400">No posts yet</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to="/$username/p/$postId/modal"
                    params={{ username: profileUsername, postId: String(post.id) }}
                    mask={{ to: "/p/$postId", params: { postId: String(post.id) } }}
                    className="group relative aspect-square overflow-hidden"
                  >
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-opacity group-hover:opacity-70"
                    />
                    {post.images.length > 1 && (
                      <div className="absolute top-2 right-2">
                        <Copy className="size-4 text-white drop-shadow" />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
              <div ref={loadMoreRef} className="flex justify-center py-4">
                {isFetchingNextPage && (
                  <Loader2 className="size-5 animate-spin text-neutral-400" />
                )}
              </div>
            </>
          )}
        </>
      )}

      {activeTab === "reels" && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-neutral-400">No reels yet</p>
        </div>
      )}

      {activeTab === "tagged" && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-neutral-400">No tagged posts</p>
        </div>
      )}
    </div>
  )
}
