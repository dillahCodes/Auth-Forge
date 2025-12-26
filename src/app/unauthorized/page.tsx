import Link from "next/link";

export default function UnauthorizedPage() {
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
          className="text-yellow-500"
          aria-hidden
        >
          <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="8" />
          <path
            d="M60 34V66"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="60" cy="84" r="5" fill="currentColor" />
        </svg>

        {/* Title */}
        <h1 className="text-center text-2xl font-bold text-zinc-900 dark:text-white">
          Unauthorized Access
        </h1>

        {/* Message */}
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Your session is missing or has expired.
          <br />
          Please sign in again to continue accessing your account.
        </p>

        {/* Action */}
        <Link
          href="/login"
          className="mt-2 w-full rounded-md bg-yellow-500 py-2 text-center font-semibold text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Go to Login
        </Link>
      </main>
    </div>
  );
}
