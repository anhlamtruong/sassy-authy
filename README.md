# Sassy Authy

A Next.js 14 app implementing a full authentication system with email verification,
password reset, and optional two-factor authentication (2FA). It uses Next server
actions for auth flows, Prisma for database access, and Resend for sending
transactional emails.

Features

- Local credentials sign-up and sign-in
- Email verification flow (verification tokens + verification page)
- Password reset (token + reset page)
- Optional two-factor authentication (2FA) via emailed codes
- Role-based server actions (example: `admin` action)
- Server-side middleware to protect routes and support CORS for API prefixes

Quick start

1. Install dependencies

```bash
npm install
```

2. Create a .env file (copy `.env.example` or add the variables below) and set the
   necessary environment variables (database, Resend API key, etc.).

3. Run Prisma generate + migrations (if applicable)

```bash
npm run prisma:generate
# or if you use the provided prisma commands
npm run prisma-all
```

4. Start development server

```bash
npm run dev
```

Open http://localhost:3000

Important environment variables

- DATABASE_URL — Prisma connection string
- RESEND_API_KEY — Resend API key used to send transactional emails
- RESEND_EMAIL_ID or NEXT_PUBLIC_RESEND_EMAIL_ID — From email for outgoing messages
- NEXT_PUBLIC_APP_URL — Public URL used in email links (e.g., http://localhost:3000)
- ALLOWED_ORIGIN / ALLOWED_METHODS / ALLOWED_HEADERS / EXPOSED_HEADERS — CORS config
- CREDENTIALS — whether to allow credentials for CORS (true/false)

Key files & folders

- `app/` — Next.js app routes and pages
  - `app/auth/*` — auth UI pages (login, register, reset, etc.)
  - `app/(protected)` — protected app pages
- `actions/` — server actions for auth flows (login, register, logout, reset, settings)
- `components/email/` — React email templates used with Resend
- `lib/` — helpers: `mail.ts` (Resend wrapper), `tokens.ts` (token generation), `db/` (Prisma client)
- `data/` — small data access helpers (verification-token, password_reset_token, user, two_factor_token)

How the login flow works (brief)

1. User submits credentials via the login form which calls the `actions/login` server action.
2. Server validates input, checks if email is verified, optionally triggers the 2FA flow.
3. The action calls `signIn('credentials', ...)` which creates the session and redirects.

Notes about redirects and server-actions

- Next's server actions may trigger redirects by throwing a sentinel error
  (digest includes `NEXT_REDIRECT`). Do not swallow this error in a top-level
  try/catch or redirects won't run — allow it to bubble (or detect and rethrow).

Testing email templates

- `components/email/*` are the React components used by `lib/mail.ts`. Test by
  sending emails with your Resend API key to a test mailbox or using Resend preview.

Middleware

- `middleware.ts` protects routes and sets CORS headers for `apiPublicPrefix`.
  If you need to tweak redirects after logout or special auth flows, update
  the middleware's conditions (e.g., avoid swallowing Next redirect sentinel).

Scripts

- `npm run dev` — start Next dev server
- `npm run build` — build app for production
- `npm run start` — run built app
- `npm run prisma:*` — Prisma helper scripts (generate/migrate/push)

Troubleshooting

- NEXT_REDIRECT logged as an error: Your code likely caught and logged Next's
  redirect sentinel. Detect and rethrow it (or use `signIn(..., { redirect: false })`
  and handle redirect client-side).
- Emails not sending: verify `RESEND_API_KEY` and `RESEND_EMAIL_ID` env vars and
  that `NEXT_PUBLIC_APP_URL` is correct for links.
- Middleware blocking redirects after logout: make sure `logout` action rethrows
  the NEXT_REDIRECT sentinel, or use `redirect: false` and perform client redirect.

Further improvements

- Add unit tests for actions (mock `prismaAuthenticate` and `resend`)
- Add background job / retry for failed email sends
- Add logging/observability (structured logger + correlation IDs)

Contributing

- Fork, create a branch, open a PR with a clear description and tests if
  applicable.

License

- MIT (or choose your preferred license)

If you'd like, I can also add an `.env.example` template and a short developer
guide for running the Prisma database locally.
