import { cn } from "@/lib/utils"

export function InstagramLogo({ className }: { className?: string }) {
  return (
    <h1
      className={cn("text-2xl font-semibold text-white", className)}
      style={{
        fontFamily: "'Segoe Script', 'Dancing Script', cursive",
      }}
    >
      Instagram
    </h1>
  )
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-label="Instagram"
      className={cn("size-6", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
