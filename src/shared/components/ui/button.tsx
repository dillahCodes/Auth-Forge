interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant: "info" | "warning" | "danger" | "success" | "text";
}

export function Button({ children, variant, ...props }: ButtonProps) {
  const styles = {
    info: "bg-info text-dark-2 cursor-pointer border-2 border-dark p-2 disabled:bg-info/60",
    warning:
      "bg-warning text-black cursor-pointer border-2 border-dark p-2 disabled:bg-warning/60",
    danger:
      "bg-danger text-dark-2 cursor-pointer border-2 border-dark p-2 disabled:bg-danger/60",
    success:
      "bg-success text-dark-2 cursor-pointer border-2 border-dark p-2 disabled:bg-success/60",
    text: "bg-transparent text-black cursor-pointer disabled:text-dark-5",
  };

  return (
    <button {...props} className={`text-sm ${styles[variant]} ${props.className}`}>
      {children}
    </button>
  );
}
