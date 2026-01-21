import { AppProvider } from "@/context/app-provider";
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
      <body>
        <main className="min-h-screen antialiased p-4 flex flex-col justify-center items-center">
          <AppProvider>{children}</AppProvider>
        </main>
      </body>
    </html>
  );
}
