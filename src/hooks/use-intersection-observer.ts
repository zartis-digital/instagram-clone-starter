import { useCallback, useRef } from "react"

export function useIntersectionObserver(
  onIntersect: () => void,
  options: { enabled?: boolean; rootMargin?: string } = {}
) {
  const { enabled = true, rootMargin = "200px" } = options
  const observer = useRef<IntersectionObserver | null>(null)

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) {
        observer.current.disconnect()
        observer.current = null
      }

      if (!node || !enabled) return

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            onIntersect()
          }
        },
        { rootMargin }
      )

      observer.current.observe(node)
    },
    [onIntersect, enabled, rootMargin]
  )

  return ref
}
