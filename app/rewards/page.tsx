'use client';

import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { Settings, Bell, RefreshCw, Wallet } from 'lucide-react';
import { SignInButton, useProfile } from '@farcaster/auth-kit';
import { useEffect, useState } from 'react';

export default function Rewards() {
    const { profile, isAuthenticated } = useProfile();
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (isAuthenticated && profile) {
            // Sync user and fetch balance
            fetch('/api/auth/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.user) setBalance(data.user.balance);
                });
        }
    }, [isAuthenticated, profile]);
    return (
        <main>
            <Navbar />

            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div className="card" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                        <Settings size={20} />
                    </div>
                    <div className="badge" style={{ color: 'var(--primary)', borderColor: 'var(--primary)', background: 'transparent' }}>
                        Verified ✓
                    </div>
                    <div className="card" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                        <Bell size={20} />
                    </div>
                </div>

                <div className="gradient-bg" style={{ position: 'relative', marginBottom: '16px', minHeight: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                        <RefreshCw size={20} />
                    </div>

                    <div style={{ background: '#000', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', marginBottom: '20px' }}>
                        Unclaimed Rewards
                    </div>

                    <div style={{ fontSize: '80px', fontWeight: 'bold', lineHeight: 1 }}>0</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '32px' }}>$BADS</div>

                    {!isAuthenticated ? (
                        <SignInButton />
                    ) : (
                        <button style={{
                            width: '100%',
                            padding: '20px',
                            border: '1px solid #000',
                            borderRadius: '16px',
                            fontSize: '18px',
                            fontWeight: '600',
                            opacity: 0.5
                        }}>
                            Claim
                        </button>
                    )}
                </div>

                <div className="card" style={{ padding: '24px', borderColor: 'var(--primary)', borderWidth: '2px', background: 'transparent' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div className="badge">Balance</div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>$BADS</div>
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--primary)', textAlign: 'center' }}>
                        {balance}
                    </div>
                </div>

                <div className="card" style={{ marginTop: '16px', padding: '16px', background: 'linear-gradient(90deg, #A78BFA 0%, #7C3AED 100%)', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>Buy $BADS</span>
                        <Wallet size={24} />
                    </div>
                </div>
            </div>

            <BottomNav />
        </main>
    );
}
