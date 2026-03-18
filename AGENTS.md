# AGENTS.md

You are an AI assistant helping develop **Bookmark**, a personal bookmark manager built with Next.js App Router.

---

## Project Overview

Bookmark lets users save, organize and share links publicly via a `/{username}` profile page.
It includes collections, tags, favorites, drag-and-drop reordering, OG preview fetching and a click counter.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Auth:** Better Auth (email/password + GitHub OAuth)
- **Database:** PostgreSQL via Knex.js
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod
- **Drag and drop:** @dnd-kit/core + @dnd-kit/sortable
- **Email:** Resend

---

## Project Structure
```
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── (auth)/           # Login and register pages (no layout)
│   ├── dashboard/        # Protected dashboard with layout
│   ├── [username]/       # Public profile page
│   └── api/              # API routes (public/anonymous only)
├── actions/              # Server Actions (authenticated mutations)
├── components/
│   ├── ui/               # shadcn/ui primitives — do not edit manually
│   ├── bookmark/         # Bookmark-related components
│   ├── collection/       # Collection-related components
│   └── tag/              # Tag-related components
├── db/
│   └── migrations/       # Knex migrations — never edit existing ones
├── lib/                  # Core utilities (auth, db, og, bookmarks)
└── types/                # Shared TypeScript types
```

---

## Conventions

### Git
- Branch names mirror commit prefixes: `feat/`, `fix/`, `refactor/`, `chore/`
- Always use a branch and open a PR — never push directly to `main`
- Follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`

### Database
- Table and column names use **snake_case**
- Always create a `down()` function in every migration
- Never edit existing migration files — create a new one instead
- Run `npx knex migrate:latest` after creating a migration

### Server Actions vs API Routes
- Authenticated mutations → Server Actions in `src/actions/`
- Public/anonymous endpoints → API Routes in `src/app/api/`

### Server Actions
- Always call `getSession()` before any query
- Always check ownership (`user_id`) before update or delete
- Always call `revalidatePath('/dashboard')` after mutations

### Components
- Pages are Server Components by default
- Only use `'use client'` when the component uses hooks or browser APIs
- If a page uses `useSearchParams()`, extract it into a separate client component and wrap with `<Suspense>`

### TypeScript
- Never use `any`
- Never suppress TypeScript or ESLint errors — fix them

---

## Rules

- Do not edit files inside `src/components/ui/` — managed by shadcn
- Do not edit files inside `src/db/migrations/` — managed by Knex
- Do not use `any` in TypeScript
- Do not commit `.env` or any file containing secrets
- Do not make database changes without a migration
- Do not push directly to `main` — always use a branch and a PR
- Do not ignore TypeScript or ESLint errors — fix them, never suppress them
- Do not use `varchar(255)` for URL columns — always use `text`
- Do not trust `user_id` from the client — always read from session
