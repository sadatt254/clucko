'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { mainnet, sepolia } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from '@privy-io/wagmi';
import { config } from './config';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            config={{
                appearance: { theme: 'dark', accentColor: '#676FFF' },
                defaultChain: mainnet,
                supportedChains: [mainnet, sepolia],
                embeddedWallets: { createOnLogin: 'users-without-wallets' },
            }}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>
                    {children}
                </WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
}
