import { forwardRef } from "react";
import classNames from "clsx";

type FormFieldRef = HTMLInputElement;
type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
};

const FormField = forwardRef<FormFieldRef, FormFieldProps>(
  ({ label, description, containerClassName, className, ...rest }, ref) => {
    return (
      <div className={classNames("w-full flex flex-col", containerClassName)}>
        {label && (
          <label className="w-full mb-3 flex flex-col text-center">
            <span
              className={classNames(
                "text-lg font-bold text-brand-indigo",
                "uppercase"
              )}
            >
              {label}
            </span>

            {description && (
              <span
                className={classNames(
                  "mt-1",
                  "text-xs font-light text-gray-600"
                )}
                style={{ maxWidth: "90%" }}
              >
                {description}
              </span>
            )}
          </label>
        )}

        <input
          ref={ref}
          className={classNames(
            "appearance-none",
            "w-full",
            "py-3 px-4",
            "bg-transparent",
            "border-4 border-double border-brand-darkgray",
            "focus:outline-none focus:border-brand-blue",
            "text-center text-brand-black text-lg font-courier",
            "transition ease-in-out duration-300",
            className
          )}
          {...rest}
        />
      </div>
    );
  }
);

export default FormField;
