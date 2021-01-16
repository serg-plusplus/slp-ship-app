import classNames from "clsx";
import ContentContainer from "app/components/layout/ContentContainer";
import Connect from "app/components/parts/Connect";
import { ReactComponent as Image2 } from "app/misc/2.svg";

type PageLayoutProps = {
  title: React.ReactNode;
  description: React.ReactNode;
};

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <ContentContainer>
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
    </ContentContainer>
  );
};

export default PageLayout;
