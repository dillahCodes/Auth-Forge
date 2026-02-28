import { AppProvider } from "@/shared/context/app-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Auth From Scratch",
  description: "This is a Next Auth From Scratch",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* AOS */}
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"></link>
      </head>
      <body>
        <main className="min-h-screen antialiased flex flex-col justify-center items-center">
          <AppProvider>{children}</AppProvider>
        </main>
        {/* AOS */}
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js" async />
      </body>
    </html>
  );
}
