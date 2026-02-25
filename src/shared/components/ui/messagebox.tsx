import { Activity } from "react";
import { FaCheck } from "react-icons/fa";
import { IoCloseCircleSharp, IoCloseSharp, IoWarningSharp } from "react-icons/io5";

interface MessageBoxProps {
  type: "success" | "error" | "warning";
  children: React.ReactNode;
  withIcon?: boolean;
  onClose?: () => void;
}

export function MessageBox({ type, children, onClose, withIcon }: MessageBoxProps) {
  const styles = {
    error: "bg-danger text-black",
    success: "bg-success text-black",
    warning: "bg-warning text-black",
  };

  const icons = {
    error: <IoCloseSharp size={24} className="text-red-950" />,
    success: <FaCheck size={24} className="text-green-950" />,
    warning: <IoWarningSharp size={24} className="text-yellow-950" />,
  };

  return (
    <div className={`border-2 gap-2 flex items-center border-dark p-2 text-sm font-semibold ${styles[type]}`}>
      <Activity name="icon" mode={!withIcon ? "hidden" : "visible"}>
        <span>{icons[type]}</span>
      </Activity>
      {children}
      <Activity name="close button" mode={onClose ? "visible" : "hidden"}>
        <button className="ml-auto" onClick={onClose}>
          <IoCloseCircleSharp size={20} />
        </button>
      </Activity>
    </div>
  );
}
