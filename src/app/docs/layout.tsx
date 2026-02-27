import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation — NextAuth",
  description:
    "Interactive API reference for the NextAuth authentication system. Browse all 30 endpoints covering credentials login, Google OAuth, 2FA, sessions, and account management.",
};

/**
 * Docs Layout
 *
 * Overrides the root layout's main element styling
 * so the API docs page can render full-width without
 * the centered flex container from the global layout.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
