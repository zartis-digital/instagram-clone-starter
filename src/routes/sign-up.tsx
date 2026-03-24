import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useRegisterMutation } from "../queries/auth"
import { ApiError } from "../lib/api"

export const Route = createFileRoute("/sign-up")({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: "/" })
  },
  component: SignUp,
})

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i)

function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [birthMonth, setBirthMonth] = useState("")
  const [birthDay, setBirthDay] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const registerMutation = useRegisterMutation()

  const isFormValid =
    email.length > 0 && password.length >= 6 && username.length > 0 && fullName.length > 0

  const errorMessage =
    registerMutation.error instanceof ApiError && registerMutation.error.status === 409
      ? "This email is already in use"
      : registerMutation.error
        ? "Something went wrong. Please try again."
        : null

  const selectClasses =
    "h-12 w-full appearance-none rounded-2xl border border-white/20 bg-transparent px-4 pr-10 text-sm text-white outline-none transition-colors focus:border-white/40 focus:ring-[3px] focus:ring-white/10"

  return (
    <div className="flex min-h-svh flex-col bg-[#181c2f] text-white">
      <div className="flex flex-1 justify-center px-4 pt-8 pb-12">
        <div className="w-full max-w-[440px]">
          {/* Back button */}
          <Link to="/sign-in" className="mb-4 inline-flex text-white/70 hover:text-white">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>

          {/* Meta logo */}
          <div className="mb-4 text-sm text-white/70">
            <svg className="h-4" viewBox="0 0 60 16" fill="currentColor" aria-label="Meta">
              <text x="0" y="13" fontSize="14" fontFamily="system-ui, sans-serif" fontWeight="400" letterSpacing="1">
                Meta
              </text>
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold">Get started on Instagram</h1>
          <p className="mt-1 text-sm text-white/60">
            Sign up to see photos and videos from your friends.
          </p>

          <form
            className="mt-8 flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault()
              if (!isFormValid) return
              registerMutation.mutate({
                email,
                password,
                username,
                displayName: fullName,
              })
            }}
          >
            {/* Mobile number or email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Mobile number or email</label>
              <Input
                type="text"
                placeholder="Mobile number or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-2xl border-white/20 bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/10"
              />
              <p className="text-xs leading-relaxed text-white/50">
                You may receive notifications from us.{" "}
                <a href="#" className="text-[#4cb5f9] hover:underline">
                  Learn why we ask for your contact information
                </a>
              </p>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Password</label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl border-white/20 bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/10"
              />
            </div>

            {/* Birthday */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold">
                Birthday
                <svg className="size-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="" disabled>Month</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m} className="bg-[#181c2f]">{m}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/50" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </div>
                <div className="relative w-[100px]">
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="" disabled>Day</option>
                    {DAYS.map((d) => (
                      <option key={d} value={d} className="bg-[#181c2f]">{d}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/50" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </div>
                <div className="relative w-[110px]">
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className={selectClasses}
                  >
                    <option value="" disabled>Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y} className="bg-[#181c2f]">{y}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/50" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Name</label>
              <Input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 rounded-2xl border-white/20 bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/10"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Username</label>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 rounded-2xl border-white/20 bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/10"
              />
            </div>

            {/* Legal text */}
            <div className="flex flex-col gap-3 text-xs leading-relaxed text-white/50">
              <p>
                People who use our service may have uploaded your contact information to
                Instagram.{" "}
                <a href="#" className="text-[#4cb5f9] hover:underline">Learn more</a>.
              </p>
              <p>
                By tapping Submit, you agree to create an account and to Instagram&apos;s{" "}
                <a href="#" className="text-[#4cb5f9] hover:underline">Terms</a>.
                Learn how we collect, use and share your data in our{" "}
                <a href="#" className="text-[#4cb5f9] hover:underline">Privacy Policy</a>{" "}
                and how we use cookies and similar technology in our{" "}
                <a href="#" className="text-[#4cb5f9] hover:underline">Cookies Policy</a>.
              </p>
              <p>
                The <a href="#" className="text-[#4cb5f9] hover:underline">Privacy Policy</a>{" "}
                describes the ways we can use the information we collect when you create an
                account. For example, we use this information to provide, personalize and
                improve our products, including ads.
              </p>
            </div>

            {errorMessage && (
              <p className="text-center text-sm text-red-400">{errorMessage}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || registerMutation.isPending}
              className="h-12 w-full rounded-2xl bg-[#0064e0] text-sm font-semibold text-white transition-colors hover:bg-[#0056c7] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {registerMutation.isPending ? "Creating account..." : "Submit"}
            </button>

            {/* Already have account */}
            <Link
              to="/sign-in"
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-white/20 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              I already have an account
            </Link>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0d1017] py-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/40">
          {[
            "Meta",
            "About",
            "Blog",
            "Jobs",
            "Help",
            "API",
            "Privacy",
            "Terms",
            "Locations",
            "Instagram Lite",
            "Contact Uploading & Non-Users",
            "Meta Verified",
          ].map((item) => (
            <a key={item} href="#" className="hover:text-white/60">
              {item}
            </a>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/40">
          <button type="button" className="flex items-center gap-1">
            English
            <svg className="size-3" viewBox="0 0 12 12" fill="currentColor">
              <path d="M3 5l3 3 3-3H3z" />
            </svg>
          </button>
          <span>&copy; 2026 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  )
}
