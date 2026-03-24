import { Link } from "@tanstack/react-router"
import { BadgeCheck, Ellipsis, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatRelativeTime } from "../../lib/time"
import { useAuthUser } from "../../queries/auth"
import { useDeletePostMutation } from "../../queries/posts"

interface User {
  id: number | string
  username: string
  displayName: string
  avatarUrl: string | null
  isVerified?: boolean
}

export function PostHeader({
  postId,
  postOwnerId,
  user,
  createdAt,
  location,
  hasStoryRing,
}: {
  postId: number
  postOwnerId: number
  user: User
  createdAt: string
  location?: string
  hasStoryRing?: boolean
}) {
  const { data: authUser } = useAuthUser()
  const deleteMutation = useDeletePostMutation()
  const isOwner = authUser?.id === postOwnerId

  return (
    <div className="flex items-center gap-3 px-1 py-2">
      {/* Avatar with optional story gradient ring */}
      <div className="flex-shrink-0">
        {hasStoryRing ? (
          <div
            className="flex items-center justify-center rounded-full p-[2px]"
            style={{
              background:
                "linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
            }}
          >
            <img
              src={user.avatarUrl ?? undefined}
              alt={user.username}
              className="size-8 rounded-full border-2 border-black object-cover"
            />
          </div>
        ) : (
          <img
            src={user.avatarUrl ?? undefined}
            alt={user.username}
            className="size-8 rounded-full object-cover"
          />
        )}
      </div>

      {/* Username, verified, time + location */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <Link
            to="/$username"
            params={{ username: user.username }}
            className="text-[13px] font-semibold text-white hover:opacity-70"
          >
            {user.username}
          </Link>
          {user.isVerified && (
            <BadgeCheck className="size-3.5 flex-shrink-0 fill-[#0095f6] text-black" />
          )}
          <span className="text-[13px] text-[#a8a8a8]">&middot;</span>
          <span className="text-[13px] text-[#a8a8a8]">
            {createdAt.includes("T") ? formatRelativeTime(createdAt) : createdAt}
          </span>
        </div>
        {location && (
          <p className="truncate text-xs leading-tight text-white">
            {location}
          </p>
        )}
      </div>

      {/* More button with dropdown */}
      {isOwner && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex-shrink-0 p-1">
            <Ellipsis className="size-5 text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => deleteMutation.mutate(postId)}
            >
              <Trash2 className="size-4" />
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
