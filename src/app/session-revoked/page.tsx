import Link from "next/link";

export default function SessionRevokedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900">
        {/* SVG Illustration */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-red-600"
          aria-hidden
        >
          <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="8" />
          <path
            d="M40 40L80 80M80 40L40 80"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-zinc-900 dark:text-white">
          Session Revoked
        </h1>

        {/* Message */}
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          For security reasons, your session has been revoked.
          <br />
          This may happen if you logged out from another device or your session was
          terminated by the system.
        </p>

        {/* Action */}
        <Link
          href="/login"
          className="mt-2 w-full rounded-md bg-red-600 py-2 text-center font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Go to Login
        </Link>
      </main>
    </div>
  );
}
