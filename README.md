# BADS - Decentralized Ad Spot Auction 📢

**The Homepage of the Decentralized Web.**

BADS is a Web3-native advertising platform built on **Base** and **Farcaster**. It democratizes ad space by auctioning a single, high-visibility "Hero Ad Spot" every 24 hours. Advertisers bid in ETH, and the winner owns the homepage for the day. Users earn rewards for engaging with these ads.

## 🌟 Features

-   **Daily Auctions**: A decentralized English Auction system where the highest bidder wins the daily ad slot.
-   **Transparency**: All bids and settlements are executed on-chain via the `AdBidding` smart contract.
-   **Create Ad Flow**: Intuitive UI to design your campaign, upload visuals, and set links efficiently.
-   **Wallet Connection**: Integrated with **Reown AppKit** (formerly WalletConnect) for seamless, secure login and transactions.
-   **Farcaster Integration**: Sign in with Farcaster (AuthKit) to track watch history and personalized engagement.
-   **Watch-to-Earn**: Users claim $BADS tokens by holding to reveal and proving attention to ads.

## 🛠 Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Blockchain**: Base (Coinbase L2)
-   **Smart Contracts**: Solidity, Hardhat
-   **Web3 Interaction**: [Reown AppKit](https://reown.com/), Wagmi, Viem
-   **Auth**: Farcaster AuthKit
-   **Database**: Supabase (PostgreSQL), Prisma ORM
-   **Styling**: CSS Modules, Framer Motion for animations

## ⛓ Smart Contract

The core logic is handled by the `AdBidding.sol` contract deployed on the **Base** network.

-   **Contract Address**: `0xcE76Ed3427BDf5FbFe503EbA07263637dE03a3bC`
-   **Platform Fee**: 5% of winning bids.
-   **Auction Mechanics**:
    -   `createAuction`: Starts a new 24h cycle with a minimum bid.
    -   `placeBid`: Accepts ETH bids (must be higher than current highest). Automatically refunds outbid users.
    -   `endAuction`: Settles the auction, transfers funds to the auctioneer (minus fee), and finalizes the slot.

## 🚀 Getting Started

### Prerequisites
-   Node.js v20+
-   Supabase Account (Database)
-   Reown Project ID (Wallet Connect)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Shijas786/bads.git
    cd bads
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory:
    ```env
    # Database
    DATABASE_URL="postgresql://..."
    NEXT_PUBLIC_SUPABASE_URL="..."
    NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

    # Web3 / Reown
    NEXT_PUBLIC_PROJECT_ID="your_reown_project_id"
    NEXT_PUBLIC_AD_AUCTION_CONTRACT_ADDRESS="0xcE..."
    
    # Farcaster
    NEXT_PUBLIC_FARCASTER_CLIENT_ID="..."
    NEYNAR_API_KEY="..."
    ```

4.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📜 Smart Contract Development

Contracts are located in the `smart-contracts` folder.

```bash
cd smart-contracts
npm install
npx hardhat compile
npx hardhat test
# Deploy
npx hardhat run scripts/deploy_contract.js --network base-sepolia
```

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
