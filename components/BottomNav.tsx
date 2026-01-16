'use client';

import { Trophy, Gift, Smile } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="nav-bottom">
            <Link href="/auction" className={`nav-item ${pathname === '/auction' ? 'active' : ''}`}>
                <Trophy size={24} />
            </Link>

            <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
                <Smile size={32} strokeWidth={pathname === '/' ? 2.5 : 2} style={{ color: pathname === '/' ? 'var(--primary)' : 'var(--text-dim)' }} />
            </Link>

            <Link href="/rewards" className={`nav-item ${pathname === '/rewards' ? 'active' : ''}`}>
                <Gift size={24} />
            </Link>
        </div>
    );
}
