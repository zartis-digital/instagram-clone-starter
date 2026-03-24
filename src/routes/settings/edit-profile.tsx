import { useRef } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { useAuthUser } from "../../queries/auth"
import { useUpdateProfileMutation } from "../../queries/settings"

export const Route = createFileRoute("/settings/edit-profile")({
  component: EditProfilePage,
})

function EditProfilePage() {
  const { data: authUser } = useAuthUser()
  const updateProfile = useUpdateProfileMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // TODO [Step 6]: Set up avatar upload using useUploadFile from @better-upload/client
  // When upload completes, call updateProfile.mutate({ avatarUrl: uploadedUrl })
  const isUploading = false

  const form = useForm({
    defaultValues: {
      displayName: authUser?.displayName ?? "",
      bio: authUser?.bio ?? "",
    },
    onSubmit: ({ value: _value }) => {
      // TODO [Step 6]: Call updateProfile.mutate with displayName and bio
      // Use value.displayName and value.bio (rename _value back to value first)
    },
  })

  if (!authUser) return null

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-white">Edit profile</h2>

      <div className="mb-8 flex items-center gap-4 rounded-2xl bg-neutral-900 p-4">
        {authUser.avatarUrl ? (
          <img
            src={authUser.avatarUrl}
            alt={authUser.username}
            className="size-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-full bg-neutral-700 text-lg font-bold text-white">
            {authUser.username[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{authUser.username}</p>
          <p className="text-sm text-neutral-400">{authUser.displayName}</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            // TODO [Step 6]: Upload the selected file using the upload function
            e.target.value = ""
          }}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg bg-sky-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Change photo"}
        </button>
      </div>

      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="displayName">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="displayName"
                className="text-sm font-semibold text-white"
              >
                Display name
              </label>
              <input
                id="displayName"
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="bio">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label htmlFor="bio" className="text-sm font-semibold text-white">
                Bio
              </label>
              <textarea
                id="bio"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                maxLength={150}
                rows={3}
                className="resize-none rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
              />
              <span className="self-end text-xs text-neutral-500">
                {field.state.value.length}/150
              </span>
            </div>
          )}
        </form.Field>

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="w-full rounded-xl bg-sky-500 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
        >
          {updateProfile.isPending ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  )
}
