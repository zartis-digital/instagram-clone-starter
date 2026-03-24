import { useState, useCallback } from "react"
import { useForm } from "@tanstack/react-form"
import { useUploadFiles } from "@better-upload/client"
import { ArrowLeft, ChevronDown, MapPin, SmilePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { UploadDropZone } from "./upload-drop-zone"
import { UploadProgress } from "./upload-progress"
import { useCreatePostMutation } from "../../queries/create"
import { useAuthUser } from "../../queries/auth"
import { env } from "../../env"

const STORAGE_PUBLIC_BASE = env.VITE_STORAGE_PUBLIC_URL

interface PostFormValues {
  caption: string
  location: string
  altText: string
  hideLikes: boolean
  hideComments: boolean
}

export function CreatePostDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [step, setStep] = useState<"upload" | "caption">("upload")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const {
    upload,
    progresses,
    averageProgress,
    allSucceeded,
    uploadedFiles,
    reset: resetUpload,
  } = useUploadFiles({ route: "posts", api: `${env.VITE_API_URL}/upload` })

  const { data: authUser } = useAuthUser()
  const createPost = useCreatePostMutation()

  const form = useForm({
    defaultValues: {
      caption: "",
      location: "",
      altText: "",
      hideLikes: false,
      hideComments: false,
    } as PostFormValues,
    onSubmit: ({ value: _value }) => {
      // TODO [Step 7]: Submit the post (rename _value back to value first)
      // 1. Build imageUrls from uploadedFiles: uploadedFiles.map(f => `${STORAGE_PUBLIC_BASE}/${f.objectInfo.key}`)
      // 2. Call createPost.mutate({ imageUrls, caption: value.caption || undefined })
      // 3. In the onSuccess callback, close the dialog and call resetAll()
    },
  })

  const resetAll = useCallback(() => {
    setStep("upload")
    setShowAccessibility(false)
    setShowAdvanced(false)
    setSelectedFiles([])
    form.reset()
    resetUpload()
  }, [resetUpload, form])

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      setSelectedFiles(files)
      upload(files)
    },
    [upload]
  )

  const handleOpenChange = useCallback(
    (next: boolean) => {
      onOpenChange(next)
      if (!next) resetAll()
    },
    [onOpenChange, resetAll]
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex flex-col gap-0 overflow-hidden rounded-xl bg-[#262626] p-0",
          step === "upload"
            ? "h-[min(calc(100vh-80px),580px)] w-full sm:max-w-2xl"
            : "h-[min(calc(100vh-80px),860px)] w-full sm:max-w-2xl"
        )}
      >
        <DialogTitle className="sr-only">Create new post</DialogTitle>

        {/* Header */}
        <div className="flex h-11 flex-shrink-0 items-center justify-between border-b border-neutral-700 px-4">
          {step === "caption" ? (
            <button type="button" onClick={() => setStep("upload")}>
              <ArrowLeft className="size-5 text-white" />
            </button>
          ) : (
            <div className="size-5" />
          )}
          <span className="text-sm font-semibold text-white">
            Create new post
          </span>
          {step === "upload" ? (
            <Button
              variant="link"
              size="sm"
              disabled={!allSucceeded}
              onClick={() => setStep("caption")}
              className="text-sm font-semibold text-blue-500 no-underline hover:text-white hover:no-underline"
            >
              Next
            </Button>
          ) : (
            <Button
              variant="link"
              size="sm"
              disabled={createPost.isPending}
              onClick={() => form.handleSubmit()}
              className="text-sm font-semibold text-blue-500 no-underline hover:text-white hover:no-underline"
            >
              Share
            </Button>
          )}
        </div>

        {/* Body */}
        {step === "upload" && (
          <div className="flex flex-1 items-center justify-center p-6">
            {selectedFiles.length === 0 ? (
              <UploadDropZone
                accept="image/*"
                maxFiles={10}
                onFilesSelected={handleFilesSelected}
              />
            ) : (
              <UploadProgress
                progresses={progresses}
                averageProgress={averageProgress}
              />
            )}
          </div>
        )}

        {step === "caption" && (
          <form
            className="flex min-h-0 flex-1 flex-col overflow-y-auto"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
              {/* Image preview */}
              <div className="flex flex-shrink-0 items-center justify-center overflow-x-auto border-b border-neutral-700 bg-black">
                <div className="flex gap-2 p-4">
                  {uploadedFiles.map((f, i) => (
                    <img
                      key={i}
                      src={`${STORAGE_PUBLIC_BASE}/${f.objectInfo.key}`}
                      alt=""
                      className="h-64 w-auto flex-shrink-0 rounded object-cover"
                    />
                  ))}
                </div>
              </div>

              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3">
                {authUser?.avatarUrl ? (
                  <img
                    src={authUser.avatarUrl}
                    alt=""
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-7 items-center justify-center rounded-full bg-neutral-600 text-xs font-bold text-white">
                    {authUser?.username?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <span className="text-sm font-semibold text-white">
                  {authUser?.username ?? "You"}
                </span>
              </div>

              {/* Caption field */}
              <form.Field name="caption">
                {(field) => (
                  <Field className="px-4">
                    <textarea
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Write a caption..."
                      maxLength={2200}
                      rows={7}
                      className="w-full resize-none bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-between pb-2">
                      <SmilePlus className="size-4 cursor-pointer text-neutral-500 hover:text-neutral-300" />
                      <span className="text-xs text-neutral-500">
                        {field.state.value.length}/2,200
                      </span>
                    </div>
                  </Field>
                )}
              </form.Field>

              {/* Location field */}
              <form.Field name="location">
                {(field) => (
                  <Field className="border-t border-neutral-700">
                    <div className="flex items-center justify-between px-4 py-3">
                      <input
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Add location"
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
                      />
                      <MapPin className="size-4 flex-shrink-0 text-neutral-500" />
                    </div>
                  </Field>
                )}
              </form.Field>

              {/* Accessibility section */}
              <div className="border-t border-neutral-700">
                <button
                  type="button"
                  onClick={() => setShowAccessibility(!showAccessibility)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm text-white"
                >
                  Accessibility
                  <ChevronDown
                    className={cn(
                      "size-4 text-neutral-500 transition-transform",
                      showAccessibility && "rotate-180"
                    )}
                  />
                </button>
                {showAccessibility && (
                  <form.Field name="altText">
                    {(field) => (
                      <Field className="px-4 pb-3">
                        <FieldDescription>
                          Alt text describes your photos for people with visual
                          impairments.
                        </FieldDescription>
                        <div className="flex items-center gap-2">
                          {uploadedFiles[0] && (
                            <img
                              src={`${STORAGE_PUBLIC_BASE}/${uploadedFiles[0].objectInfo.key}`}
                              alt=""
                              className="size-11 flex-shrink-0 rounded object-cover"
                            />
                          )}
                          <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            placeholder="Write alt text..."
                            className="flex-1 rounded-md border border-neutral-600 bg-transparent px-3 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-400 focus:outline-none"
                          />
                        </div>
                      </Field>
                    )}
                  </form.Field>
                )}
              </div>

              {/* Advanced settings section */}
              <div className="border-t border-neutral-700">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm text-white"
                >
                  Advanced settings
                  <ChevronDown
                    className={cn(
                      "size-4 text-neutral-500 transition-transform",
                      showAdvanced && "rotate-180"
                    )}
                  />
                </button>
                {showAdvanced && (
                  <div className="space-y-4 px-4 pb-4">
                    <form.Field name="hideLikes">
                      {(field) => (
                        <Field className="flex-row items-center justify-between gap-3">
                          <div className="flex-1">
                            <FieldLabel>
                              Hide like and view counts on this post
                            </FieldLabel>
                            <FieldDescription>
                              Only you will see the total number of likes and
                              views.
                            </FieldDescription>
                          </div>
                          <Switch
                            checked={field.state.value}
                            onCheckedChange={(checked) =>
                              field.handleChange(checked)
                            }
                          />
                        </Field>
                      )}
                    </form.Field>

                    <form.Field name="hideComments">
                      {(field) => (
                        <Field className="flex-row items-center justify-between gap-3">
                          <div className="flex-1">
                            <FieldLabel>Turn off commenting</FieldLabel>
                            <FieldDescription>
                              You can change this later.
                            </FieldDescription>
                          </div>
                          <Switch
                            checked={field.state.value}
                            onCheckedChange={(checked) =>
                              field.handleChange(checked)
                            }
                          />
                        </Field>
                      )}
                    </form.Field>
                  </div>
                )}
              </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
