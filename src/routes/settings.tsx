import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router"
import { Bell, Bookmark, Lock, UserPen } from "lucide-react"
import { Sidebar } from "../components/sidebar/sidebar"

export const Route = createFileRoute("/settings")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/sign-in" })
  },
  component: SettingsLayout,
})

const navSections = [
  {
    label: "How you use Instagram",
    items: [
      { label: "Edit profile", to: "/settings/edit-profile", icon: UserPen },
      { label: "Notifications", to: "/settings/notifications", icon: Bell },
    ],
  },
  {
    label: "Who can see your content",
    items: [
      { label: "Account privacy", to: "/settings/account-privacy", icon: Lock },
    ],
  },
  {
    label: "What you've saved",
    items: [
      { label: "Saved", to: "/settings/saved", icon: Bookmark },
    ],
  },
]

function SettingsLayout() {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      <div className="pl-[72px]">
        <div className="mx-auto flex max-w-4xl gap-16 px-8 py-12">
          <nav className="w-72 shrink-0" aria-label="Settings navigation">
            <h1 className="mb-8 px-4 text-xl font-bold text-white">Settings</h1>

            <div className="flex flex-col gap-8">
              {navSections.map((section) => (
                <div key={section.label}>
                  <h2 className="mb-2 px-4 text-xs font-semibold text-neutral-500">
                    {section.label}
                  </h2>
                  <div className="flex flex-col gap-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white transition-colors hover:bg-neutral-800"
                        activeProps={{ className: "bg-neutral-800" }}
                      >
                        <item.icon className="size-5 text-white" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
