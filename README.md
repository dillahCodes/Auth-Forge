<div align="center">

<h1>🔐 AuthForge</h1>

<p>A production-ready, full-stack authentication system built with <strong>Next.js 16</strong> — featuring JWT token rotation, OAuth, 2FA, session management, and more.</p>

<a href="https://authforgeproject.vercel.app/" target="_blank">
  <img src="https://img.shields.io/badge/🚀_Live_Demo-authforgeproject.vercel.app-4f46e5?style=for-the-badge" alt="Live Demo" />
</a>

<br/><br/>

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=flat-square&logo=redis)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss)

</div>

---

## 📖 About

**AuthForge** is a comprehensive, production-grade authentication boilerplate designed to cover every aspect of modern auth systems. Built as a learning resource and a solid foundation for real-world applications, it implements security best practices at every layer — from password hashing and JWT token rotation to replay-attack detection and geographic session tracking.

> 🔗 **Live Demo:** [https://authforgeproject.vercel.app/](https://authforgeproject.vercel.app/)

---

## 🛠️ Tech Stack

| Category             | Technology                                                                           |
| -------------------- | ------------------------------------------------------------------------------------ |
| **Framework**        | [Next.js 16](https://nextjs.org/) (App Router)                                       |
| **UI Library**       | [React 19](https://react.dev/)                                                       |
| **Language**         | [TypeScript 5](https://www.typescriptlang.org/)                                      |
| **Styling**          | [Tailwind CSS 4](https://tailwindcss.com/)                                           |
| **ORM**              | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg`                         |
| **Database**         | [PostgreSQL](https://www.postgresql.org/)                                            |
| **Cache / Session**  | [Redis](https://redis.io/)                                                           |
| **Token**            | [JOSE](https://github.com/panva/jose) (JWT — HS256)                                  |
| **Password Hashing** | [bcrypt](https://github.com/kelektiv/node.bcrypt.js)                                 |
| **OAuth**            | [Google OAuth 2.0](https://developers.google.com/identity) via `google-auth-library` |
| **Email**            | [Resend](https://resend.com/) + [React Email](https://react.email/)                  |
| **Geo IP**           | [MaxMind GeoIP2](https://www.maxmind.com/)                                           |
| **User Agent**       | [ua-parser-js](https://github.com/faisalman/ua-parser-js)                            |
| **HTTP Client**      | [Axios](https://axios-http.com/) + `axios-retry`                                     |
| **Validation**       | [Zod 4](https://zod.dev/)                                                            |
| **Server State**     | [TanStack Query v5](https://tanstack.com/query)                                      |
| **API Docs**         | [Swagger UI React](https://swagger.io/tools/swagger-ui/)                             |
| **Testing**          | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)      |

---

## ✨ Features

- 🔑 **Credentials Auth** — Register and login with email + password
- 🌐 **Google OAuth 2.0** — One-click sign-in with Google
- 🔄 **JWT Token Rotation** — Short-lived access tokens + rotating refresh tokens stored securely
- ⚡ **Redis Session Cache** — Access tokens cached in Redis for ultra-fast validation
- 🛡️ **Replay Attack Detection** — Reuse of a revoked token force-revokes all sessions in the chain
- 📧 **Email Verification** — OTP-based email verification with rate limiting
- 🔐 **2FA (Two-Factor Auth)** — Action-scoped OTP verification for sensitive operations
- 🔃 **Session Management** — View, revoke individual, or bulk-revoke all other sessions
- 🔏 **Change Password** — With bcrypt re-hashing and full session invalidation
- 📨 **Change Email** — With 2FA and pending request management
- ↩️ **Account Revert** — Revert password/email via a tokened revert link sent to old email
- 🔗 **OAuth Provider Management** — Connect/disconnect Google + credentials on the same account
- 🌍 **Geo & Device Tracking** — Sessions store IP, country, city, browser, and OS info
- 📋 **API Documentation** — Full Swagger/OpenAPI docs at `/docs`
- 🧪 **Unit Tests** — Components and hooks tested with Vitest + React Testing Library

---

## 🔄 Authentication Flow

The system implements **18 sequential flow steps** covering the full lifecycle of a user account:

<details>
<summary><strong>01 — Registration</strong></summary>

- User can register with email and password (credentials)
- User can register with Google OAuth
- Password is hashed with bcrypt before storing
- A credentials account is created and linked to the user
- Duplicate email registration is rejected

</details>

<details>
<summary><strong>02 — Login</strong></summary>

- User can login with email and password (credentials)
- User can login with Google OAuth
- Credentials are validated against the stored hashed password
- A credentials account is auto-created if missing on first login
- Google login auto-registers a new user if email is not found
- Invalid credentials return a generic error to prevent enumeration

</details>

<details>
<summary><strong>03 — Sign Token</strong></summary>

- Access token is signed with HS256 and expires in 15 minutes
- Refresh token is signed with HS256 and expires in 7 days
- Access token is stored in Redis for fast session validation
- Refresh token is stored in the database with client and geo info
- Token rotation creates a new session on every refresh
- Old session is marked as replaced by the new session ID

</details>

<details>
<summary><strong>04 — Email Verification</strong></summary>

- A 6-digit OTP is generated and sent to the user's email
- OTP is stored in Redis with a 15-minute TTL
- Sending OTP is rate-limited to 3 requests per 30 minutes
- OTP verification is rate-limited to 5 attempts per 10 minutes
- On success, the user's `verifiedAt` field is updated
- A new access token is issued after successful verification
- OTP keys are deleted from Redis after verification

</details>

<details>
<summary><strong>05 — Session Management</strong></summary>

- User can view all active sessions
- User can revoke a specific session by its ID
- User can revoke all other sessions except the current one
- Replay attack detection: if a revoked refresh token is reused, all sessions are force-revoked
- Session chain traversal ensures all descendant sessions are revoked

</details>

<details>
<summary><strong>06 — Change Name</strong></summary>

- User can update their display name
- New name cannot be the same as the current name
- Rate-limited to 5 requests per 15 minutes
- User must exist to perform the name change

</details>

<details>
<summary><strong>07 — Change Password</strong></summary>

- User must provide the current password to change it
- Only available for accounts with credentials provider
- New password is hashed with bcrypt before storing
- All other sessions are revoked after password change
- A revert account email is sent after password change
- Rate-limited to 5 requests per 15 minutes

</details>

<details>
<summary><strong>08 — 2FA Verification (for Password Change)</strong></summary>

- A 6-digit OTP is sent to the user's registered email
- OTP is scoped to a specific action (e.g., change password, connect provider)
- OTP is stored in Redis with a 15-minute TTL
- Sending OTP is rate-limited to 3 requests per 15 minutes
- Verification is rate-limited to 5 attempts per 15 minutes
- On success, a short-lived 2FA token is issued

</details>

<details>
<summary><strong>09 — Send Revert Account Email (after Password Change)</strong></summary>

- Triggered automatically after a password change
- A unique revert token and token ID are generated
- Revert token is stored in Redis with a 7-day TTL
- A revert link is emailed to the user's current email
- Rate-limited to 3 requests per 15 minutes

</details>

<details>
<summary><strong>10 — Revert Account (after Password Change)</strong></summary>

- User clicks the revert link received via email
- Revert token is validated against the stored Redis token
- User provides a new password to restore account access
- Password is updated and all active sessions are revoked
- Revert token keys are cleaned up from Redis after use

</details>

<details>
<summary><strong>11 — Change Email</strong></summary>

- Only available for accounts using credentials provider
- New email must not be already in use by another account
- New email cannot be the same as the current email
- An email change request is created in the database
- Only one pending email change request is allowed at a time
- User can update or cancel a pending email change request

</details>

<details>
<summary><strong>12 — 2FA Verification (for Email Change)</strong></summary>

- Required before proceeding with email change
- A 6-digit OTP is sent to the new email address
- OTP is stored in Redis with a 15-minute TTL
- Sending OTP is rate-limited to 3 requests per 30 minutes
- Verification is rate-limited to 5 attempts per 10 minutes
- On success, the email change request is marked as verified

</details>

<details>
<summary><strong>13 — Verify New Email</strong></summary>

- User submits the OTP sent to the new email address
- OTP must match the one stored in Redis
- On success, the user's email is updated to the new email
- The user's `verifiedAt` timestamp is refreshed
- All other sessions are revoked after email update
- A revert account email is sent to the old email address

</details>

<details>
<summary><strong>14 — Send Revert Account Email (after Email Change)</strong></summary>

- Triggered automatically after a successful email change
- Revert email is sent to the user's old email address
- A unique revert token and token ID are generated
- Revert token is stored in Redis with a 7-day TTL
- Rate-limited to 3 requests per 15 minutes

</details>

<details>
<summary><strong>15 — Revert Account (after Email Change)</strong></summary>

- User clicks the revert link sent to the old email
- Revert token ID is validated against Redis
- Email change request record is retrieved and verified
- User provides a new password to restore account access
- Email is reverted back to the old email address
- All active sessions are revoked after account revert

</details>

<details>
<summary><strong>16 — Manage OAuth Providers</strong></summary>

- User can connect a Google account to their profile
- User can disconnect a linked Google account
- User can connect a credentials provider by setting a password
- User can disconnect credentials by removing the password
- Cannot disconnect the only remaining provider
- Cannot disconnect the provider currently used for the session
- All other sessions are revoked after connecting or disconnecting a provider

</details>

<details>
<summary><strong>17 — 2FA Verification (for OAuth Provider Change)</strong></summary>

- Required before connecting or disconnecting an OAuth provider
- A 6-digit OTP is sent to the user's registered email
- OTP scope is tied to the specific action being performed
- OTP is stored in Redis with a 15-minute TTL
- Sending OTP is rate-limited to 3 requests per 15 minutes
- On success, a short-lived 2FA token is issued to authorize the action

</details>

<details>
<summary><strong>18 — Logout</strong></summary>

- User can logout from the current session
- The session record is revoked in the database
- The access token is removed from Redis
- Auth cookies are cleared from the browser

</details>

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, register, verify, etc.)
│   ├── api/             # API route handlers
│   ├── dashboard/       # Protected dashboard page
│   ├── docs/            # Swagger API documentation
│   └── profile/         # User profile page
├── features/
│   ├── auth/            # Auth feature (components, hooks, services, schemas)
│   ├── home/            # Landing page + app flow documentation
│   └── cron/            # Cron job feature
├── shared/              # Shared utilities, UI components, hooks
├── middlewares/         # Custom middleware (auth guards, rate limiting)
├── routers/             # API route definitions
└── styles/              # Global CSS
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis instance
- Google OAuth credentials
- Resend API key
- MaxMind GeoIP2 database

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/dillahCodes/Auth-Forge.git
   cd Auth-Forge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # Fill in your values in .env
   ```

4. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

6. **Expose port 3000 to the public (required for OAuth & email redirects)**

   Several features — such as **Google OAuth callbacks** and **email redirect links** (verification, revert account) — require a publicly accessible URL. In local development, you can use one of the options below to forward port `3000`:

   **Option A — ngrok (recommended)**

   ```bash
   # Install ngrok: https://ngrok.com/download
   ngrok http 3000
   ```

   Copy the generated HTTPS URL (e.g. `https://xxxx.ngrok-free.app`) and set it as your `NEXT_PUBLIC_BASE_URL` (and Google OAuth redirect URI) in your `.env` file.

   **Option B — VSCode Ports (if using VS Code / GitHub Codespaces)**

   1. Open the **Ports** panel in VS Code (`Ctrl+Shift+P` → *Ports: Focus on Ports View*).
   2. Click **Forward a Port** and enter `3000`.
   3. Set the port visibility to **Public**.
   4. Copy the forwarded URL and use it as your `NEXT_PUBLIC_BASE_URL` in `.env`.

   > **Note:** Remember to update your **Google Cloud Console** OAuth 2.0 redirect URIs with the new public URL whenever it changes.

---

## 🧪 Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Generate coverage report
npm run test:coverage
```

---

## 📜 License

MIT License — feel free to use this as a foundation for your own projects.

---

<div align="center">

Made with ❤️ using Next.js, PostgreSQL, and Redis

**[🌐 View Live Demo](https://authforgeproject.vercel.app/)**

</div>
