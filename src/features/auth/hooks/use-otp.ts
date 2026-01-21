import { useRef } from "react";

export const useOtp = ({ otpLength }: { otpLength: number }) => {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleOtpInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const rawValue = e.target.value;
    const filteredOnlyNumeric = rawValue.replace(/\D/g, "");

    e.target.value = filteredOnlyNumeric;

    const isIndexNotLast = index < inputsRef.current.length - 1;
    if (filteredOnlyNumeric && isIndexNotLast) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const value = e.currentTarget.value;
    const isBackspaceKey = e.key === "Backspace";
    const isNotFirstInput = index > 0;
    const shpuldMovePrevInput = isBackspaceKey && !value && isNotFirstInput;

    if (shpuldMovePrevInput) inputsRef.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text/plain");
    const isPastedTextEmpty = !pastedText.length;
    if(isPastedTextEmpty) return

    const filteredOnlyNumeric = pastedText.replace(/\D/g, "");
    const pastedTextArray = filteredOnlyNumeric.split("");

    pastedTextArray.map((value, index) => {
      inputsRef.current[index].value = value;
      inputsRef.current[index].focus();
    });
  };

  return {
    otpLength,
    inputsRef,
    handleOtpInputChange,
    handleKeyDown,
    handlePaste,
  };
};
