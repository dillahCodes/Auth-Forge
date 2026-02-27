"use client";

import { BiSolidNotepad } from "react-icons/bi";
import { FaCookieBite } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { LuLayers } from "react-icons/lu";
import { SiAdguard } from "react-icons/si";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "./docs.css";

/**
 * ApiDocs Page — Neobrutalism Style
 *
 * Render Swagger UI documentation
 * using local OpenAPI YAML file.
 */
export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-primary-bg-200 font-sans">
      {/* ── HEADER ──────────────────────────── */}
      <header className="sticky top-0 z-50 bg-primary-bg-200 border-b-2 border-dark">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-dark flex items-center justify-center border-2 border-dark shadow-[3px_3px_0px_2px_#fbb92e]">
              <LuLayers size={18} color="white" />
            </div>
            <span className="text-base font-black text-dark tracking-tight">AuthForge API</span>
            <span className="text-xs font-bold bg-warning text-dark border-2 border-dark px-2 py-0.5 shadow-[2px_2px_0px_1px_#111928]">
              v1.0.0
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {["Auth", "Sessions", "Profile"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-bold text-dark-7 hover:text-dark hover:bg-dark-3 border-2 border-transparent hover:border-dark px-3 py-1.5 transition-none"
              >
                {item}
              </a>
            ))}
            <a
              href="https://github.com/dillahCodes/Auth-Forge"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 flex items-center gap-2 text-sm font-black text-dark bg-warning border-2 border-dark px-4 py-1.5 shadow-[3px_3px_0px_2px_#111928] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              <FaGithub size={15} />
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* ── HERO ────────────────────────────── */}
      <section className="border-b-2 border-dark bg-primary-bg-300 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-info text-white border-2 border-dark px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_2px_#111928] mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            REST API · OpenAPI 3.0
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black text-dark leading-none tracking-tighter mb-4">
            AuthForge
            <br />
            <span className="text-danger">API Docs</span>
          </h1>

          <p className="text-dark-6 text-lg font-medium max-w-xl mb-10 leading-relaxed">
            Full-featured authentication with credentials, Google OAuth, 2FA, session management, and secure account
            operations.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4">
            {[
              { value: "30", label: "Endpoints" },
              { value: "10", label: "Tag Groups" },
              { value: "Cookie", label: "Auth Method" },
              { value: "FormData", label: "Request Format" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-primary-bg-200 border-2 border-dark px-5 py-3 shadow-[5px_5px_0px_2px_#111928]"
              >
                <div className="text-2xl font-black text-dark">{s.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-dark-6">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFO BANNER ─────────────────────── */}
      <div className="bg-warning border-b-2 border-dark">
        <div className="max-w-6xl mx-auto py-3 grid grid-cols-3 gap-3 text-dark text-sm font-bold">
          <div className="flex items-center gap-4">
            <BiSolidNotepad size={24} />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-dark-7">Request Format</p>
              <p className="text-sm font-bold text-dark">multipart/form-data</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SiAdguard size={24} />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-dark-7">Auth Method</p>
              <p className="text-sm font-bold text-dark">HTTP-only Cookies</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaCookieBite size={24} />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-dark-7">Tokens</p>
              <p className="text-sm font-bold text-dark font-mono">access_token · refresh_token · 2fa_token</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SWAGGER UI ──────────────────────── */}
      <main className="px-4 md:px-6 py-10">
        <div className="max-w-6xl mx-auto docs-swagger-wrapper">
          <SwaggerUI
            url="/open-api.yaml"
            docExpansion="list"
            defaultModelsExpandDepth={-1}
            displayRequestDuration={true}
            tryItOutEnabled={false}
            filter={true}
          />
        </div>
      </main>

      {/* ── FOOTER ──────────────────────────── */}
      <footer className="border-t-2 border-dark bg-dark px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-warning border-2 border-dark flex items-center justify-center">
              <LuLayers size={14} color="#111928" />
            </div>
            <span className="text-sm font-black text-white uppercase tracking-wider">NextAuth API Docs</span>
          </div>
          <span className="text-dark-5 text-xs font-bold">Built with Next.js · OpenAPI 3.0 · swagger-ui-react</span>
        </div>
      </footer>
    </div>
  );
}
