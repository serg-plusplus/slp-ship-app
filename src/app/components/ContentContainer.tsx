import classNames from "clsx";

type ContentContainerProps = React.HTMLAttributes<HTMLDivElement>;

const ContentContainer: React.FC<ContentContainerProps> = ({
  className,
  children,
  ...rest
}) => (
  <div
    className={classNames("w-full max-w-xl mx-auto px-4", className)}
    {...rest}
  >
    {children}
  </div>
);

export default ContentContainer;
