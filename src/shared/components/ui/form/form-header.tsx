import { IconType } from "react-icons";

interface FormHeaderProps {
  title: string;
  description: string;
  icon?: IconType;
}

export const FormHeader = ({ description, title, icon: ReactIcon }: FormHeaderProps) => {
  return (
    <section className="flex items-center justify-center flex-col">
      <span className="mx-auto">{ReactIcon && <ReactIcon size={50} />}</span>
      <div className="w-full">
        <h1 className="text-center font-semibold text-xl">{title}</h1>
        <p className="text-center text-sm font-light">{description}</p>
      </div>
    </section>
  );
};
