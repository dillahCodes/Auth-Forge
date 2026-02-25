import { Activity } from "react";
import { BiSolidLock } from "react-icons/bi";
import { MessageBox } from "./messagebox";

interface RestrictedProps {
  mode: "visible" | "hidden";
  infoMessage?: string;
  children: React.ReactNode;
  className?: string;
}

export function Restricted({ children, mode, infoMessage, className }: RestrictedProps) {
  const restrictedClassname = {
    visible: "blur-sm select-none pointer-events-none",
    hidden: "blur-0 select-auto pointer-events-auto",
  };

  return (
    <section className="w-full relative flex flex-col gap-4">
      <Activity mode={mode}>
        <span className="text-black/50 z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <BiSolidLock size={124} />
        </span>
      </Activity>
      <Activity mode={mode}>
        <MessageBox withIcon type={"warning"}>
          {infoMessage}
        </MessageBox>
      </Activity>
      <div className={`w-full ${restrictedClassname[mode]} ${className || ""}`}>{children}</div>
    </section>
  );
}
