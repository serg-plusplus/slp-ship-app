import PageLayout from "app/components/layout/PageLayout";
import FormBox from "app/components/layout/FormBox";
import ToWSLPForm from "app/components/parts/ToWSLPForm";

const ToWSLP: React.FC = () => (
  <PageLayout
    title="SLP - ERC20 Route"
    description={
      <>
        Give your tokens trip to the
        <br /> first smart-contract platform
        <br /> and one of the most overloaded
        <br /> networks.
      </>
    }
  >
    <FormBox className="my-12">
      <ToWSLPForm />
    </FormBox>
  </PageLayout>
);

export default ToWSLP;
