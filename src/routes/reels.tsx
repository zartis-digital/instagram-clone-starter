import { createFileRoute, redirect } from "@tanstack/react-router"
import { Sidebar } from "../components/sidebar/sidebar"
import { useSidebar } from "../components/sidebar/sidebar-context"
import { SearchSheet } from "../components/sidebar/search-sheet"
import { NotificationsSheet } from "../components/sidebar/notifications-sheet"
import { ReelCard } from "../components/reels/reel-card"
import { mockReels } from "../lib/mock-data"

export const Route = createFileRoute("/reels")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/sign-in" })
  },
  component: ReelsPage,
})

function ReelsPage() {
  const { activeSheet, closeSheet } = useSidebar()

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <SearchSheet />
      <NotificationsSheet />
      {activeSheet && (
        <div
          className="fixed inset-0 z-30"
          onClick={closeSheet}
          aria-hidden="true"
        />
      )}

      {/* Native CSS scroll buttons */}
      <style>{`
        .reels-scroll {
          anchor-name: --reels-carousel;
        }

        .reels-scroll::scroll-button(*) {
          position: fixed;
          right: 32px;
          z-index: 40;
          border: 0;
          width: 56px;
          height: 56px;
          border-radius: 9999px;
          background: #363636;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          transition: background 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reels-scroll::scroll-button(*):hover {
          background: #4a4a4a;
        }

        .reels-scroll::scroll-button(*):disabled {
          opacity: 0.3;
          cursor: default;
        }

        .reels-scroll::scroll-button(up) {
          content: "‹" / "Scroll up";
          top: calc(50% - 48px);
          rotate: 90deg;
        }

        .reels-scroll::scroll-button(down) {
          content: "›" / "Scroll down";
          top: calc(50% + 24px);
          rotate: 90deg;
        }
      `}</style>

      {/* Reels feed — vertical snap scroll with native CSS scroll buttons */}
      <div
        className="reels-scroll h-screen snap-y snap-mandatory overflow-y-auto scroll-smooth pl-[72px]"
        style={{ scrollbarWidth: "none" }}
      >
        {mockReels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </div>
  )
}
