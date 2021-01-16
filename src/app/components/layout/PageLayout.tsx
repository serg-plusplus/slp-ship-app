import classNames from "clsx";
import ContentContainer from "app/components/layout/ContentContainer";
import Connect from "app/components/parts/Connect";
import { ReactComponent as Image2 } from "app/misc/2.svg";
import imageUrl137 from "app/misc/137.svg";
import imageUrl143 from "app/misc/143.svg";
import imageUrl129 from "app/misc/129.svg";

type PageLayoutProps = {
  title: React.ReactNode;
  description: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  children,
}) => (
  <ContentContainer className="relative">
    <header className="flex items-center py-8">
      <Image2 />
      <div className="flex-1" />
      <Connect />
    </header>

    <main className="-mt-12">
      <div className="w-full flex flex-col items-center">
        <div className="max-w-xs text-center">
          <h1
            className={classNames(
              "mb-6",
              "text-brand-indigo",
              "text-3xl",
              "font-bold",
              "uppercase tracking-tight"
            )}
          >
            {title}
          </h1>
          <p
            className={classNames(
              "font-courier",
              "text-lg",
              "text-brand-darkgray"
            )}
          >
            {description}
          </p>
        </div>
      </div>

      {children}
    </main>

    <img src={imageUrl137} alt="" className="absolute left-32 top-32 -z-1" />
    <img src={imageUrl143} alt="" className="absolute right-32 top-56 -z-1" />
    <img
      src={imageUrl129}
      alt=""
      className="absolute right-4 -z-1"
      style={{ top: "46rem" }}
    />
  </ContentContainer>
);

export default PageLayout;
