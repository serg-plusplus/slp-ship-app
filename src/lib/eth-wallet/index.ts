import { useMemo } from "react";
import { useWallet } from "use-wallet";
import { providers } from "ethers";

export function useWalletProvider() {
  const { ethereum } = useWallet<providers.ExternalProvider>();
  return useMemo(
    () => (ethereum ? new providers.Web3Provider(ethereum) : null),
    [ethereum]
  );
}
