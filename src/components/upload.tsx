import { useUploadFile } from '@better-upload/client'
import { env } from '../env'

export function ImageUploader() {
  const { upload, progress, isPending, isSuccess, uploadedFile, error } =
    useUploadFile({
      route: 'posts',
      api: `${env.VITE_API_URL}/upload`,
    })

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            upload(e.target.files[0])
          }
        }}
      />
      {isPending && <p>Uploading... {Math.round(progress * 100)}%</p>}
      {isSuccess && uploadedFile && (
        <p>Uploaded: {uploadedFile.objectInfo.key}</p>
      )}
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}
