# Next.js Authentication Starter

A simple Next.js starter template that provides a basic authentication setup using Better Auth. It is intended to be used as a starter or template for new projects.

![Login Page](https://assets.jrfp.dev/nextjs-starter/login-page.png)

![Register Page](https://assets.jrfp.dev/nextjs-starter/register-page.png)

## Tech Stack

- **Framework:** Next.js (App Router)
- **Authentication:** Better Auth
- **Database:** PostgreSQL (pg)
- **Styling:** Tailwind CSS, shadcn/ui
- **Forms & Validation:** React Hook Form, Zod
- **Email:** Resend

## Features

- Email and password authentication
- GitHub OAuth authentication
- Login page
- Register page
- Protected dashboard page
- Session validation

## Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
DATABASE_URL=
RESEND_API_KEY=
```

## Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```text
.
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # Authentication pages
│   │   ├── api/             # API routes
│   │   └── dashboard/       # Protected dashboard pages
│   ├── components/          # Reusable UI components
│   ├── layout/              # Layout definitions
│   └── lib/                 # Core utilities and auth configuration
├── public/                  # Static assets
└── package.json             # Project dependencies and scripts
```
