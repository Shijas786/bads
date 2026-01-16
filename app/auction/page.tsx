'use client';

import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { Plus, List } from 'lucide-react';
import Link from 'next/link';

import { useReadContract } from 'wagmi';
import { AD_AUCTION_ABI } from '@/lib/contracts';
import { formatEther } from 'viem';

export default function Auction() {
    const contractAddress = (process.env.NEXT_PUBLIC_AD_AUCTION_CONTRACT_ADDRESS || "0xcE76Ed3427BDf5FbFe503EbA07263637dE03a3bC") as `0x${string}`;

    // Read Current Auction Status
    const { data: auctionData, isLoading } = useReadContract({
        address: contractAddress,
        abi: AD_AUCTION_ABI,
        functionName: 'auctions',
        args: ['bads-daily-1'], // HARDCODED AD ID
        query: { refetchInterval: 3000 }
    });

    // Parse Data
    // [adId, auctioneer, minBid, highestBidAmount, highestBidder, ended, endTime]
    const highestBid = auctionData ? formatEther((auctionData as any)[3]) : '0';
    const highestBidder = auctionData ? (auctionData as any)[4] : 'None';
    const hasBids = Number(highestBid) > 0;

    return (
        <main>
            <Navbar />

            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div className="badge">Current Auction</div>
                    <div className="card" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                        <List size={20} />
                    </div>
                </div>

                <div className="gradient-bg" style={{ marginBottom: '32px', background: 'var(--primary)', color: '#fff' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Bid on tomorrow's ad spot</h2>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px', lineHeight: '1.4' }}>
                        Place your bid now to run your ad for 24 hours and get real humans to see your thing.
                    </p>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-outline" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', flex: 1 }}>
                            How it works
                        </button>
                        <Link href="/create-ad" style={{ flex: 1 }}>
                            <button className="btn-primary" style={{ background: '#000', color: '#fff', width: '100%', border: '1px solid #333' }}>
                                <Plus size={20} />
                                Enter your Bid
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Debug Panel - Remove later */}
                <div style={{ background: '#111', padding: 8, fontSize: 10, color: '#666', marginBottom: 20 }}>
                    RAW DATA: {JSON.stringify(auctionData, (key, value) =>
                        typeof value === 'bigint' ? value.toString() : value // Handle BigInt serialization
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Current Bids</h3>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        {isLoading ? 'Syncing...' : 'Live'}
                    </div>
                </div>

                {!hasBids ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
                        No bids yet. Be the first!
                    </div>
                ) : (
                    <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)' }}></div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{highestBidder.slice(0, 6)}...{highestBidder.slice(-4)}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Just now</div>
                            </div>
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--primary)' }}>
                            {highestBid} ETH
                        </div>
                    </div>
                )}
            </div>

            <BottomNav />
        </main>
    );
}
