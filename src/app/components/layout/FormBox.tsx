import classNames from "clsx";
import imageUrl191 from "app/misc/191.svg";
import imageUrl192 from "app/misc/192.svg";

type FormBoxProps = React.HTMLAttributes<HTMLDivElement>;

const FormBox: React.FC<FormBoxProps> = ({
  className,
  style = {},
  children,
  ...rest
}) => (
  <div
    className={classNames(
      "relative",
      "w-full max-w-2xl mx-auto",
      "border-2 border-dashed border-brand-indigo",
      "rounded-3xl",
      "pt-12 pb-8 px-20",
      className
    )}
    style={{
      minHeight: "24rem",
      ...style,
    }}
    {...rest}
  >
    {children}

    <img src={imageUrl191} alt="" className="absolute right-5 top-6 -z-1" />
    <img src={imageUrl192} alt="" className="absolute left-6 bottom-6 -z-1" />
  </div>
);

export default FormBox;
