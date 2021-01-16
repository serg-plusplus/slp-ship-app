import classNames from "clsx";

type FormSubmitButtonProps = React.HTMLAttributes<HTMLButtonElement>;

const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  className,
  children,
  ...rest
}) => (
  <button
    className={classNames(
      "border-2 border-brand-darkgray",
      "bg-brand-pink",
      "px-10 py-3",
      "text-center uppercase",
      "font-bold text-brand-lightgray",
      "hover:bg-brand-blue",
      "transition ease-in-out duration-300",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export default FormSubmitButton;
