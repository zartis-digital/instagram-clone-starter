import { useState } from "react"
import type { SuggestedUser } from "../../lib/types"
import { useFollowMutation, useUnfollowMutation } from "../../queries/suggestions"

export function SuggestionItem({ suggestion }: { suggestion: SuggestedUser }) {
  const [followState, setFollowState] = useState<"none" | "following" | "requested">("none")
  const followMutation = useFollowMutation()
  const unfollowMutation = useUnfollowMutation()

  const isMutating = followMutation.isPending || unfollowMutation.isPending

  const reason =
    suggestion.mutualFollowersCount > 0
      ? `Followed by ${suggestion.mutualFollowersCount} mutual${suggestion.mutualFollowersCount > 1 ? "s" : ""}`
      : "Suggested for you"

  function handleToggleFollow() {
    if (followState !== "none") {
      unfollowMutation.mutate(suggestion.id, {
        onSuccess: () => setFollowState("none"),
      })
    } else {
      followMutation.mutate(suggestion.id, {
        onSuccess: (data) => setFollowState(data.status),
      })
    }
  }

  const label = followState === "none" ? "Follow" : followState === "requested" ? "Requested" : "Following"

  return (
    <div className="flex items-center gap-3">
      <img
        src={suggestion.avatarUrl ?? undefined}
        alt={suggestion.username}
        className="h-8 w-8 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {suggestion.username}
        </p>
        <p className="truncate text-xs text-[#a8a8a8]">{reason}</p>
      </div>
      <button
        type="button"
        onClick={handleToggleFollow}
        disabled={isMutating}
        className="cursor-pointer text-xs font-semibold text-[#0095f6] hover:text-white disabled:opacity-50"
      >
        {label}
      </button>
    </div>
  )
}
