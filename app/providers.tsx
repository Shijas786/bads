'use client';

import { AuthKitProvider } from '@farcaster/auth-kit';

const config = {
    rpcUrl: 'https://mainnet.optimism.io',
    domain: 'bads.app',
    siweUri: 'https://bads.app/api/auth/siwe',
};

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthKitProvider config={config}>
            {children}
        </AuthKitProvider>
    );
}
