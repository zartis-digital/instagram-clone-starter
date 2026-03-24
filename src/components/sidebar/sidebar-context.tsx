import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useRouterState } from "@tanstack/react-router"

export type ActiveSheet = "search" | "notifications" | null

interface SidebarContextValue {
  activeSheet: ActiveSheet
  toggleSheet: (sheet: "search" | "notifications") => void
  closeSheet: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>(null)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Auto-close any open sheet whenever the route changes — opening Search /
  // Notifications and then clicking a sidebar link should land on the new
  // page with the sheet collapsed.
  useEffect(() => {
    setActiveSheet(null)
  }, [pathname])

  const toggleSheet = useCallback((sheet: "search" | "notifications") => {
    setActiveSheet((prev) => (prev === sheet ? null : sheet))
  }, [])

  const closeSheet = useCallback(() => {
    setActiveSheet(null)
  }, [])

  return (
    <SidebarContext value={{ activeSheet, toggleSheet, closeSheet }}>
      {children}
    </SidebarContext>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}
