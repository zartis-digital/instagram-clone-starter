import { Plus } from "lucide-react"

export function ProfileHighlights({
  isOwnProfile,
}: {
  isOwnProfile: boolean
}) {
  return (
    <div className="px-4 py-6 md:px-0">
      <div
        className="flex gap-4 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {/* "New" highlight — only visible on own profile */}
        {isOwnProfile && (
          <button
            type="button"
            className="flex shrink-0 flex-col items-center gap-2"
          >
            <div className="flex size-[77px] items-center justify-center rounded-full border-2 border-neutral-600">
              <Plus className="size-8 text-neutral-400" />
            </div>
            <span className="text-xs font-semibold text-white">New</span>
          </button>
        )}
      </div>
    </div>
  )
}
