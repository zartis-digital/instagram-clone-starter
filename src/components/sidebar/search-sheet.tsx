import { cn } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"
import { Loader2, Search, X } from "lucide-react"
import { useRef, useState } from "react"
import { useDebouncedValue } from "../../hooks/use-debounce"
import {
  useClearRecentSearchesMutation,
  useDeleteRecentSearchMutation,
  useRecentSearchesQuery,
  useRecordRecentSearchMutation,
  useSearchUsersQuery,
} from "../../queries/search"
import { useSidebar } from "./sidebar-context"

function SearchResultItem({
  user,
  onClick,
}: {
  user: { id: number; username: string; displayName: string; avatarUrl: string | null }
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-6 py-2 hover:bg-white/5 cursor-pointer text-left"
    >
      <img
        src={user.avatarUrl ?? ""}
        alt={user.username}
        className="size-11 rounded-full object-cover bg-[#262626]"
      />
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-white truncate block">
          {user.username}
        </span>
        <span className="text-sm text-[#a8a8a8] truncate block">
          {user.displayName}
        </span>
      </div>
    </button>
  )
}

function RecentSearchItem({
  user,
  onClick,
  onRemove,
}: {
  user: { id: number; username: string; displayName: string; avatarUrl: string | null }
  onClick: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-2 hover:bg-white/5 cursor-pointer">
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 items-center gap-3 min-w-0 text-left"
      >
        <img
          src={user.avatarUrl ?? ""}
          alt={user.username}
          className="size-11 rounded-full object-cover bg-[#262626]"
        />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-white truncate block">
            {user.username}
          </span>
          <span className="text-sm text-[#a8a8a8] truncate block">
            {user.displayName}
          </span>
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="p-1 text-[#a8a8a8] hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

export function SearchSheet() {
  const { activeSheet, closeSheet } = useSidebar()
  const isOpen = activeSheet === "search"
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query.trim(), 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const searchResults = useSearchUsersQuery(debouncedQuery)
  const recentSearches = useRecentSearchesQuery()
  const recordRecentSearch = useRecordRecentSearchMutation()
  const deleteRecentSearch = useDeleteRecentSearchMutation()
  const clearRecentSearches = useClearRecentSearchesMutation()

  const handleUserClick = (user: { id: number; username: string }) => {
    recordRecentSearch.mutate(user.id)
    closeSheet()
    navigate({ to: "/$username", params: { username: user.username } })
  }

  const isSearching = debouncedQuery.length > 0

  return (
    <div
      className={cn(
        "fixed top-0 z-40 h-screen w-[397px] rounded-r-2xl border-r border-[#262626] bg-black shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out",
        isOpen
          ? "left-[72px] opacity-100"
          : "left-[72px] -translate-x-full opacity-0 pointer-events-none"
      )}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-3">
        <h2 className="text-2xl font-bold text-white mb-8">Search</h2>

        {/* Search input */}
        <div className="relative">
          <div className="flex items-center gap-3 rounded-lg bg-[#262626] px-4 py-2.5">
            <Search className="size-4 text-[#a8a8a8] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-[#a8a8a8] outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="flex-shrink-0"
              >
                <div className="flex size-4 items-center justify-center rounded-full bg-[#a8a8a8]">
                  <X className="size-2.5 text-black" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-0 my-3 h-px bg-[#262626]" />

      {/* Results section */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <>
            {searchResults.isLoading ? (
              <div className="flex items-center justify-center pt-12">
                <Loader2 className="size-6 animate-spin text-[#a8a8a8]" />
              </div>
            ) : searchResults.data && searchResults.data.length > 0 ? (
              searchResults.data.map((user) => (
                <SearchResultItem
                  key={user.id}
                  user={user}
                  onClick={() => handleUserClick(user)}
                />
              ))
            ) : (
              <div className="flex items-center justify-center pt-12">
                <span className="text-sm font-semibold text-[#a8a8a8]">
                  No results found.
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            {recentSearches.data && recentSearches.data.length > 0 ? (
              <>
                <div className="flex items-center justify-between px-6 pb-2">
                  <span className="text-base font-bold text-white">Recent</span>
                  <button
                    type="button"
                    onClick={() => clearRecentSearches.mutate()}
                    className="text-sm font-semibold text-[#0095f6] hover:text-white"
                  >
                    Clear all
                  </button>
                </div>
                {recentSearches.data.map((entry) => (
                  <RecentSearchItem
                    key={entry.id}
                    user={entry.searchedUser}
                    onClick={() => handleUserClick(entry.searchedUser)}
                    onRemove={() => deleteRecentSearch.mutate(entry.id)}
                  />
                ))}
              </>
            ) : (
              <div className="flex items-center justify-center pt-12">
                <span className="text-sm font-semibold text-[#a8a8a8]">
                  No recent searches.
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
