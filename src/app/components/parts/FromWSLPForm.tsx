import { useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useWallet } from "use-wallet";
import { useWalletProvider } from "lib/eth-wallet";
import { fromWSLP } from "lib/slp-ship";
import FormField from "app/components/atoms/FormField";
import FormSubmitButton from "app/components/atoms/FormSubmitButton";

interface FormData {
  ethTokenAddress: string;
  ethTokenVolume: string;
  slpDestAddress: string;
}

const FromWSLPForm: React.FC = () => {
  const { account } = useWallet();
  const ethProvider = useWalletProvider();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const processingRef = useRef(false);

  const onSubmit = useCallback(
    ({ ethTokenAddress, ethTokenVolume, slpDestAddress }: FormData) => {
      if (processingRef.current) return;
      processingRef.current = true;

      const promise = (async () => {
        try {
          if (!ethProvider) throw new Error("Metamask Wallet not connected");

          await fromWSLP(
            ethProvider,
            account!,
            ethTokenAddress,
            ethTokenVolume,
            slpDestAddress
          );

          reset();
        } finally {
          processingRef.current = false;
        }
      })();

      toast.promise(promise, {
        loading: "Processing...",
        success: () => "Success! Wait for swap.",
        error: (err) => err?.message ?? "Unknown error occured",
      });
    },
    [ethProvider, account, reset]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        ref={register}
        name="ethTokenAddress"
        type="text"
        label="ERC20 Token address"
        placeholder="e.g. 0xf42Fd6e5a..."
        className="mb-8"
      />
      <FormField
        ref={register}
        name="ethTokenVolume"
        type="text"
        label="ERC20 Amount"
        placeholder="e.g. 123.45"
        className="mb-8"
      />
      <FormField
        ref={register}
        name="slpDestAddress"
        type="text"
        label="SLP destination address"
        placeholder="e.g. simpleledger:qrx2z6d..."
        className="mb-8"
      />

      <div className="mt-4 mb-12 text-center">
        <FormSubmitButton>To the future!</FormSubmitButton>
      </div>
    </form>
  );
};

export default FromWSLPForm;
