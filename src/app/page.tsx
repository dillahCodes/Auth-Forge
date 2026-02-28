"use client";

import { Features } from "@/features/home/components/features";
import { Footer } from "@/features/home/components/footer";
import { Header } from "@/features/home/components/header";
import { Hero } from "@/features/home/components/hero";
import { TechStack } from "@/features/home/components/tech-stack";
import "swagger-ui-react/swagger-ui.css";
import "../styles/docs.css";
import { AppFlow } from "@/features/home/components/flow";

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans w-full">
      <Header />
      <Hero />
      <TechStack />
      <Features />
      <AppFlow />

      {/* ── SWAGGER UI ──────────────────────── */}
      {/* <main className="max-w-6xl mx-auto docs-swagger-wrapper px-3">
        <SwaggerUI
          url="/open-api.yaml"
          docExpansion="list"
          defaultModelsExpandDepth={-1}
          displayRequestDuration={true}
          tryItOutEnabled={false}
          filter={true}
        />
      </main> */}

      <Footer />
    </div>
  );
}
