interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export const Form = ({ children, ...props }: FormProps) => {
  return (
    <form
      {...props}
      className={`shadow-strong border-2 border-black p-6 flex flex-col gap-4 ${props.className}`}
    >
      {children}
    </form>
  );
};
