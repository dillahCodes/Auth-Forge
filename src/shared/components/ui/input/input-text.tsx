import clsx from "clsx";
import { IconType } from "react-icons";

interface InputProps {
  errorMessage?: string;
  labelIcon?: IconType;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const InputText = ({
  wrapperProps,
  errorMessage,
  inputProps,
  labelIcon: LabelIcon,
  labelProps,
}: InputProps) => {
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
        <label {...labelProps} className="min-w-10 flex items-center justify-center">
          {LabelIcon && <LabelIcon size={24} />}
        </label>

        <input
          {...inputProps}
          type={inputProps?.type ?? "text"}
          className={clsx("w-full outline-none border-none min-h-full p-2", {
            "placeholder:text-danger/50": errorMessage,
            "placeholder:text-dark-5": !errorMessage,
          })}
        />
      </div>

      {errorMessage && <span className="text-danger text-sm">{errorMessage}</span>}
    </section>
  );
};
