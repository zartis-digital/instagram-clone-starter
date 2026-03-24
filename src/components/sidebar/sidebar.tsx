import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Compass,
  Film,
  Heart,
  Home,
  Image,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
} from "lucide-react"
import { InstagramIcon } from "./instagram-logo"
import { useSidebar } from "./sidebar-context"
import { useUnreadCountQuery } from "../../queries/notifications"
import { useUnreadMessagesCount } from "../../queries/messages"
import { useAuthUser, useLogoutMutation } from "../../queries/auth"
import { CreatePostDialog } from "../create/create-post-dialog"
import { CreateStoryDialog } from "../create/create-story-dialog"

interface NavItem {
  label: string
  icon: React.ReactNode
  active?: boolean
  badge?: number
  href?: string
  sheet?: "search" | "notifications"
}

function NavButton({
  item,
  collapsed,
  onSheetToggle,
}: {
  item: NavItem
  collapsed: boolean
  onSheetToggle?: (sheet: "search" | "notifications") => void
}) {
  const { activeSheet } = useSidebar()
  const isSheetActive = item.sheet && activeSheet === item.sheet

  const classes = cn(
    "group relative flex w-full items-center gap-4 rounded-lg p-3 text-[15px] text-white transition-colors hover:bg-white/10",
    item.active && !isSheetActive && "font-bold",
    isSheetActive && "rounded-lg border border-[#262626] bg-transparent"
  )

  const content = (
    <>
      <div className="relative flex-shrink-0">
        {item.icon}
        {item.badge && !isSheetActive && (
          <span className="absolute -top-1.5 -right-1.5 flex size-[18px] items-center justify-center rounded-full bg-[#ff3040] text-[11px] font-semibold text-white">
            {item.badge}
          </span>
        )}
      </div>
      <span
        className={cn(
          "whitespace-nowrap",
          collapsed ? "hidden" : "hidden group-hover/sidebar:inline"
        )}
      >
        {item.label}
      </span>
    </>
  )

  if (item.sheet) {
    return (
      <button
        type="button"
        className={classes}
        onClick={() => onSheetToggle?.(item.sheet!)}
      >
        {content}
      </button>
    )
  }

  if (item.href) {
    return (
      <Link to={item.href} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={classes}>
      {content}
    </button>
  )
}

function ReelsIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-label="Reels"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.042-.379 3.408 3.408 0 0 1-1.265-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.51 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.27 1.949 8.074 8.074 0 0 0-.51 2.67C1.013 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .51 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.949 1.27 8.074 8.074 0 0 0 2.67.51C8.638 22.987 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.51 5.625 5.625 0 0 0 3.219-3.219 8.074 8.074 0 0 0 .51-2.67C22.987 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.51-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.949-1.27 8.074 8.074 0 0 0-2.67-.51C15.362 1.013 14.987 1 12 1z" />
      <path d="m8.5 7.5 9 4.5-9 4.5z" />
    </svg>
  )
}

function useNavItems(): NavItem[] {
  const { data: notifData } = useUnreadCountQuery()
  const { data: authUser } = useAuthUser()
  const unreadCount = notifData?.count ?? 0
  const unreadMessages = useUnreadMessagesCount()

  return [
    { label: "Home", icon: <Home className="size-6" />, active: true, href: "/" },
    { label: "Search", icon: <Search className="size-6" />, sheet: "search" },
    { label: "Explore", icon: <Compass className="size-6" />, href: "/explore" },
    { label: "Reels", icon: <ReelsIcon className="size-6" />, href: "/reels" },
    {
      label: "Messages",
      icon: <MessageCircle className="size-6" />,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
      href: "/direct/inbox",
    },
    {
      label: "Notifications",
      icon: <Heart className="size-6" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
      sheet: "notifications",
    },
    { label: "Create", icon: <Plus className="size-6" /> },
    {
      label: "Profile",
      icon: authUser?.avatarUrl ? (
        <img
          src={authUser.avatarUrl}
          alt="Profile"
          className="size-6 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-6 items-center justify-center rounded-full bg-neutral-700 text-xs font-bold text-white">
          {authUser?.username?.[0]?.toUpperCase() ?? "?"}
        </div>
      ),
      href: authUser ? `/${authUser.username}` : "/sign-in",
    },
  ]
}

function AlsoFromMetaIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-label="Also from Meta"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <rect x="2" y="2" width="8" height="8" rx="1.5" />
      <rect x="14" y="2" width="8" height="8" rx="1.5" />
      <rect x="2" y="14" width="8" height="8" rx="1.5" />
      <circle cx="18" cy="18" r="4" />
    </svg>
  )
}

const bottomItems: NavItem[] = [
  { label: "Also from Meta", icon: <AlsoFromMetaIcon className="size-6" /> },
]

function MoreButton({ collapsed }: { collapsed: boolean }) {
  const logout = useLogoutMutation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group relative flex w-full items-center gap-4 rounded-lg p-3 text-[15px] text-white transition-colors hover:bg-white/10">
        <div className="relative flex-shrink-0">
          <Menu className="size-6" />
        </div>
        <span
          className={cn(
            "whitespace-nowrap",
            collapsed ? "hidden" : "hidden group-hover/sidebar:inline"
          )}
        >
          More
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem render={<Link to="/settings/edit-profile" />}>
          <Settings className="size-5" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut className="size-5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function CreateButton({ collapsed }: { collapsed: boolean }) {
  const [dialogType, setDialogType] = useState<"post" | "story" | null>(null)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="group relative flex w-full items-center gap-4 rounded-lg p-3 text-[15px] text-white transition-colors hover:bg-white/10"
        >
          <div className="relative flex-shrink-0">
            <Plus className="size-6" />
          </div>
          <span
            className={cn(
              "whitespace-nowrap",
              collapsed ? "hidden" : "hidden group-hover/sidebar:inline"
            )}
          >
            Create
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setDialogType("post")}>
            <Image className="size-5" />
            Post
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialogType("story")}>
            <Film className="size-5" />
            Story
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreatePostDialog
        open={dialogType === "post"}
        onOpenChange={(open) => !open && setDialogType(null)}
      />
      <CreateStoryDialog
        open={dialogType === "story"}
        onOpenChange={(open) => !open && setDialogType(null)}
      />
    </>
  )
}

export function Sidebar() {
  const { activeSheet, toggleSheet } = useSidebar()
  const collapsed = activeSheet !== null
  const navItems = useNavItems()

  return (
    <nav
      className={cn(
        "group/sidebar fixed left-0 top-0 z-50 flex h-screen w-[72px] flex-col bg-black px-3 pb-5 transition-[width] duration-300 ease-in-out overflow-hidden",
        !collapsed && "hover:w-[220px]"
      )}
      aria-label="Main navigation"
    >
      {/* Logo — always show icon, left-aligned */}
      <Link to="/" className="px-3 pb-4 pt-8">
        <InstagramIcon className="size-6 text-white" />
      </Link>

      {/* Spacer to push nav items toward center-bottom */}
      <div className="flex-1" />

      {/* Main nav items */}
      <div className="flex flex-col gap-0.5">
        {navItems.map((item) =>
          item.label === "Create" ? (
            <CreateButton key={item.label} collapsed={collapsed} />
          ) : (
            <NavButton
              key={item.label}
              item={item}
              collapsed={collapsed}
              onSheetToggle={toggleSheet}
            />
          )
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom items */}
      <div className="flex flex-col gap-0.5">
        <MoreButton collapsed={collapsed} />
        {bottomItems.map((item) => (
          <NavButton
            key={item.label}
            item={item}
            collapsed={collapsed}
            onSheetToggle={toggleSheet}
          />
        ))}
      </div>
    </nav>
  )
}
