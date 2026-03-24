import { createFileRoute } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { api } from "../../lib/api"

interface NotificationSettings {
  notifPauseAll: boolean
  notifLikes: boolean
  notifComments: boolean
  notifFollows: boolean
  notifMentions: boolean
}

export const Route = createFileRoute("/settings/notifications")({
  component: NotificationsSettings,
})

const toggleRows = [
  { key: "notifLikes", label: "Likes" },
  { key: "notifComments", label: "Comments" },
  { key: "notifFollows", label: "New followers" },
  { key: "notifMentions", label: "Mentions" },
] as const

function NotificationsSettings() {
  const queryClient = useQueryClient()

  const { data: settings } = useQuery({
    queryKey: ["notificationSettings"],
    queryFn: () =>
      api.get<NotificationSettings>("/users/me/notification-settings"),
  })

  const updateSettings = useMutation({
    mutationFn: (data: Partial<NotificationSettings>) =>
      api.patch<NotificationSettings>(
        "/users/me/notification-settings",
        data
      ),
    onSuccess: (updated) => {
      queryClient.setQueryData(["notificationSettings"], updated)
    },
  })

  if (!settings) return null

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-white">Notifications</h2>

      <div className="divide-y divide-neutral-800 rounded-xl bg-neutral-900">
        <div className="flex items-center justify-between p-4">
          <span className="text-sm font-semibold text-white">Pause all</span>
          <Switch
            checked={settings.notifPauseAll}
            onCheckedChange={(checked) =>
              updateSettings.mutate({ notifPauseAll: checked })
            }
          />
        </div>

        {toggleRows.map(({ key, label }) => (
          <div
            key={key}
            className={cn(
              "flex items-center justify-between p-4",
              settings.notifPauseAll && "opacity-50"
            )}
          >
            <span className="text-sm text-white">{label}</span>
            <Switch
              checked={settings[key]}
              disabled={settings.notifPauseAll}
              onCheckedChange={(checked) =>
                updateSettings.mutate({ [key]: checked })
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}
