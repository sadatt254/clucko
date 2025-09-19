import {PrivyProvider} from '@privy-io/react-auth';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {WagmiProvider, createConfig} from '@privy-io/wagmi';

const queryClient = new QueryClient();
const wagmiConfig = createConfig(/* ... */);

export default function Providers({children}) {
  return (
    <PrivyProvider appId="your-privy-app-id" config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
