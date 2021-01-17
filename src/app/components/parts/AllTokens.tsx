import { useCallback } from "react";
import classNames from "clsx";
import { useQuery } from "react-query";
import { useWalletProvider } from "lib/eth-wallet";
import { getLatestWSLPTokens } from "lib/slp-ship";

const AllTokensWrapper: React.FC = () => (
  <div className="my-12 w-full flex flex-col items-center">
    <div className="max-w-sm text-center">
      <h1
        className={classNames(
          "mb-6",
          "text-brand-indigo",
          "text-3xl",
          "font-bold",
          "uppercase tracking-tight"
        )}
      >
        Latest tokens
      </h1>
    </div>

    <AllTokens />
  </div>
);

export default AllTokensWrapper;

const AllTokens: React.FC = () => {
  const provider = useWalletProvider();
  const providerExists = Boolean(provider);
  const fetchAllTokens = useCallback(async () => {
    if (!provider) return [];
    try {
      return getLatestWSLPTokens(provider);
    } catch {
      return [];
    }
  }, [provider]);
  const { data: allTokens } = useQuery(
    ["all-wslp", { providerExists }],
    fetchAllTokens,
    {
      refetchInterval: 20_000,
    }
  );

  return allTokens && allTokens.length > 0 ? (
    <div className="py-6 flex flex-col items-stretch">
      {allTokens.map((t) => (
        <div
          key={t.address}
          className={classNames(
            "w-full mb-8",
            "border-2 border-dashed border-brand-indigo",
            "rounded-xl",
            "px-8 py-4"
          )}
        >
          <div className="mb-4 flex items-end">
            <h3
              className={classNames(
                "mr-4",
                "text-brand-indigo",
                "text-2xl",
                "font-bold",
                "tracking-tight"
              )}
            >
              {t.symbol}
            </h3>

            <p
              className={classNames(
                "font-courier",
                "text-xl",
                "text-brand-indigo"
              )}
            >
              {t.name}
            </p>
          </div>

          <p className={classNames("mb-4")}>
            <span className="font-courier text-brand-darkgray">
              SLP Token ID
            </span>
            <br />
            <span className="text-sm text-brand-black font-bold">
              {t.slpId}
            </span>
          </p>

          <p className={classNames("mb-4")}>
            <span className="font-courier text-brand-darkgray">
              WSLP (ERC20) Address
            </span>
            <br />
            <span className="text-sm text-brand-black font-bold">
              {t.address}
            </span>
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p
      className={classNames(
        "py-6",
        "text-center",
        "font-courier",
        "text-lg",
        "text-brand-darkgray"
      )}
    >
      No tokens yet
    </p>
  );
};
