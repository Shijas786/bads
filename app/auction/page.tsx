'use client';

import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { Plus, List } from 'lucide-react';
import Link from 'next/link';

export default function Auction() {
    return (
        <main>
            <Navbar />

            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div className="badge">Auction #110</div>
                    <div className="card" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                        <List size={20} />
                    </div>
                </div>

                <div className="gradient-bg" style={{ marginBottom: '32px', background: 'var(--primary)', color: '#fff' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Bid on tomorrow's ad spot</h2>
                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px', lineHeight: '1.4' }}>
                        You haven't joined the race yet. Place your bid now to run your ad for 24 hours and get real humans to see your thing.
                    </p>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-outline" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', flex: 1 }}>
                            How it works
                        </button>
                        <Link href="/create-ad" style={{ flex: 1 }}>
                            <button className="btn-primary" style={{ background: '#fff', color: 'var(--primary)', width: '100%' }}>
                                <Plus size={20} />
                                Enter your Bid
                            </button>
                        </Link>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Current Bids</h3>
                    <div className="card" style={{ padding: '4px 8px', fontSize: '13px', color: 'var(--text-dim)' }}>
                        16:17:22
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
                    No bids.
                </div>
            </div>

            <BottomNav />
        </main>
    );
}
