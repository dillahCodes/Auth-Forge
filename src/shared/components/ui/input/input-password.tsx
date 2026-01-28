import { Activity, useState } from "react";
import { RiLock2Line } from "react-icons/ri";
import clsx from "clsx";

interface InputProps {
  errorMessage?: string;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const InputPassword = ({
  inputProps,
  labelProps,
  errorMessage,
  wrapperProps,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <section
      className={`w-full flex flex-col gap-1 ${wrapperProps?.className}`}
      {...wrapperProps}
    >
      <div
        className={clsx("w-full border-2 flex items-center gap-2", {
          "border-danger text-danger": errorMessage,
          "border-dark text-dark": !errorMessage,
        })}
      >
        <label
          {...labelProps}
          className={clsx("min-w-10 flex items-center justify-center")}
        >
          <RiLock2Line size={24} />
        </label>
        <input
          {...inputProps}
          type={showPassword ? "text" : "password"}
          className={clsx("w-full outline-none border-none min-h-full p-2 ", {
            "placeholder:text-danger/50": errorMessage,
            "placeholder:text-dark-5": !errorMessage,
          })}
        />
        <span className="pr-2 cursor-pointer text-sm" onClick={handleTogleShowPassword}>
          {showPassword ? "Hide" : "Show"}
        </span>
      </div>

      <Activity mode={errorMessage ? "visible" : "hidden"}>
        <span className="text-danger text-sm">{errorMessage}</span>
      </Activity>
    </section>
  );
};
