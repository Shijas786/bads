'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Wallet, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { AD_AUCTION_ABI } from '@/lib/contracts';
import { parseEther } from 'viem';

export default function BidPage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const [draft, setDraft] = useState<any>(null);
    const [bidAmount, setBidAmount] = useState('');
    const [status, setStatus] = useState<string>('');

    // Load draft from local storage
    useEffect(() => {
        const stored = localStorage.getItem('adDraft');
        if (stored) {
            setDraft(JSON.parse(stored));
        } else {
            // If no draft, redirect back to create
            router.push('/create-ad');
        }
    }, [router]);

    // Contract Interaction
    const { data: hash, isPending, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isConfirming) setStatus('Confirming transaction...');
        if (isSuccess) {
            setStatus('Bid placed successfully!');
            // clear draft
            localStorage.removeItem('adDraft');
            // Navigate to success or auction page
            setTimeout(() => router.push('/auction'), 2000);
        }
    }, [isConfirming, isSuccess, router]);

    const handleBid = async () => {
        if (!bidAmount || parseFloat(bidAmount) <= 0) return alert('Enter a valid amount');
        if (!isConnected) return alert('Please connect your wallet first');

        try {
            setStatus('Initiating wallet...');
            writeContract({
                address: process.env.NEXT_PUBLIC_AD_AUCTION_CONTRACT_ADDRESS as `0x${string}`,
                abi: AD_AUCTION_ABI,
                functionName: 'placeBid',
                args: ['bads-daily-1'], // HARDCODED AD ID FOR MVP
                value: parseEther(bidAmount),
            });
        } catch (err: any) {
            console.error(err);
            setStatus('Error: ' + (err.message || 'Transaction failed'));
        }
    };

    if (!draft) return <div style={{ padding: 20 }}>Loading...</div>;

    return (
        <main style={{ paddingBottom: 100 }}>
            {/* Header */}
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)' }}>
                <Link href="/create-ad">
                    <ChevronLeft size={24} color="#fff" />
                </Link>
                <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Review & Bid</h1>
            </div>

            <div style={{ padding: '20px' }}>
                {/* Ad Preview Card */}
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Ad Preview</h2>
                    <div className="card" style={{ padding: '0', overflow: 'hidden', background: '#000', border: '1px solid #333' }}>
                        <div style={{ height: '200px', background: 'linear-gradient(45deg, #111, #222)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                            {/* Placeholder for verify image */}
                            {draft.visualName ? <span>{draft.visualName}</span> : <span>No Image</span>}
                        </div>
                        <div style={{ padding: '16px' }}>
                            <div className="badge" style={{ marginBottom: '8px', display: 'inline-block' }}>{draft.projectName || 'Project'}</div>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>{draft.campaignTitle || 'Campaign Title'}</h3>
                            <p style={{ fontSize: '14px', color: '#999' }}>{draft.description || 'Description...'}</p>
                        </div>
                    </div>
                </div>

                {/* Bidding Section */}
                <div>
                    <h2 style={{ fontSize: '14px', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Place your Bid</h2>

                    {!isConnected ? (
                        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                            <Wallet size={32} style={{ margin: '0 auto 16px', color: 'var(--primary)' }} />
                            <p style={{ marginBottom: '16px' }}>Connect your wallet to place a bid on the daily ad spot.</p>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <appkit-button />
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ padding: '20px' }}>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', color: '#999', marginBottom: '8px', display: 'block' }}>Bid Amount (ETH)</label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        placeholder="0.01"
                                        value={bidAmount}
                                        onChange={e => setBidAmount(e.target.value)}
                                        style={{
                                            width: '100%',
                                            background: '#000',
                                            border: '1px solid #333',
                                            color: '#fff',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            fontSize: '24px',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#999' }}>
                                    <span>Current highest bid:</span>
                                    <span>-- ETH</span>
                                </div>

                                {status && (
                                    <div style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        background: status.includes('Error') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 82, 255, 0.1)',
                                        color: status.includes('Error') ? '#ff4d4d' : 'var(--primary)',
                                        fontSize: '13px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <AlertCircle size={16} />
                                        {status}
                                    </div>
                                )}

                                <button
                                    onClick={handleBid}
                                    disabled={isPending || isConfirming}
                                    className="btn-primary"
                                    style={{
                                        width: '100%',
                                        height: '56px',
                                        fontSize: '18px',
                                        opacity: (isPending || isConfirming) ? 0.7 : 1
                                    }}
                                >
                                    {isPending ? 'Check Wallet...' : isConfirming ? 'Confirming...' : `Place Bid`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
