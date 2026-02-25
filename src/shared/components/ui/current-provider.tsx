import { AuthProvider } from "../../../../prisma/generated/enums";

interface CurrentProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  providerName?: AuthProvider;
}

export function CurrentProvider({ providerName, ...props }: CurrentProviderProps) {
  const { className, ...restProps } = props;

  return (
    <div
      {...restProps}
      className={`border-2 border-dark w-fit z-20 h-fit px-4 py-1 bg-success rounded-full text-sm ${className ?? ""}`}
    >
      <span>Provider: </span>
      <span className="font-bold">{providerName?.toLowerCase()}</span>
    </div>
  );
}
