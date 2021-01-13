import * as React from "react";
import { useWallet } from "use-wallet";

const LS_KEY = "eth-wallet-connected";

const WalletReconnect: React.FC = () => {
  const { connect, account } = useWallet();
  const prevAccountRef = React.useRef(account);
  const triedRef = React.useRef(false);

  React.useEffect(() => {
    if (!prevAccountRef.current && account) {
      localStorage.setItem(LS_KEY, "true");
    } else if (prevAccountRef.current && !account) {
      localStorage.removeItem(LS_KEY);
    }

    prevAccountRef.current = account;
  }, [account]);

  React.useEffect(() => {
    if (triedRef.current) return;
    triedRef.current = true;

    if (localStorage.getItem(LS_KEY)) {
      connect("injected");
    }
  }, [connect]);

  return null;
};

export default WalletReconnect;
