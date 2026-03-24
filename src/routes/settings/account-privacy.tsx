import { createFileRoute } from "@tanstack/react-router"
import { Switch } from "@/components/ui/switch"
import { useAuthUser } from "../../queries/auth"

export const Route = createFileRoute("/settings/account-privacy")({
  component: AccountPrivacy,
})

function AccountPrivacy() {
  const { data: authUser } = useAuthUser()

  // TODO [Step 6]: Implement privacy toggle mutation
  // This should call PATCH /users/me with { isPrivate } and update the authUser cache on success
  // Hint: Use useMutation from @tanstack/react-query and api.patch from ../../lib/api
  const updatePrivacy = {
    mutate: (_isPrivate: boolean) => {},
    isPending: false,
  }

  if (!authUser) return null

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-white">
        Account privacy
      </h2>

      <div className="flex items-center justify-between rounded-xl bg-neutral-900 p-4">
        <span className="text-sm font-semibold text-white">
          Private account
        </span>
        <Switch
          checked={authUser.isPrivate}
          onCheckedChange={(checked) => updatePrivacy.mutate(checked)}
        />
      </div>

      <div className="mt-4 space-y-3 text-sm text-neutral-400">
        <p>
          When your account is public, your profile and posts can be seen by
          anyone, on or off Instagram, even if they don't have an Instagram
          account.
        </p>
        <p>
          When your account is private, only the followers you approve can see
          what you share, including your photos or videos on hashtag and location
          pages, and your followers and following lists.
        </p>
      </div>
    </div>
  )
}
