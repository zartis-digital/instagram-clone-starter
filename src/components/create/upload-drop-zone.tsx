import { useRef, useState, useCallback } from "react"
import { ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function UploadDropZone({
  accept,
  maxFiles,
  onFilesSelected,
}: {
  accept: string
  maxFiles: number
  onFilesSelected: (files: File[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return
      const files = Array.from(fileList).slice(0, maxFiles)
      onFilesSelected(files)
    },
    [maxFiles, onFilesSelected]
  )

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-600 p-12 transition-colors",
        isDragOver && "border-white/60 bg-white/5"
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragEnter={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      <ImagePlus className="mb-4 size-16 text-neutral-400" strokeWidth={1} />
      <p className="mb-4 text-xl text-white">Drag photos and videos here</p>
      <Button
        variant="default"
        size="sm"
        onClick={() => inputRef.current?.click()}
      >
        Select from computer
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
