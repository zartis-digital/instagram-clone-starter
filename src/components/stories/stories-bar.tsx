import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { useAuthUser } from "../../queries/auth"
import { useFeedStoriesQuery, useMyStoriesQuery } from "../../queries/stories"
import { CreateStoryDialog } from "../create/create-story-dialog"
import { StoryAvatar } from "./story-avatar"

export function StoriesBar() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { data: authUser } = useAuthUser()
  const { data: myStories } = useMyStoriesQuery()
  const { data: feedStories } = useFeedStoriesQuery()

  if (!authUser) return null

  const hasOwnStories = myStories && myStories.length > 0

  const sortedFeedStories = [...(feedStories ?? [])].sort((a, b) => {
    const aIsSeen = a.views.length > 0
    const bIsSeen = b.views.length > 0
    if (aIsSeen === bIsSeen) return 0
    return aIsSeen ? 1 : -1
  })

  const yourStoryAvatar = (
    <StoryAvatar
      imageUrl={hasOwnStories ? (myStories[0].user?.avatarUrl ?? authUser.avatarUrl ?? "") : (authUser.avatarUrl ?? "")}
      username="Your story"
      isSeen={false}
      isYourStory
    />
  )

  return (
    <div className="border-b border-[#262626]">
      <div
        className="flex gap-4 overflow-x-auto px-4 py-4"
        style={{ scrollbarWidth: "none" }}
      >
        {hasOwnStories ? (
          <Link
            to="/stories/$username/modal"
            params={{ username: authUser.username }}
            mask={{
              to: "/stories/$username",
              params: { username: authUser.username },
            }}
          >
            {yourStoryAvatar}
          </Link>
        ) : (
          <button type="button" onClick={() => setShowCreateDialog(true)}>
            {yourStoryAvatar}
          </button>
        )}

        <CreateStoryDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />

        {sortedFeedStories.length > 0 ? (
          sortedFeedStories.map((story) => (
            <Link
              key={story.id}
              to="/stories/$username/modal"
              params={{ username: story.user.username }}
              mask={{
                to: "/stories/$username",
                params: { username: story.user.username },
              }}
            >
              <StoryAvatar
                imageUrl={story.user.avatarUrl ?? ""}
                username={story.user.username}
                isSeen={story.views.length > 0}
              />
            </Link>
          ))
        ) : (
          <p className="flex items-center text-sm text-[#a8a8a8]">
            No stories at the moment.
          </p>
        )}
      </div>
    </div>
  )
}
