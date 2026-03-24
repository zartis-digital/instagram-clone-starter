import { Link } from "@tanstack/react-router"
import { ChevronDown, Ellipsis, Settings, UserPlus } from "lucide-react"
import type { UserProfile } from "../../lib/types"
import {
  useProfileFollowMutation,
  useProfileUnfollowMutation,
} from "../../queries/profile"

export function ProfileHeader({ profile }: { profile: UserProfile }) {
  const followMutation = useProfileFollowMutation(profile.username)
  const unfollowMutation = useProfileUnfollowMutation(profile.username)

  const handleFollowToggle = () => {
    if (
      profile.followStatus === "following" ||
      profile.followStatus === "requested"
    ) {
      unfollowMutation.mutate(profile.id)
    } else {
      followMutation.mutate(profile.id)
    }
  }

  return (
    <div className="px-4 pb-2 pt-8 md:px-0">
      <div className="flex gap-6 md:gap-12">
        {/* Avatar — gray ring for own profile, gradient for others */}
        <div className="flex shrink-0 items-start justify-center">
          <div
            className="flex items-center justify-center rounded-full p-[3px]"
            style={{
              background: profile.isOwnProfile
                ? "#525252"
                : "linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
            }}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="size-[150px] rounded-full border-4 border-black object-cover"
              />
            ) : (
              <div className="flex size-[150px] items-center justify-center rounded-full border-4 border-black bg-neutral-800 text-4xl font-bold text-white">
                {profile.username[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Info section */}
        <div className="flex flex-1 flex-col">
          {/* Username row */}
          <div className="mb-1 flex items-center gap-3">
            <h1 className="text-xl text-white">{profile.username}</h1>
            {profile.isOwnProfile ? (
              <Link to="/settings/edit-profile" className="ml-1">
                <Settings className="size-5 text-white" />
              </Link>
            ) : (
              <button type="button" className="ml-1">
                <Ellipsis className="size-5 text-white" />
              </button>
            )}
          </div>

          {/* Display name */}
          {profile.displayName && (
            <p className="mb-1 text-sm font-bold text-white">
              {profile.displayName}
            </p>
          )}

          {/* Stats row */}
          <div className="mb-4 flex items-center gap-8 text-[15px]">
            <span className="text-white">
              <span className="font-semibold">
                {profile.postsCount.toLocaleString()}
              </span>{" "}
              posts
            </span>
            <button type="button" className="text-white">
              <span className="font-semibold">
                {profile.followersCount.toLocaleString()}
              </span>{" "}
              followers
            </button>
            <button type="button" className="text-white">
              <span className="font-semibold">
                {profile.followingCount.toLocaleString()}
              </span>{" "}
              following
            </button>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-3">
              {profile.bio.split("\n").map((line, i) => (
                <p key={i} className="text-sm text-white">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons — full width below header */}
      <div className="mt-6 flex items-center gap-2">
        {profile.isOwnProfile ? (
          <>
            <Link
              to="/settings/edit-profile"
              className="flex flex-1 items-center justify-center rounded-lg bg-neutral-700 py-[7px] text-sm font-semibold text-white hover:bg-neutral-600"
            >
              Edit profile
            </Link>
            <button
              type="button"
              className="flex-1 rounded-lg bg-neutral-700 py-[7px] text-sm font-semibold text-white hover:bg-neutral-600"
            >
              View archive
            </button>
          </>
        ) : profile.followStatus === "following" ? (
          <>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-neutral-700 py-[7px] text-sm font-semibold text-white hover:bg-neutral-600"
              onClick={handleFollowToggle}
            >
              Following
              <ChevronDown className="size-4" />
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-neutral-700 py-[7px] text-sm font-semibold text-white hover:bg-neutral-600"
            >
              Message
            </button>
            <button
              type="button"
              className="rounded-lg bg-neutral-700 p-[7px] text-white hover:bg-neutral-600"
            >
              <UserPlus className="size-5" />
            </button>
          </>
        ) : profile.followStatus === "requested" ? (
          <>
            <button
              type="button"
              className="flex-1 rounded-lg bg-neutral-700 py-[7px] text-sm font-semibold text-white hover:bg-neutral-600"
              onClick={handleFollowToggle}
            >
              Requested
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-neutral-700 py-[7px] text-sm font-semibold text-white hover:bg-neutral-600"
            >
              Message
            </button>
            <button
              type="button"
              className="rounded-lg bg-neutral-700 p-[7px] text-white hover:bg-neutral-600"
            >
              <UserPlus className="size-5" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="flex-1 rounded-lg bg-sky-600 py-[7px] text-sm font-semibold text-white hover:bg-sky-700"
              onClick={handleFollowToggle}
            >
              Follow
            </button>
            <button
              type="button"
              className="flex-1 rounded-lg bg-neutral-700 py-[7px] text-sm font-semibold text-white hover:bg-neutral-600"
            >
              Message
            </button>
            <button
              type="button"
              className="rounded-lg bg-neutral-700 p-[7px] text-white hover:bg-neutral-600"
            >
              <UserPlus className="size-5" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
