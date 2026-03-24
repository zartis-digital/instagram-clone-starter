import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import {
  useNotificationsQuery,
  useMarkReadMutation,
} from "../../queries/notifications"
import {
  useFollowRequestsQuery,
  useAcceptFollowRequestMutation,
  useRejectFollowRequestMutation,
} from "../../queries/follow-requests"
import { useFollowMutation, useUnfollowMutation } from "../../queries/suggestions"
import { useIntersectionObserver } from "../../hooks/use-intersection-observer"
import { formatRelativeTime } from "../../lib/time"
import type { ApiNotification, FollowRequest } from "../../lib/types"

const DAY = 24 * 60 * 60 * 1000
const WEEK = 7 * DAY
const MONTH = 30 * DAY

function getTimeBucket(createdAt: string): string {
  const age = Date.now() - new Date(createdAt).getTime()
  if (age < DAY) return "Today"
  if (age < WEEK) return "This Week"
  if (age < MONTH) return "This Month"
  return "Earlier"
}

function groupByTimeBucket(notifications: ApiNotification[]) {
  const buckets = new Map<string, ApiNotification[]>()
  for (const n of notifications) {
    const bucket = getTimeBucket(n.createdAt)
    const list = buckets.get(bucket)
    if (list) {
      list.push(n)
    } else {
      buckets.set(bucket, [n])
    }
  }
  return buckets
}

function getNotificationText(notification: ApiNotification): string {
  switch (notification.type) {
    case "like":
      return "liked your post."
    case "comment":
      return notification.comment
        ? `commented: "${notification.comment.content}"`
        : "commented on your post."
    case "follow":
      return "started following you."
    case "follow_request":
      return "requested to follow you."
    case "mention":
      return "mentioned you in a comment."
  }
}

function FollowBackButton({ actorId }: { actorId: number }) {
  const [state, setState] = useState<"idle" | "following" | "requested">("idle")
  const followMutation = useFollowMutation()
  const unfollowMutation = useUnfollowMutation()
  const isMutating = followMutation.isPending || unfollowMutation.isPending

  function handleClick() {
    if (state === "idle") {
      followMutation.mutate(actorId, {
        onSuccess: (data) => setState(data.status),
      })
    } else {
      unfollowMutation.mutate(actorId, {
        onSuccess: () => setState("idle"),
      })
    }
  }

  const label = state === "idle" ? "Follow" : state === "requested" ? "Requested" : "Following"

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isMutating}
      className={cn(
        "flex-shrink-0 rounded-lg px-4 py-1.5 text-sm font-semibold disabled:opacity-50",
        state === "idle"
          ? "bg-[#0095f6] text-white hover:bg-[#1877f2]"
          : "bg-[#363636] text-white hover:bg-[#262626]"
      )}
    >
      {label}
    </button>
  )
}

function FollowRequestButtons({ actorId }: { actorId: number }) {
  const [state, setState] = useState<"pending" | "accepted" | "rejected">("pending")
  const acceptMutation = useAcceptFollowRequestMutation()
  const rejectMutation = useRejectFollowRequestMutation()
  const isMutating = acceptMutation.isPending || rejectMutation.isPending

  if (state === "accepted") {
    return (
      <span className="flex-shrink-0 text-sm text-[#a8a8a8]">Following</span>
    )
  }

  if (state === "rejected") return null

  return (
    <div className="flex flex-shrink-0 gap-2">
      <button
        type="button"
        onClick={() => acceptMutation.mutate(actorId, { onSuccess: () => setState("accepted") })}
        disabled={isMutating}
        className="rounded-lg bg-[#0095f6] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#1877f2] disabled:opacity-50"
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={() => rejectMutation.mutate(actorId, { onSuccess: () => setState("rejected") })}
        disabled={isMutating}
        className="rounded-lg bg-[#363636] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#262626] disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  )
}

function NotificationItem({
  notification,
  isNew,
}: {
  notification: ApiNotification
  isNew: boolean
}) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-6 py-2 hover:bg-white/5 cursor-pointer",
      isNew && "bg-[#0095f6]/10"
    )}>
      <img
        src={notification.actor.avatarUrl ?? ""}
        alt={notification.actor.username}
        className="size-11 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-[18px] text-white">
          <span className="font-semibold">
            {notification.actor.username}
          </span>{" "}
          {getNotificationText(notification)}{" "}
          <span className="text-[#a8a8a8]">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </p>
      </div>
      {notification.post?.imageUrl && (
        <img
          src={notification.post.imageUrl}
          alt=""
          className="size-11 rounded object-cover flex-shrink-0"
        />
      )}
      {notification.type === "follow" && (
        <FollowBackButton actorId={notification.actor.id} />
      )}
      {notification.type === "follow_request" && (
        <FollowRequestButtons actorId={notification.actor.id} />
      )}
    </div>
  )
}

function NotificationSection({
  title,
  notifications,
  lastSeenId,
}: {
  title: string
  notifications: ApiNotification[]
  lastSeenId: number | null
}) {
  if (notifications.length === 0) return null
  return (
    <div>
      <h3 className="px-6 py-2 text-base font-bold text-white">{title}</h3>
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          isNew={lastSeenId !== null && n.id > lastSeenId}
        />
      ))}
    </div>
  )
}

function NotificationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-6 py-2 animate-pulse">
      <div className="size-11 rounded-full bg-white/10 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-3/4 rounded bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-white/10" />
      </div>
    </div>
  )
}

function FollowRequestItem({ request }: { request: FollowRequest }) {
  const [state, setState] = useState<"pending" | "accepted" | "rejected">("pending")
  const acceptMutation = useAcceptFollowRequestMutation()
  const rejectMutation = useRejectFollowRequestMutation()
  const isMutating = acceptMutation.isPending || rejectMutation.isPending

  if (state === "rejected") return null

  return (
    <div className="flex items-center gap-3 px-6 py-2 hover:bg-white/5">
      <img
        src={request.requester.avatarUrl ?? ""}
        alt={request.requester.username}
        className="size-11 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {request.requester.username}
        </p>
        <p className="text-xs text-[#a8a8a8] truncate">
          {request.requester.displayName}
        </p>
      </div>
      {state === "accepted" ? (
        <span className="flex-shrink-0 text-sm text-[#a8a8a8]">Following</span>
      ) : (
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => acceptMutation.mutate(request.requesterId, { onSuccess: () => setState("accepted") })}
            disabled={isMutating}
            className="rounded-lg bg-[#0095f6] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#1877f2] disabled:opacity-50"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => rejectMutation.mutate(request.requesterId, { onSuccess: () => setState("rejected") })}
            disabled={isMutating}
            className="rounded-lg bg-[#363636] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#262626] disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

function FollowRequestsSection() {
  const [expanded, setExpanded] = useState(false)
  const { data } = useFollowRequestsQuery()
  const requests = data ?? []

  if (requests.length === 0) return null

  return (
    <div className="border-b border-[#262626]">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-6 py-3 hover:bg-white/5"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">Follow Requests</span>
          <span className="flex size-5 items-center justify-center rounded-full bg-[#ff3040] text-xs font-semibold text-white">
            {requests.length}
          </span>
        </div>
        <svg
          className={cn("size-4 text-[#a8a8a8] transition-transform", expanded && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {expanded && requests.map((r) => (
        <FollowRequestItem key={r.requesterId} request={r} />
      ))}
    </div>
  )
}

const BUCKET_ORDER = ["Today", "This Week", "This Month", "Earlier"]

export function NotificationsSheet() {
  const { activeSheet } = useSidebar()
  const isOpen = activeSheet === "notifications"
  const prevOpen = useRef(false)
  const lastSeenId = useRef<number | null>(null)

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } =
    useNotificationsQuery(isOpen)
  const markRead = useMarkReadMutation()
  const followRequestsQuery = useFollowRequestsQuery()

  const allNotifications =
    data?.pages.flatMap((p) => p.notifications) ?? []

  // Fetch and mark all as read when the sheet opens
  useEffect(() => {
    if (isOpen && !prevOpen.current) {
      refetch()
      followRequestsQuery.refetch()
      markRead.mutate()
    }
    if (!isOpen && prevOpen.current && allNotifications.length > 0) {
      // Store the latest notification ID when closing
      lastSeenId.current = allNotifications[0].id
    }
    prevOpen.current = isOpen
  }, [isOpen])

  const sentinelRef = useIntersectionObserver(() => fetchNextPage(), {
    enabled: hasNextPage && !isFetchingNextPage,
  })

  const grouped = groupByTimeBucket(allNotifications)

  return (
    <div
      className={cn(
        "fixed top-0 z-40 h-screen w-[397px] rounded-r-2xl border-r border-[#262626] bg-black shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out",
        isOpen
          ? "left-[72px] opacity-100"
          : "left-[72px] -translate-x-full opacity-0 pointer-events-none"
      )}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-2xl font-bold text-white">Notifications</h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto h-[calc(100vh-80px)]">
        {isLoading ? (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        ) : (
          <>
            <FollowRequestsSection />
            {allNotifications.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-[#a8a8a8]">
                No notifications yet.
              </p>
            ) : (
              <>
                {BUCKET_ORDER.map((bucket) => {
                  const items = grouped.get(bucket)
                  if (!items) return null
                  return (
                    <NotificationSection
                      key={bucket}
                      title={bucket}
                      notifications={items}
                      lastSeenId={lastSeenId.current}
                    />
                  )
                })}
                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-1" />
                {isFetchingNextPage && <NotificationSkeleton />}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
