import { useCallback, useMemo, memo, useRef } from "react";
import classNames from "clsx";
import { useWallet } from "use-wallet";
import toast from "react-hot-toast";
import { useBadger } from "lib/badger";
import HashShortView from "app/components/atoms/HashShortView";

const Connect: React.FC = () => {
  return (
    <div className="flex flex-col">
      <ConnetMetamask />
      <ConnetBadger />
    </div>
  );
};

export default Connect;

const ConnetMetamask = memo(() => {
  const { connect, account } = useWallet();
  const connectingRef = useRef(false);

  const handleClick = useCallback(() => {
    if (account) return;

    if (connectingRef.current) return;
    connectingRef.current = true;

    const promise = connect("injected").finally(() => {
      connectingRef.current = false;
    });

    toast.promise(promise, {
      loading: "Connecting...",
      success: () => "Connected!",
      error: (err) => `Error when try to connect: ${err?.message ?? "unknown"}`,
    });
  }, [connect, account]);

  return (
    <button
      className={classNames(
        "mb-4 w-56",
        "flex items-center py-2 px-4",
        "tracking-wide",
        "text-lg font-bold rounded-md text-brand-blue",
        "border-2 border-dashed border-brand-indigo",
        !account ? "hover:bg-brand-darkgray" : "cursor-default"
      )}
      onClick={handleClick}
    >
      {account ? (
        <>
          <div className="flex-1" />
          <HashShortView>{account}</HashShortView>
        </>
      ) : (
        "Connect to Metamask"
      )}
    </button>
  );
});

const ConnetBadger = memo(() => {
  const bch = useBadger();
  const installed = Boolean(bch?.defaultAccount);

  const commonProps = useMemo(
    () => ({
      className: classNames(
        "mb-4 w-56",
        "flex items-center py-2 px-4",
        "tracking-wide",
        "text-lg font-bold rounded-md text-brand-blue",
        "border-2 border-dashed border-brand-indigo",
        !installed ? "hover:bg-brand-darkgray" : "cursor-default"
      ),
    }),
    [installed]
  );

  return installed ? (
    <button {...commonProps}>
      <div className="flex-1" />
      <HashShortView>{bch!.defaultAccount.split(":")[1]}</HashShortView>
    </button>
  ) : (
    <a
      {...commonProps}
      href="https://badgerwallet.cash/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Install Badger Wallet
    </a>
  );
});
