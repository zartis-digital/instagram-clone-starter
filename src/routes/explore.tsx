import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router"
import { Copy, Heart, Loader2, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sidebar } from "../components/sidebar/sidebar"
import { useSidebar } from "../components/sidebar/sidebar-context"
import { SearchSheet } from "../components/sidebar/search-sheet"
import { NotificationsSheet } from "../components/sidebar/notifications-sheet"
import { MessagesWidget } from "../components/messages/messages-widget"
import { useExploreQuery } from "../queries/posts"
import { useIntersectionObserver } from "../hooks/use-intersection-observer"
import type { FeedPost } from "../lib/types"

export const Route = createFileRoute("/explore")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/sign-in" })
  },
  component: ExploreLayout,
})

// ── Helpers ─────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`
  return String(n)
}

// ── Grid cell ────────────────────────────────

function ExploreCell({
  post,
  isFeatured,
}: {
  post: FeedPost
  isFeatured: boolean
}) {
  const postId = String(post.id)
  const isCarousel = post.images.length > 1

  return (
    <Link
      to="/explore/p/$postId/modal"
      params={{ postId }}
      mask={{ to: "/p/$postId", params: { postId } }}
      className={cn(
        "group relative overflow-hidden",
        isFeatured ? "row-span-2" : ""
      )}
    >
      <img
        src={post.images[0]?.imageUrl ?? post.imageUrl}
        alt=""
        className="size-full object-cover"
      />

      {/* Hover overlay with likes & comments */}
      <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="flex items-center gap-1.5 text-sm font-bold text-white">
          <Heart className="size-5 fill-white text-white" />
          {formatCount(post.likeCount)}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-bold text-white">
          <MessageCircle className="size-5 fill-white text-white" />
          {formatCount(post.commentCount)}
        </span>
      </div>

      {/* Carousel indicator */}
      {isCarousel && (
        <div className="absolute top-2 right-2">
          <Copy className="size-4 text-white drop-shadow" />
        </div>
      )}
    </Link>
  )
}

// ── Loading skeleton ─────────────────────────

function ExploreSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="aspect-square animate-pulse bg-neutral-800" />
      ))}
    </div>
  )
}

// ── Explore grid ─────────────────────────────

function ExploreGrid() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useExploreQuery()

  const sentinelRef = useIntersectionObserver(() => fetchNextPage(), {
    enabled: hasNextPage && !isFetchingNextPage,
  })

  if (isLoading) return <ExploreSkeleton />

  const posts = data?.pages.flatMap((p) => p.posts) ?? []

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
        <p className="text-lg font-semibold">No posts to explore yet</p>
        <p className="text-sm">Check back later for new content</p>
      </div>
    )
  }

  const groups: FeedPost[][] = []
  for (let i = 0; i < posts.length; i += 5) {
    groups.push(posts.slice(i, i + 5))
  }

  return (
    <div className="flex flex-col gap-1">
      {groups.map((group, groupIndex) => {
        const isGroupA = groupIndex % 2 === 0
        const featured = group[4]
        const small = group.slice(0, 4)

        if (!featured) {
          return (
            <div key={groupIndex} className="grid grid-cols-3 gap-1">
              {group.map((post) => (
                <div key={post.id} className="aspect-square">
                  <ExploreCell post={post} isFeatured={false} />
                </div>
              ))}
            </div>
          )
        }

        return (
          <div
            key={groupIndex}
            className="grid grid-cols-3 grid-rows-2 gap-1"
            style={{ gridAutoRows: "1fr" }}
          >
            {isGroupA ? (
              <>
                <div className="aspect-square">
                  <ExploreCell post={small[0]} isFeatured={false} />
                </div>
                <div className="aspect-square">
                  <ExploreCell post={small[1]} isFeatured={false} />
                </div>
                <div className="row-span-2">
                  <ExploreCell post={featured} isFeatured={true} />
                </div>
                <div className="aspect-square">
                  <ExploreCell post={small[2]} isFeatured={false} />
                </div>
                <div className="aspect-square">
                  <ExploreCell post={small[3]} isFeatured={false} />
                </div>
              </>
            ) : (
              <>
                <div className="row-span-2">
                  <ExploreCell post={featured} isFeatured={true} />
                </div>
                <div className="aspect-square">
                  <ExploreCell post={small[0]} isFeatured={false} />
                </div>
                <div className="aspect-square">
                  <ExploreCell post={small[1]} isFeatured={false} />
                </div>
                <div className="aspect-square">
                  <ExploreCell post={small[2]} isFeatured={false} />
                </div>
                <div className="aspect-square">
                  <ExploreCell post={small[3]} isFeatured={false} />
                </div>
              </>
            )}
          </div>
        )
      })}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-6">
          <Loader2 className="size-6 animate-spin text-neutral-500" />
        </div>
      )}
    </div>
  )
}

// ── Layout ───────────────────────────────────

function ExploreLayout() {
  const { activeSheet, closeSheet } = useSidebar()

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <SearchSheet />
      <NotificationsSheet />
      {activeSheet && (
        <div
          className="fixed inset-0 z-30"
          onClick={closeSheet}
          aria-hidden="true"
        />
      )}

      <div className="pl-[72px]">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <ExploreGrid />
        </div>
      </div>

      <MessagesWidget />

      {/* Modal overlay renders here */}
      <Outlet />
    </div>
  )
}
