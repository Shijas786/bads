'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Share, Image as ImageIcon, ChevronLeft } from 'lucide-react';
import styles from './create-ad.module.css';
import Link from 'next/link';

export default function CreateAd() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        projectName: '',
        campaignTitle: '',
        description: '',
        keyLink: '',
        xLink: '',
        visual: null as File | null
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, visual: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Save to DB/Storage
        console.log('Submitting:', formData);

        // Navigate to bidding
        // In a real app, we'd pass the AD ID created
        router.push('/auction/bid');
    };

    return (
        <main className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/auction">
                    <X size={24} color="#fff" />
                </Link>
                <div className={styles.logo}>
                    <div style={{ width: 24, height: 24, background: '#E3F87D', borderRadius: 4 }}></div>
                    <span>BADS</span>
                </div>
                <Share size={24} color="#fff" />
            </header>

            {/* Hero / Info Banner */}
            <div className={styles.yellowGradient}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Link href="/auction" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                        <ChevronLeft size={20} />
                        1/2 Create your ad
                    </Link>
                    <div style={{ background: 'rgba(0,0,0,0.1)', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                        Takes 2-3 min
                    </div>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.4, fontWeight: 500 }}>
                    Describe your project, select the link. This will appear on the card and ad detail page. This info is final and can't be changed later.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Project Name */}
                <div className={styles.formGroup}>
                    <input
                        className={styles.input}
                        placeholder="Project name"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                    />
                    <p className={styles.helperText}>This will appear on the ad card (e.g. BADS).</p>
                </div>

                {/* Campaign Title */}
                <div className={styles.formGroup}>
                    <input
                        className={styles.input}
                        placeholder="Add your campaign title"
                        name="campaignTitle"
                        value={formData.campaignTitle}
                        onChange={handleInputChange}
                    />
                    <p className={styles.helperText}>This will appear on the ad detail page (e.g. New mini-app for driving attention).</p>
                </div>

                {/* Description */}
                <div className={styles.formGroup}>
                    <textarea
                        className={styles.textarea}
                        placeholder="Describe your product / service / idea..."
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    <p className={styles.helperText}>This will appear on the ad detail page.</p>
                </div>

                {/* Key Link */}
                <div className={styles.formGroup}>
                    <p className={styles.label}>Key link</p>
                    <input
                        className={styles.input}
                        placeholder="http://www.com"
                        name="keyLink"
                        value={formData.keyLink}
                        onChange={handleInputChange}
                    />
                    <p className={styles.helperText}>This is the key link you want people to visit.</p>
                </div>

                {/* X Link */}
                <div className={styles.formGroup}>
                    <p className={styles.label}>X link</p>
                    <input
                        className={styles.input}
                        placeholder="https://x.com/madsonworld"
                        name="xLink"
                        value={formData.xLink}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Key Visual */}
                <div className={styles.formGroup} style={{ paddingBottom: 100 }}>
                    <p className={styles.label}>Key Visual</p>
                    <label className={styles.uploadBox}>
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        <ImageIcon size={24} color="#666" />
                        {formData.visual && <span style={{ fontSize: 10, marginLeft: 8, color: '#fff' }}>Selected</span>}
                    </label>
                    <p className={styles.helperText}>
                        Image will appear on the ad card and in our socials. We recommend using a square image (1:1) under 3MB in PNG or JPG format.
                    </p>
                </div>

                {/* Bottom Bar */}
                <div className={styles.footer}>
                    <button type="submit" className={styles.submitBtn}>
                        Continue to bidding
                    </button>
                </div>
            </form>
        </main>
    );
}
