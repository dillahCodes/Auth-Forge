import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex w-full max-w-md flex-col items-center gap-6 border-2 shadow-strong p-3">
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
        <path d="M60 34V66" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <circle cx="60" cy="84" r="5" fill="currentColor" />
      </svg>

      {/* Title */}
      <h1 className="text-center text-2xl font-bold text-dark">Unauthorized Access</h1>

      {/* Message */}
      <p className="text-center text-sm text-dark-7">
        Your session is missing or has expired.
        <br />
        Please sign in again to continue accessing your account.
      </p>

      {/* Action */}
      <Link
        href="/login"
        className="mt-2 w-full border-2 border-dark py-2 text-center font-semibold  bg-warning hover:bg-warning/75 transition-all duration-300 text-dark"
      >
        Go to Login
      </Link>
    </main>
  );
}
