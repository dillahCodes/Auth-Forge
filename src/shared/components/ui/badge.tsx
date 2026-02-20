import React from "react";
import { HiCheckCircle, HiClock } from "react-icons/hi2";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "verified" | "pending";
  children?: React.ReactNode;
}

export function StatusBadge({ status, children, ...props }: StatusBadgeProps) {
  const styles = {
    verified: "bg-success border-2 border-dark px-2.5 py-1 h-fit text-green-950 flex items-center gap-1.5",
    pending: "bg-warning border-2 border-dark px-2.5 py-1 h-fit text-yellow-950 flex items-center gap-1.5",
  };

  const icons = {
    verified: <HiCheckCircle className="h-4 w-4" />,
    pending: <HiClock className="h-4 w-4" />,
  };

  return (
    <span {...props} className={`text-xs font-medium rounded-full ${styles[status]} ${props.className}`}>
      {icons[status]}
      {children ?? (status === "verified" ? "Verified" : "Pending")}
    </span>
  );
}
