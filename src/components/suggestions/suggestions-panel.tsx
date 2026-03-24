import { useAuthUser } from "../../queries/auth"
import { useSuggestionsQuery } from "../../queries/suggestions"
import { SuggestionItem } from "./suggestion-item"

const footerLinks = [
  "About",
  "Help",
  "Press",
  "API",
  "Jobs",
  "Privacy",
  "Terms",
  "Locations",
  "Language",
  "Meta Verified",
]

export function SuggestionsPanel() {
  const { data: currentUser } = useAuthUser()
  const { data: suggestions } = useSuggestionsQuery()

  return (
    <div className="w-80 pl-16 pt-8">
      {/* Current user section */}
      {currentUser && (
        <div className="mb-5 flex items-center gap-3">
          <img
            src={currentUser.avatarUrl ?? undefined}
            alt={currentUser.username}
            className="h-11 w-11 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">
              {currentUser.username}
            </p>
            <p className="text-sm text-[#a8a8a8]">{currentUser.displayName}</p>
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-[#0095f6]"
          >
            Switch
          </button>
        </div>
      )}

      {/* Suggestions header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#a8a8a8]">
          Suggested for you
        </span>
        {suggestions && suggestions.length > 0 && (
          <button
            type="button"
            className="text-xs font-semibold text-white hover:text-[#a8a8a8]"
          >
            See All
          </button>
        )}
      </div>

      {/* Suggestions list */}
      {suggestions && suggestions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {suggestions.map((suggestion) => (
            <SuggestionItem key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#a8a8a8]">
          No suggestions at the moment.
        </p>
      )}

      {/* Footer links */}
      <div className="mt-8">
        <div className="flex flex-wrap gap-x-1 text-xs text-[#a8a8a8]/50">
          {footerLinks.map((link, index) => (
            <span key={link}>
              {link}
              {index < footerLinks.length - 1 && (
                <span className="ml-1">&middot;</span>
              )}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#a8a8a8]/50">
          &copy; 2026 INSTAGRAM FROM META
        </p>
      </div>
    </div>
  )
}
