'use client';

import { SignInButton, useProfile } from '@farcaster/auth-kit';
import { ChevronDown, Share2, X } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
    const { profile } = useProfile();

    const handleShare = () => {
        if (!profile) return alert('Please sign in to share');
        const text = `Watching today's ad on BADS! 😬\n\nEarn $BADS by watching ads daily.`;
        const url = `https://bads.app/?ref=${profile.fid}`;
        const intent = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`;
        window.open(intent, '_blank');
    };

    return (
        <nav style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 50,
            borderBottom: '1px solid var(--border)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={24} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <Image src="/images/logo.png" alt="BADS Mascot" width={40} height={40} style={{ borderRadius: '50%' }} />
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>BADS</span>
                <ChevronDown size={20} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={handleShare}>
                    <Share2 size={24} />
                </button>
            </div>
        </nav>
    );
}
