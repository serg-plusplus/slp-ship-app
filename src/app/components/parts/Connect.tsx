import { useCallback, memo, useRef } from "react";
import classNames from "clsx";
import { useWallet } from "use-wallet";
import toast from "react-hot-toast";
import { useBadger } from "lib/badger";
import HashShortView from "app/components/atoms/HashShortView";

const Connect: React.FC = () => {
  return (
    <div className="flex flex-col">
      {[
        {
          title: "Badger",
          netSlug: "mainnet",
          Component: ConnetBadger,
        },
        {
          title: "Metamask",
          netSlug: "kovan",
          Component: ConnetMetamask,
        },
      ].map(({ title, netSlug, Component }, i) => (
        <div key={i} className="mb-4 flex items-center justify-end">
          <div className={classNames("mr-4", "flex flex-col items-end")}>
            <span className="text-brand-indigo">{title}</span>
            <span className="font-courier text-brand-darkgray text-xs uppercase">
              {netSlug}
            </span>
          </div>

          <Component
            className={classNames(
              "w-64",
              "flex items-center justify-center py-3 px-4",
              "tracking-tight",
              "text-lg font-bold rounded-md text-brand-blue",
              "border-2 border-dashed border-brand-indigo",
              "transition ease-in-out duration-300"
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default Connect;

const ConnetMetamask = memo<{ className?: string }>(({ className }) => {
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
        className,
        !account
          ? "hover:bg-brand-indigo hover:bg-opacity-75"
          : "cursor-default"
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

const ConnetBadger = memo<{ className?: string }>(({ className }) => {
  const bch = useBadger();
  const installed = Boolean(bch?.defaultAccount);

  const commonClassName = classNames(
    className,
    !installed ? "hover:bg-brand-indigo hover:bg-opacity-75" : "cursor-default"
  );

  return installed ? (
    <button className={commonClassName}>
      <div className="flex-1" />
      <HashShortView>{bch!.defaultAccount.split(":")[1]}</HashShortView>
    </button>
  ) : (
    <a
      className={commonClassName}
      href="https://badgerwallet.cash/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Install Badger Wallet
    </a>
  );
});
