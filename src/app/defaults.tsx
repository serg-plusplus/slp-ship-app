import { Router, Redirect } from "woozie";
import { QueryClient } from "react-query";
import Main from "app/components/pages/Main";

export const ROUTE_MAP = Router.createMap([
  ["/", () => <Main />],
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
