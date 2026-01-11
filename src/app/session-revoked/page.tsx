import Link from "next/link";

export default function SessionRevokedPage() {
  return (
    <main className="flex w-full max-w-md flex-col items-center gap-6 p-3 border-2 shadow-strong">
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
      <h1 className="text-center text-2xl font-bold text-dark">Session Revoked</h1>

      {/* Message */}
      <p className="text-center text-sm text-dark-7">
        For security reasons, your session has been revoked.
        <br />
        This may happen if you logged out from another device or your session was
        terminated by the system.
      </p>

      {/* Action */}
      <Link
        href="/login"
        className="mt-2 w-full bg-danger border-2 py-2 text-center font-semibold text-white border-dark hover:opacity-70 transition-all duration-300"
      >
        Go to Login
      </Link>
    </main>
  );
}
