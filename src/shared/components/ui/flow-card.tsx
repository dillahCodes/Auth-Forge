"use client";

import Link from "next/link";
import { Button } from "./button";

export interface FlowStep {
  step: string;
  title: string;
  description: string[];
  side: "left" | "right";
  detailUrl: string;
}

interface FlowCardProps {
  step: FlowStep;
  detailUrl: string;
}

interface FlowCardContentProps {
  step: FlowStep;
  isLeft: boolean;
  detailUrl: string;
}

interface FlowCardHeaderProps {
  step: string;
  title: string;
}

interface FlowCardDescriptionProps {
  description: string[];
}

interface FlowCardMobileDotProps {
  step: string;
}

export function FlowCard({ step, detailUrl }: FlowCardProps) {
  const isLeft = step.side === "left";

  return (
    <div
      data-aos={isLeft ? "fade-right" : "fade-left"}
      data-aos-duration="800"
      className={`flex flex-col md:flex-row items-center gap-6 md:gap-0 w-full ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      <FlowCardContent step={step} isLeft={isLeft} detailUrl={detailUrl} />
      <FlowCardDesktopDot />
      <FlowCardMobileDot step={step.step} />
      <div className="hidden md:block w-full" />
    </div>
  );
}

function FlowCardContent({ step, isLeft, detailUrl }: FlowCardContentProps) {
  return (
    <div className="w-fullock w-full">
      <div
        className={`bg-primary-bg-300 border-2 border-dark p-6 shadow-strong ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}
      >
        <FlowCardImage />
        <FlowCardHeader step={step.step} title={step.title} />
        <FlowCardDescription description={step.description} />
        <Button variant="info" className="font-bold w-full mt-4">
          <Link href={detailUrl} target="_blank" rel="noopener noreferrer">
            Detail
          </Link>
        </Button>
      </div>
    </div>
  );
}

function FlowCardHeader({ step, title }: FlowCardHeaderProps) {
  return (
    <div className="flex items-center flex-wrap gap-3 mb-3">
      <span className="bg-danger text-dark-2 text-xs font-black px-3 min-w-fit py-1 border-2 border-dark uppercase tracking-wider">
        Step {step}
      </span>
      <h3 className="text-lg font-black text-dark leading-tight">{title}</h3>
    </div>
  );
}

function FlowCardDescription({ description }: FlowCardDescriptionProps) {
  return (
    <ul className="text-dark-6 text-base leading-normal list-disc pl-5 space-y-1">
      {description.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function FlowCardImage() {
  return (
    <div className="w-full h-36 bg-dark-3 border-2 border-dark mb-4 flex items-center justify-center">
      <span className="text-dark-5 text-sm font-bold tracking-widest uppercase">Image</span>
    </div>
  );
}

function FlowCardDesktopDot() {
  return (
    <div data-aos="fade-up" data-aos-duration="800" className="hidden md:flex w-[12%] justify-center shrink-0">
      <div className="w-5 h-5 rounded-full bg-warning border-2 border-dark shadow-[var(--shadow-strong-weak)_var(--color-dark)] z-10" />
    </div>
  );
}

function FlowCardMobileDot({ step }: FlowCardMobileDotProps) {
  return (
    <div className="flex md:hidden items-center gap-3 self-start">
      <div className="w-4 h-4 rounded-full bg-warning border-2 border-dark shadow-[var(--shadow-strong-weak)_var(--color-dark)]" />
      <span className="text-xs font-black text-dark-5 uppercase tracking-widest">Step {step}</span>
    </div>
  );
}
