import { Activity } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant: "info" | "warning" | "danger" | "success" | "text" | "outline";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({ children, variant, iconLeft, iconRight, isLoading, ...props }: ButtonProps) {
  const styles = {
    info: "bg-info text-dark-2 cursor-pointer border-2 border-dark p-2 px-4 disabled:bg-info/60 hover:bg-info/80",
    warning:
      "bg-warning text-black cursor-pointer border-2 border-dark p-2 px-4 disabled:bg-warning/60 hover:bg-warning/80",
    danger:
      "bg-danger text-dark-2 cursor-pointer border-2 border-dark p-2 px-4 disabled:bg-danger/60 hover:bg-danger/80",
    success: "bg-success text-dark-2 cursor-pointer border-2 border-dark p-2 px-4 disabled:bg-success/60",
    text: "bg-transparent text-black cursor-pointer disabled:text-dark-5",
    outline: "text-black cursor-pointer border-2 border-dark disabled:text-dark-5 px-4 py-2",
  };

  return (
    <button
      {...props}
      className={`text-sm ${(iconLeft || iconRight) && "flex items-center justify-center gap-2"} ${styles[variant]} ${props.className}`}
    >
      <Activity name="button icon left" mode={!iconLeft || isLoading ? "hidden" : "visible"}>
        {iconLeft}
      </Activity>

      <Activity name="button content" mode={isLoading ? "hidden" : "visible"}>
        {children}
      </Activity>

      <Activity name="button loading" mode={isLoading ? "visible" : "hidden"}>
        <div className="w-full flex items-center gap-4 justify-center">
          <AiOutlineLoading3Quarters size={24} className="animate-spin" />
          <span>Loading...</span>
        </div>
      </Activity>

      <Activity name="button icon right" mode={!iconRight || isLoading ? "hidden" : "visible"}>
        {iconRight}
      </Activity>
    </button>
  );
}
