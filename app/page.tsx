'use client';

import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users, Clock, Box } from 'lucide-react';
import { useProfile } from '@farcaster/auth-kit';

export default function Home() {
  const { profile, isAuthenticated } = useProfile();
  const [ad, setAd] = useState<any>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    fetch('/api/ads/today')
      .then(res => res.json())
      .then(data => setAd(data));

    // Handle referral
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      localStorage.setItem('referredBy', ref);
    }
  }, []);

  const handleClaim = async () => {
    if (!isAuthenticated || !profile || !ad) return;

    const referredBy = localStorage.getItem('referredBy');

    const res = await fetch('/api/ads/watch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fid: profile.fid,
        adId: ad.id,
        referredBy: referredBy
      })
    });

    if (res.ok) {
      setIsClaimed(true);
      alert('Reward claimed!');
    } else {
      const error = await res.json();
      alert(error.error || 'Failed to claim');
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
            <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>17:17</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Until the next ad</div>
          </div>
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <Box size={32} style={{ color: 'var(--primary)' }} />
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Explore archive</div>
          </div>
        </div>

        <div className="card" style={{ padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>Holiday Drop ended</div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Check out the winners.</div>
          </div>
          <div style={{ width: 60, height: 60, background: 'var(--surface)', borderRadius: '12px' }}></div>
        </div>

        <div style={{ position: 'relative', height: '400px', borderRadius: '24px', overflow: 'hidden', background: '#000' }}>
          {/* Ad Image / Placeholder */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url("${ad?.mediaUrl || '/images/ad-placeholder.png'}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: isRevealed ? 'none' : 'blur(20px) brightness(0.5)',
            transition: 'filter 0.5s ease'
          }}></div>

          <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="badge">by {ad?.advertiserName || ad?.advertiser?.displayName || 'Advertiser'}</div>
            <div style={{ fontSize: '12px', color: '#fff' }}>17:17:35</div>
          </div>

          <div style={{ position: 'absolute', top: '50px', left: '16px', right: '16px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>{ad?.title || 'Loading Ad...'}</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-dim)' }}>{ad?.ctaLink || ''}</p>
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
                <span style={{ fontSize: '13px' }}>Viewed by 3.6K humans</span>
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
