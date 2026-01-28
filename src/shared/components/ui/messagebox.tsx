import { Activity } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";

interface MessageBoxProps {
  type: "success" | "error" | "info";
  children: React.ReactNode;
  onClose?: () => void;
}

export function MessageBox({ type, children, onClose }: MessageBoxProps) {
  const styles = {
    error: "bg-danger text-black",
    success: "bg-success text-black",
    info: "bg-warning text-black",
  };

  return (
    <div className={`border-2 flex border-dark p-2 text-sm ${styles[type]}`}>
      {children}
      <Activity name="close button" mode={onClose ? "visible" : "hidden"}>
        <button className="ml-auto" onClick={onClose}>
          <IoCloseCircleSharp size={20} />
        </button>
      </Activity>
    </div>
  );
}
