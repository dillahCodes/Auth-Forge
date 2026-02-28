"use client";

import { FaDatabase, FaReact } from "react-icons/fa";
import { SiAxios, SiNextdotjs, SiRedis, SiResend, SiShadcnui, SiTailwindcss, SiVitest, SiZod } from "react-icons/si";

const techItems = [
  { icon: <FaReact size={22} />, label: "React", bg: "bg-info" },
  { icon: <SiNextdotjs size={22} />, label: "Next.js", bg: "bg-dark" },
  { icon: <SiTailwindcss size={22} />, label: "Tailwind CSS", bg: "bg-info" },
  { icon: <SiResend size={22} />, label: "Resend Email", bg: "bg-dark-8" },
  { icon: <SiRedis size={22} />, label: "Redis", bg: "bg-danger" },
  { icon: <FaDatabase size={22} />, label: "PostgreSQL", bg: "bg-dark-9" },
  { icon: <SiZod size={22} />, label: "Zod", bg: "bg-info" },
  { icon: <SiShadcnui size={22} />, label: "Shadcn UI", bg: "bg-dark-9" },
  { icon: <SiAxios size={22} />, label: "Axios", bg: "bg-purple-500" },
  { icon: <SiVitest size={22} />, label: "Vitest", bg: "bg-success" },
];

function MarqueeItem({ icon, label, bg }: (typeof techItems)[number]) {
  return (
    <div
      className={`flex items-center gap-2 ${bg} text-white shadow-strong shadow-black border-2 border-dark px-4 py-1.5 font-black uppercase tracking-wider text-sm select-none mr-4`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

export function TechStack() {
  return (
    <section className="bg-warning border-b-2 min-h-28 py-4 flex flex-col gap-3 border-dark overflow-hidden">
      <h2 className="text-3xl font-black text-center tracking-tight">
        <span className="text-danger">Tech</span> Stack
      </h2>

      <div className="overflow-hidden mt-4">
        <div className="w-max flex group py-4">
          <div className="flex w-max animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
            {[...techItems, ...techItems].map((tech, i) => (
              <MarqueeItem key={i} {...tech} />
            ))}
          </div>
          <div className="flex w-max animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
            {[...techItems, ...techItems].map((tech, i) => (
              <MarqueeItem key={i} {...tech} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
