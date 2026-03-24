import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useLoginMutation } from "../queries/auth"
import { ApiError } from "../lib/api"

export const Route = createFileRoute("/sign-in")({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: "/" })
  },
  component: SignIn,
})

function InstagramGradientLogo() {
  return (
    <svg
      className="size-14"
      viewBox="0 0 48 48"
      fill="none"
      aria-label="Instagram"
    >
      <defs>
        <radialGradient
          id="ig-gradient"
          cx="30%"
          cy="107%"
          r="150%"
          fx="30%"
          fy="107%"
        >
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="12"
        stroke="url(#ig-gradient)"
        strokeWidth="3"
        fill="none"
      />
      <circle
        cx="24"
        cy="24"
        r="9"
        stroke="url(#ig-gradient)"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="35.5" cy="12.5" r="2.5" fill="url(#ig-gradient)" />
    </svg>
  )
}

function MetaLogo() {
  return (
    <svg
      className="h-4"
      viewBox="0 0 80 20"
      fill="currentColor"
      aria-label="Meta"
    >
      <text
        x="0"
        y="16"
        fontSize="16"
        fontFamily="system-ui, sans-serif"
        fontWeight="400"
        letterSpacing="1"
      >
        Meta
      </text>
    </svg>
  )
}

function SignIn() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const loginMutation = useLoginMutation()

  const isFormValid = identifier.length > 0 && password.length >= 6

  const errorMessage =
    loginMutation.error instanceof ApiError && loginMutation.error.status === 401
      ? "Invalid email or password"
      : loginMutation.error
        ? "Something went wrong. Please try again."
        : null

  return (
    <div className="flex min-h-svh flex-col bg-[#181c2f] text-white">
      <div className="flex flex-1">
        {/* Left hero */}
        <div className="hidden flex-1 flex-col px-12 pt-10 pb-24 lg:flex">
          <InstagramGradientLogo />

          <div className="mt-12 max-w-lg">
            <h1 className="text-[42px] leading-[1.15] font-light tracking-tight">
              See everyday moments from your{" "}
              <span
                className="font-normal"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #3b9c3f, #8bc34a, #f5c518, #e87b2f)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                close friends
              </span>
              .
            </h1>
          </div>

          {/* Phone card collage */}
          <div className="relative mt-10 flex flex-1 items-center justify-center">
            <div className="relative h-[460px] w-[500px]">
              {/* Left card — tilted left */}
              <div
                className="absolute top-8 left-0 h-[380px] w-[220px] overflow-hidden rounded-3xl bg-white/10 shadow-2xl"
                style={{ transform: "rotate(-8deg)" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=220&h=380&fit=crop"
                  alt="Fashion portrait"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Right card — tilted right */}
              <div
                className="absolute top-4 right-0 h-[380px] w-[220px] overflow-hidden rounded-3xl bg-white/10 shadow-2xl"
                style={{ transform: "rotate(6deg)" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=220&h=380&fit=crop"
                  alt="Person playing guitar"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Center card — front, no tilt */}
              <div className="absolute top-2 left-1/2 z-10 h-[420px] w-[250px] -translate-x-1/2 overflow-hidden rounded-3xl bg-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=250&h=420&fit=crop"
                  alt="Friends hanging out"
                  className="h-full w-full object-cover"
                />
                {/* Bottom phone UI overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <div className="h-9 flex-1 rounded-full border-2 border-white/50" />
                  <svg
                    className="size-6 text-white/70"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              </div>

              {/* Emoji reaction bubble — top area */}
              <div className="absolute top-0 left-[140px] z-20 flex items-center gap-0.5 rounded-full bg-white px-3 py-1.5 shadow-lg">
                <span className="text-lg">🔮</span>
                <span className="text-lg">👀</span>
                <span className="text-lg">🍪</span>
              </div>

              {/* Green close-friends star badge — right */}
              <div className="absolute top-[100px] right-[-10px] z-20 flex items-center gap-1 rounded-full bg-[#3cb043] px-2.5 py-1.5 shadow-lg">
                <svg
                  className="size-4 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3 6 7 1-5 5 1.2 7L12 17.5 5.8 21 7 14 2 9l7-1z" />
                </svg>
                <svg
                  className="size-3 text-white"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <path d="M3 4l3 3.5L9 4" />
                </svg>
              </div>

              {/* Red heart — bottom left */}
              <div className="absolute bottom-[90px] left-[-12px] z-20">
                <svg className="size-10 drop-shadow-lg" viewBox="0 0 24 24" fill="#ff3040">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>

              {/* Story ring profile — bottom right */}
              <div className="absolute right-[20px] bottom-[50px] z-20">
                <div className="rounded-full p-[3px]" style={{ background: "linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)" }}>
                  <div className="size-14 overflow-hidden rounded-full border-2 border-[#181c2f]">
                    <img
                      src="https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=56&h=56&fit=crop&crop=face"
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex w-full flex-col items-center justify-center px-8 lg:w-[480px] lg:bg-[#0d1017]">
          <div className="w-full max-w-[400px]">
            <h2 className="mb-6 text-lg font-semibold">Log into Instagram</h2>

            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                if (!isFormValid) return
                loginMutation.mutate({ email: identifier, password })
              }}
            >
              <Input
                type="text"
                placeholder="Email address"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-12 rounded-2xl border-white/20 bg-transparent px-4 text-sm text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/10"
                aria-label="Email address"
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl border-white/20 bg-transparent px-4 text-sm text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-white/10"
                aria-label="Password"
              />

              {errorMessage && (
                <p className="text-center text-sm text-red-400">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={!isFormValid || loginMutation.isPending}
                className="mt-1 h-12 w-full rounded-2xl bg-[#0064e0] text-sm font-semibold text-white transition-colors hover:bg-[#0056c7] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loginMutation.isPending ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-white/80 hover:text-white">
                Forgot password?
              </a>
            </div>

            <div className="my-6 h-px w-full bg-white/10" />

            {/* Facebook login */}
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/20 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Log in with Facebook
            </button>

            {/* Create account */}
            <Link
              to="/sign-up"
              className="mt-3 flex h-12 w-full items-center justify-center rounded-2xl border border-white/20 text-sm font-semibold text-[#0095f6] transition-colors hover:bg-white/5"
            >
              Create new account
            </Link>

            {/* Meta logo */}
            <div className="mt-8 flex justify-center text-white/50">
              <MetaLogo />
            </div>

            {/* Unlawful content notice */}
            <p className="mt-5 text-center text-xs leading-relaxed text-white/40">
              You can also{" "}
              <a href="#" className="text-white/60 underline">
                report content you believe is unlawful
              </a>{" "}
              in your country without logging in.
            </p>
          </div>
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
            "Meta AI",
            "Threads",
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
