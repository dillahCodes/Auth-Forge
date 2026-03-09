"use client";

import { FlowCard } from "@/shared/components/ui/flow-card";
import { useAOS } from "@/shared/hooks/use-aos";
import { FLOW_STEPS } from "../constant/flow-steps";

export function AppFlow() {
  useAOS();

  return (
    <section className="bg-primary-bg-200 py-16 px-6 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-black text-dark leading-tight">
          <span className="text-danger">App</span> Flow
        </h2>
        <p className="text-dark-6 text-sm md:text-base mt-3 max-w-md mx-auto">
          How the authentication system works — from sign-up to secure session.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative max-w-6xl mx-auto">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-dark-4 border-l-2 border-dashed border-dark-4 -translate-x-1/2" />

        <div className="flex flex-col gap-10 md:gap-16 relative">
          {FLOW_STEPS.map((step) => (
            <FlowCard key={step.step} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
