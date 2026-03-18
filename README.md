# Bookmark

A personal bookmark manager built with Next.js. Save, organize and share your links publicly via a `/{username}` profile page.

## Features

- Save bookmarks with automatic OG preview (title, description, image)
- Organize with **collections** and **tags**
- Mark bookmarks as **favorites**
- Drag-and-drop **reordering**
- **Click counter** per bookmark
- Public `/{username}` profile page to share your links
- Email/password and GitHub OAuth authentication

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Auth:** Better Auth
- **Database:** PostgreSQL via Knex.js
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms & Validation:** React Hook Form + Zod
- **Drag and Drop:** @dnd-kit
- **Email:** Resend

## Getting Started

**1. Install dependencies**

```bash
npm install
```

**2. Set up environment variables**

Copy `.env.example` to `.env` and fill in the values:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
DATABASE_URL=
RESEND_API_KEY=
```

**3. Run database migrations**

```bash
npx knex migrate:latest
```

**4. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/       # Login and register pages
│   ├── dashboard/    # Protected dashboard
│   ├── [username]/   # Public profile page
│   └── api/          # Public API routes
├── actions/          # Server Actions (authenticated mutations)
├── components/       # UI components (bookmark, collection, tag)
├── db/
│   └── migrations/   # Knex migrations
├── lib/              # Auth, DB client, OG fetcher, utilities
└── types/            # Shared TypeScript types
```

## License

[MIT](LICENSE)
