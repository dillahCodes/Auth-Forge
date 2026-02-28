"use client";

import Link from "next/link";
import { LuLayers } from "react-icons/lu";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-dark bg-dark px-6 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Section */}
        <div className="flex flex-col gap-2 items-center md:items-start">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-warning border-2 border-dark flex items-center justify-center">
              <LuLayers size={14} color="#111928" />
            </div>

            <span className="text-sm font-black text-white uppercase tracking-wider">AuthForge API Docs</span>
          </div>

          <span className="text-dark-5 text-xs font-bold text-center md:text-left">
            Built with Next.js · OpenAPI 3.0 · swagger-ui-react
          </span>

          <span className="text-dark-5 text-xs font-bold">© {currentYear} DillahCodes. All rights reserved.</span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/dillahCodes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-5 hover:text-white transition-colors"
          >
            <FaGithub size={18} />
          </Link>

          <Link
            href="https://www.linkedin.com/in/abdillahjuniansyah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-5 hover:text-white transition-colors"
          >
            <FaLinkedin size={18} />
          </Link>

          <Link
            href="https://www.instagram.com/dillah.codes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-5 hover:text-white transition-colors"
          >
            <FaInstagram size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
