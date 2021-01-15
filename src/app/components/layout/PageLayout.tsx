import ContentContainer from "app/components/layout/ContentContainer";
import Connect from "app/components/parts/Connect";
import { ReactComponent as Image2 } from "app/misc/2.svg";

const PageLayout: React.FC = ({ children }) => {
  return (
    <ContentContainer>
      <header className="flex items-center py-8">
        <Image2 />
        <div className="flex-1" />
        <Connect />
      </header>

      {children}
    </ContentContainer>
  );
};

export default PageLayout;
