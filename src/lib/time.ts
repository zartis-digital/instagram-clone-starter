const MINUTE = 60
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY

export function formatRelativeTime(isoString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(isoString).getTime()) / 1000
  )

  if (seconds < MINUTE) return "now"
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m`
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h`
  if (seconds < WEEK) return `${Math.floor(seconds / DAY)}d`
  return `${Math.floor(seconds / WEEK)}w`
}
