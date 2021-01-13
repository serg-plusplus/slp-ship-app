import { Router, Redirect } from "woozie";
import { QueryClient } from "react-query";
import Main from "app/components/pages/Main";
import ToWSLP from "app/components/pages/ToWSLP";
import FromWSLP from "app/components/pages/FromWSLP";

export const ROUTE_MAP = Router.createMap([
  ["/", () => <Main />],
  ["/to-wslp", () => <ToWSLP />],
  ["/from-wslp", () => <FromWSLP />],
  ["*", () => <Redirect to="/" />],
]);

export const QUERY_CLIENT = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      refetchOnWindowFocus: false,
    },
  },
});

export const ETH_CHAIN_ID = +(process.env.REACT_APP_ETH_CHAIN_ID ?? 1);
