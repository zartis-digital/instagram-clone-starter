import { cn } from "@/lib/utils"

interface StoryAvatarProps {
  imageUrl: string
  username: string
  isSeen: boolean
  isLive?: boolean
  isYourStory?: boolean
  size?: "sm" | "md"
}

const sizeConfig = {
  sm: { ring: "size-[44px]", avatar: "size-[38px]" },
  md: { ring: "size-[89px]", avatar: "size-[82px]" },
} as const

export function StoryAvatar({
  imageUrl,
  username,
  isSeen,
  isLive = false,
  isYourStory = false,
  size = "md",
}: StoryAvatarProps) {
  const { ring, avatar } = sizeConfig[size]

  return (
    <div className="flex flex-shrink-0 flex-col items-center gap-1 w-[89px]">
      <div className="relative">
        {/* Gradient ring */}
        <div
          className={cn(
            "flex items-center justify-center rounded-full p-[2px]",
            ring
          )}
          style={
            isSeen || isYourStory
              ? { background: "#262626" }
              : {
                  background:
                    "linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
                }
          }
        >
          {/* Gap between ring and avatar */}
          <img
            src={imageUrl}
            alt={username}
            className={cn(
              "rounded-full border-2 border-black object-cover",
              avatar
            )}
          />
        </div>

        {/* "Your Story" plus badge */}
        {isYourStory && (
          <div className="absolute -bottom-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full border-[1.5px] border-black bg-[#0095f6]">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 1.5V8.5M1.5 5H8.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* LIVE badge */}
        {isLive && !isYourStory && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-[3px] bg-gradient-to-r from-[#c72a8b] to-[#e6683c] px-1 py-px border border-black">
            <span className="text-[8px] font-semibold leading-none text-white">
              LIVE
            </span>
          </div>
        )}
      </div>

      {/* Username */}
      <span
        className={cn(
          "w-full truncate text-center text-xs",
          isSeen ? "text-[#a8a8a8]" : "text-white"
        )}
      >
        {username}
      </span>
    </div>
  )
}
