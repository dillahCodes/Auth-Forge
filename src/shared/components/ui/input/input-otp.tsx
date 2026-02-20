interface InputOtpProps {
  handleOtpInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  inputsRef: React.RefObject<HTMLInputElement[]>;
  otpLength: number;
}

export function InputOtp({ handleOtpInputChange, handleKeyDown, handlePaste, inputsRef, otpLength }: InputOtpProps) {
  return (
    <div className="w-full grid grid-cols-6 gap-3">
      {Array.from({ length: otpLength }).map((_, index) => (
        <input
          ref={(el) => {
            inputsRef.current[index] = el!;
          }}
          name={index.toString()}
          required
          maxLength={1}
          inputMode="numeric"
          onPaste={handlePaste}
          onChange={(e) => handleOtpInputChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          type="text"
          key={index}
          className="border-2 border-black min-h-10 text-center aspect-square text-lg font-semibold"
        />
      ))}
    </div>
  );
}
