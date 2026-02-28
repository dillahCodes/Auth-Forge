"use client";

import { Footer } from "@/features/home/components/footer";
import { Header } from "@/features/home/components/header";
import SwaggerUI from "swagger-ui-react";

import "swagger-ui-react/swagger-ui.css";
import "../../styles/docs.css";

export default function DocsPage() {
  return (
    <div className="min-h-screen font-sans w-full">
      <Header />

      {/* ── SWAGGER UI ──────────────────────── */}
      <main className="max-w-6xl mx-auto docs-swagger-wrapper px-3 my-10">
        <SwaggerUI
          url="/open-api.yaml"
          docExpansion="list"
          defaultModelsExpandDepth={-1}
          displayRequestDuration={true}
          tryItOutEnabled={false}
          filter={true}
        />
      </main>

      <Footer />
    </div>
  );
}
