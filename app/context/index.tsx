'use client';

import { wagmiAdapter, projectId, networks } from '@/app/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { base } from '@reown/appkit/networks';
import React, { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

const queryClient = new QueryClient();



const metadata = {
    name: 'BADS',
    description: 'Decentralized Advertising on Farcaster',
    url: 'https://bads.app',
    icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

// Create the modal
createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    defaultNetwork: base,
    metadata: metadata,
    features: {
        analytics: true,
    },
    themeMode: 'dark',
    themeVariables: {
        '--w3m-accent': '#0052FF',
        '--w3m-border-radius-master': '1px'
    }
});

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}

export default ContextProvider;
