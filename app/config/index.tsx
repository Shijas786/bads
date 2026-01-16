
import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { type AppKitNetwork, base, baseSepolia } from '@reown/appkit/networks';

// TODO: Ensure this is set in your Vercel project settings
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694";

if (!projectId) {
    console.warn("Project ID is not defined");
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [base, baseSepolia];

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    projectId,
    networks,
});

export const config = wagmiAdapter.wagmiConfig;
