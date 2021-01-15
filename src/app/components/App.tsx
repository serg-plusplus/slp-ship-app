import { Suspense } from "react";
import { LocationProvider } from "woozie";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { UseWalletProvider } from "use-wallet";
import { Toaster } from "react-hot-toast";
import { UseBadgerProvider } from "lib/badger";
import { ETH_CHAIN_ID, QUERY_CLIENT, FONTS } from "app/defaults";
import ErrBond from "app/components/a11y/ErrBond";
import WalletReconnect from "app/components/a11y/WalletReconnect";
import AwaitFonts from "app/components/a11y/AwaitFonts";
import PageRouter from "app/components/PageRouter";

const App: React.FC = () => (
  <LocationProvider>
    <QueryClientProvider client={QUERY_CLIENT}>
      <UseWalletProvider chainId={ETH_CHAIN_ID}>
        <UseBadgerProvider>
          <>
            <ErrBond>
              <Suspense fallback={null}>
                <AwaitFonts fonts={FONTS} />

                <PageRouter />
              </Suspense>

              <WalletReconnect />
            </ErrBond>

            <Toaster />

            {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
          </>
        </UseBadgerProvider>
      </UseWalletProvider>
    </QueryClientProvider>
  </LocationProvider>
);

export default App;
