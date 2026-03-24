import { useState, useCallback } from "react"
import { useUploadFiles } from "@better-upload/client"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UploadDropZone } from "./upload-drop-zone"
import { UploadProgress } from "./upload-progress"
import { useCreateStoryMutation } from "../../queries/create"
import { env } from "../../env"

const STORAGE_PUBLIC_BASE = env.VITE_STORAGE_PUBLIC_URL

export function CreateStoryDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const {
    upload,
    progresses,
    averageProgress,
    allSucceeded,
    uploadedFiles,
    reset: resetUpload,
  } = useUploadFiles({ route: "stories", api: `${env.VITE_API_URL}/upload` })

  const createStory = useCreateStoryMutation()

  const resetAll = useCallback(() => {
    setSelectedFiles([])
    resetUpload()
  }, [resetUpload])

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      setSelectedFiles(files)
      upload(files)
    },
    [upload]
  )

  const handleShare = useCallback(() => {
    const segments = uploadedFiles.map((f) => ({
      mediaUrl: `${STORAGE_PUBLIC_BASE}/${f.objectInfo.key}`,
      mediaType: (f.raw.type.startsWith("video/") ? "video" : "image") as
        | "image"
        | "video",
    }))
    createStory.mutate(
      { segments },
      {
        onSuccess: () => {
          onOpenChange(false)
          resetAll()
        },
      }
    )
  }, [uploadedFiles, createStory, onOpenChange, resetAll])

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
        className="flex h-[min(calc(100vh-80px),580px)] w-full sm:max-w-2xl flex-col gap-0 overflow-hidden rounded-xl bg-[#262626] p-0"
      >
        <DialogTitle className="sr-only">Create new story</DialogTitle>

        {/* Header */}
        <div className="flex h-11 flex-shrink-0 items-center justify-between border-b border-neutral-700 px-4">
          <div className="size-5" />
          <span className="text-sm font-semibold text-white">
            Create new story
          </span>
          <Button
            variant="link"
            size="sm"
            disabled={!allSucceeded || createStory.isPending}
            onClick={handleShare}
            className="text-sm font-semibold text-blue-500 no-underline hover:text-white hover:no-underline"
          >
            Share
          </Button>
        </div>

        {/* Body */}
        <div className="flex flex-1 items-center justify-center p-6">
          {selectedFiles.length === 0 ? (
            <UploadDropZone
              accept="image/*,video/*"
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
      </DialogContent>
    </Dialog>
  )
}
