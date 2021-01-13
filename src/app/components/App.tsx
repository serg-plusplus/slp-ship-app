import { Suspense } from "react";
import { LocationProvider } from "woozie";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { UseWalletProvider } from "use-wallet";
import { Toaster } from "react-hot-toast";
import { ETH_CHAIN_ID, QUERY_CLIENT } from "app/defaults";
import ErrBond from "app/components/a11y/ErrBond";
import AwaitFonts from "app/components/a11y/AwaitFonts";
import PageRouter from "app/components/PageRouter";

const App: React.FC = () => (
  <LocationProvider>
    <QueryClientProvider client={QUERY_CLIENT}>
      <UseWalletProvider chainId={ETH_CHAIN_ID}>
        <>
          <ErrBond>
            <Suspense fallback={null}>
              <AwaitFonts fonts={[]} />

              <PageRouter />
            </Suspense>
          </ErrBond>

          <Toaster />

          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
        </>
      </UseWalletProvider>
    </QueryClientProvider>
  </LocationProvider>
);

export default App;
