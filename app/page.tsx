'use client';

import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users, Clock, Box } from 'lucide-react';
import { useProfile } from '@farcaster/auth-kit';

import { useReadContract } from 'wagmi';
import { AD_AUCTION_ABI } from '@/lib/contracts';
import { formatEther } from 'viem';

export default function Home() {
  const { profile, isAuthenticated } = useProfile();
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  // Contract Read
  const contractAddress = (process.env.NEXT_PUBLIC_AD_AUCTION_CONTRACT_ADDRESS || "0xcE76Ed3427BDf5FbFe503EbA07263637dE03a3bC") as `0x${string}`;
  const { data: auctionData } = useReadContract({
    address: contractAddress,
    abi: AD_AUCTION_ABI,
    functionName: 'auctions',
    args: ['bads-daily-1'],
    query: { refetchInterval: 3000 }
  });

  const highestBidder = auctionData ? (auctionData as any)[4] : null;
  const hasWinner = highestBidder && highestBidder !== '0x0000000000000000000000000000000000000000';

  // For MVP, if there is a winner, we show a generic "Winner Ad" state since we haven't linked IPFS/DB yet.
  const adTitle = hasWinner ? `Ad by ${highestBidder.slice(0, 6)}...` : 'Daily Ad Slot Open';
  const adCta = hasWinner ? 'Click to visit advertiser' : 'Bid now to claim this spot!';

  // Handle referral
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) localStorage.setItem('referredBy', ref);
  }, []);

  const handleClaim = async () => {
    if (!isAuthenticated || !profile) return;

    const referredBy = localStorage.getItem('referredBy');

    // MOCK CLAIM for MVP
    // detailed claim logic would verify the user actually watched THIS specific ad
    const res = await fetch('/api/ads/watch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fid: profile.fid,
        adId: 'bads-daily-1', // Fixed ID for MVP
        referredBy: referredBy
      })
    });

    if (res.ok) {
      setIsClaimed(true);
      alert('Reward claimed!');
    } else {
      // Ignore errors for now or show generic
      // const error = await res.json();
      // alert(error.error || 'Failed to claim');
      setIsClaimed(true); // Demo success
    }
  };

  useEffect(() => {
    let interval: any;
    if (isHolding && !isRevealed) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsRevealed(true);
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
    } else {
      clearInterval(interval);
      if (!isRevealed) {
        setProgress(0);
      }
    }
    return () => clearInterval(interval);
  }, [isHolding, isRevealed]);

  return (
    <main>
      <Navbar />

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>--:--</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Until the next ad</div>
          </div>
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <Box size={32} style={{ color: 'var(--primary)' }} />
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Explore archive</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>Past Drops</div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Check out previous campaigns.</div>
          </div>
          <div style={{ width: 60, height: 60, background: 'var(--surface)', borderRadius: '12px' }}></div>
        </div>

        <div style={{ position: 'relative', height: '400px', borderRadius: '24px', overflow: 'hidden', background: '#000' }}>
          {/* Ad Image / Placeholder */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: hasWinner
              ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url("/images/ad-placeholder.png")`
              : `linear-gradient(45deg, #111, #222)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: isRevealed ? 'none' : 'blur(20px) brightness(0.5)',
            transition: 'filter 0.5s ease'
          }}></div>

          <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="badge">{hasWinner ? 'Sponsored' : 'Available'}</div>
          </div>

          <div style={{ position: 'absolute', top: '50px', left: '16px', right: '16px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>{adTitle}</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-dim)' }}>{adCta}</p>
          </div>

          {!isRevealed && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '60px' }}>
              <motion.button
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                style={{
                  width: '80%',
                  height: '60px',
                  background: 'var(--primary)',
                  borderRadius: '30px',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 82, 255, 0.3)'
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.2)',
                    width: `${progress}%`
                  }}
                />
                <span style={{ position: 'relative', zIndex: 1 }}>Hold to reveal</span>
              </motion.button>
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)' }}>
                <Users size={16} />
                <span style={{ fontSize: '13px' }}>Viewed by real humans</span>
              </div>
            </div>
          )}

          {isRevealed && (
            <div style={{ position: 'absolute', bottom: '20px', left: '16px', right: '16px' }}>
              <button
                onClick={handleClaim}
                disabled={isClaimed}
                className="btn-primary"
                style={{ width: '100%', height: '60px', fontSize: '18px', opacity: isClaimed ? 0.5 : 1 }}
              >
                {isClaimed ? 'Claimed ✓' : 'Claim $BADS'}
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
