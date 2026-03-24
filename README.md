# Instagram clone — starter

A standalone TanStack Start + React + Tailwind v4 frontend that talks to a hosted Hono API. Use it as the starting point for the workshop.

## Stack

- **TanStack Start** (file-based routing in [src/routes](src/routes))
- **TanStack Query** for server state
- **Tailwind v4** with [shadcn/ui](https://ui.shadcn.com)-style primitives in [src/components/ui](src/components/ui)
- **Vite 7** + **Bun** as the package manager

## Setup

```bash
bun install
cp .env.example .env.local   # then edit if you want to point at a different API
bun dev                       # http://localhost:3000
```

## Environment variables

Copy [.env.example](.env.example) to `.env.local` and adjust:

| Var | Purpose |
| --- | --- |
| `VITE_API_URL` | HTTP origin of the API (login, posts, etc.) |
| `VITE_WS_URL` | WebSocket origin for live chat |
| `VITE_STORAGE_PUBLIC_URL` | Public origin where uploaded images are served |

Defaults live in [src/env.ts](src/env.ts) and assume `localhost:4000` if nothing is set.

## Scripts

```bash
bun dev          # start the Vite dev server on :3000
bun run build    # production build into dist/
bun run preview  # serve the production build locally
bun run lint     # eslint
bun run typecheck
```

`bun run build` produces a static `dist/` directory you can deploy to any static host (Vercel, Netlify, Cloudflare Pages, S3, your own server, …).

## Adding shadcn/ui components

[components.json](components.json) is configured for a flat shadcn project, so:

```bash
pnpm dlx shadcn@latest add <component>
```

drops new primitives into [src/components/ui](src/components/ui).
