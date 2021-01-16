import { useRef, useCallback, Suspense, memo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useBadger } from "lib/badger";
import { toWSLP, getSLPBalance } from "lib/slp-ship";
import ErrBond from "app/components/a11y/ErrBond";
import FormField from "app/components/atoms/FormField";
import FormSubmitButton from "app/components/atoms/FormSubmitButton";

interface FormData {
  slpTokenId: string;
  slpVolume: string;
  ethDestAddress: string;
}

const ToWSLPForm: React.FC = () => {
  const bch = useBadger();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const processingRef = useRef(false);

  const onSubmit = useCallback(
    ({ slpTokenId, slpVolume, ethDestAddress }: FormData) => {
      if (processingRef.current) return;
      processingRef.current = true;

      const promise = (async () => {
        try {
          if (!bch) throw new Error("Badger Wallet not connected");

          const txId = await toWSLP(bch, slpTokenId, slpVolume, ethDestAddress);
          console.info({ txId });

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
    [bch, reset]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        ref={register}
        name="slpTokenId"
        type="text"
        label="SLP Token ID"
        placeholder="e.g. ff1b54b214..."
        className="mb-8"
        list="user-slp-tokens"
      />
      <ErrBond>
        <Suspense fallback={null}>
          <AllUserSLPTokens listId="user-slp-tokens" />
        </Suspense>
      </ErrBond>

      <FormField
        ref={register}
        name="slpVolume"
        type="text"
        label="SLP Amount"
        placeholder="e.g. 123.45"
        className="mb-8"
      />
      <FormField
        ref={register}
        name="ethDestAddress"
        type="text"
        label="ETH destination address"
        placeholder="e.g. 0xf42Fd6e5a..."
        className="mb-8"
      />

      <div className="mt-4 mb-12 text-center">
        <FormSubmitButton>To the future!</FormSubmitButton>
      </div>
    </form>
  );
};

export default ToWSLPForm;

type AllUserSLPTokensProps = {
  listId: string;
};

const AllUserSLPTokens = memo<AllUserSLPTokensProps>(({ listId }) => {
  const bch = useBadger();
  const fetchAllTokens = useCallback(async () => {
    if (!bch) return [];
    try {
      const all = await getSLPBalance(bch.defaultAccount);
      return all as any[];
    } catch {
      return [];
    }
  }, [bch]);
  const { data: allTokens } = useQuery(
    ["all-slps", { account: bch?.defaultAccount }],
    fetchAllTokens
  );

  return (
    <datalist id={listId}>
      {allTokens!.map(({ tokenId, balance, tokenTicker, tokenName }) => (
        <option key={tokenId} value={tokenId}>
          {balance} {tokenTicker} {tokenName}
        </option>
      ))}
    </datalist>
  );
});
