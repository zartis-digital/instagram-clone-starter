import type { FileUploadInfo, UploadStatus } from "@better-upload/client"
import { CheckCircle, AlertCircle } from "lucide-react"
import { useMemo } from "react"

export function UploadProgress({
  progresses,
  averageProgress,
}: {
  progresses: FileUploadInfo<UploadStatus>[]
  averageProgress: number
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Overall progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-700">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${Math.round(averageProgress * 100)}%` }}
        />
      </div>

      {/* File thumbnails grid */}
      <div className="grid grid-cols-3 gap-2">
        {progresses.map((file, i) => (
          <FileThumbnail key={i} file={file} />
        ))}
      </div>
    </div>
  )
}

function FileThumbnail({ file }: { file: FileUploadInfo<UploadStatus> }) {
  const objectUrl = useMemo(() => {
    if (file.raw.type.startsWith("video/")) return null
    return URL.createObjectURL(file.raw)
  }, [file.raw])

  return (
    <div className="relative aspect-square overflow-hidden rounded-md bg-neutral-800">
      {objectUrl ? (
        <img
          src={objectUrl}
          alt={file.name}
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-xs text-neutral-400">
          {file.name}
        </div>
      )}

      {/* Status overlay */}
      {file.status === "uploading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="text-sm font-medium text-white">
            {Math.round(file.progress * 100)}%
          </span>
        </div>
      )}
      {file.status === "complete" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <CheckCircle className="size-6 text-green-400" />
        </div>
      )}
      {file.status === "failed" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <AlertCircle className="size-6 text-red-400" />
        </div>
      )}
    </div>
  )
}
