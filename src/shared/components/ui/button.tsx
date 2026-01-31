interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant: "info" | "warning" | "danger" | "success" | "text" | "outline";
}

export function Button({ children, variant, ...props }: ButtonProps) {
  const styles = {
    info: "bg-info text-dark-2 cursor-pointer border-2 border-dark p-2 disabled:bg-info/60 hover:bg-info/80",
    warning: "bg-warning text-black cursor-pointer border-2 border-dark p-2 disabled:bg-warning/60 hover:bg-warning/80",
    danger: "bg-danger text-dark-2 cursor-pointer border-2 border-dark p-2 disabled:bg-danger/60 hover:bg-danger/80",
    success: "bg-success text-dark-2 cursor-pointer border-2 border-dark p-2 disabled:bg-success/60",
    text: "bg-transparent text-black cursor-pointer disabled:text-dark-5",
    outline: "text-black cursor-pointer border-2 border-dark disabled:text-dark-5",
  };

  return (
    <button {...props} className={`text-sm ${styles[variant]} ${props.className}`}>
      {children}
    </button>
  );
}
