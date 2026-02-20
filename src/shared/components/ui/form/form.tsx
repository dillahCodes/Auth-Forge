interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  variant?: "border" | "ghost";
}

export const Form = ({ variant = "border", children, ...props }: FormProps) => {
  const styles = {
    border: "shadow-strong border-2 border-black p-6 flex flex-col gap-4 bg-dark-2",
    ghost: "flex flex-col gap-4",
  };

  return (
    <form {...props} className={`${styles[variant]} ${props?.className}`}>
      {children}
    </form>
  );
};
