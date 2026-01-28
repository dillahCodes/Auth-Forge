import clsx from "clsx";
import { Activity } from "react";
import { MdOutlineEmail } from "react-icons/md";

interface InputEmailProps {
  errorMessage?: string;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const InputEmail = ({
  inputProps,
  labelProps,
  errorMessage,
  wrapperProps,
}: InputEmailProps) => {
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
          <MdOutlineEmail size={24} />
        </label>
        <input
          {...inputProps}
          type="email"
          className={clsx("w-full outline-none border-none min-h-full p-2 ", {
            "placeholder:text-danger/50": errorMessage,
            "placeholder:text-dark-5": !errorMessage,
          })}
        />
      </div>

      <Activity mode={errorMessage ? "visible" : "hidden"}>
        <span className="text-danger text-sm">{errorMessage}</span>
      </Activity>
    </section>
  );
};
