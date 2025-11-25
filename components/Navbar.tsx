'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { useCart } from '@/lib/useCart';
import { useTheme, useLanguage, Language } from '@/lib/providers';
import { ShoppingCart, User, LogOut, Sun, Moon, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const { getItemCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const [langOpen, setLangOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const itemCount = getItemCount();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                // Scrolling up or at top
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down and past threshold
                setIsVisible(false);
                setLangOpen(false); // Close language dropdown when hiding
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'ar', label: 'العربية', flag: '🇸🇦' },
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'es', label: 'Español', flag: '🇪🇸' },
    ];

    return (
        <nav style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 0',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.3s ease-in-out',
            boxShadow: 'var(--shadow-md)'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>🛍️</span>
                    <span className="gradient-text">E-Store</span>
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link href="/products" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>
                        {t('nav.products')}
                    </Link>

                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {/* Language Selector */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                            <Globe size={20} />
                            <span style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.875rem' }}>{language}</span>
                        </button>

                        {langOpen && (
                            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', minWidth: '150px', overflow: 'hidden', zIndex: 100 }}>
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setLangOpen(false);
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1rem', border: 'none', background: language === lang.code ? 'var(--background)' : 'transparent', cursor: 'pointer', color: 'var(--text)', textAlign: 'left', transition: 'background 0.2s' }}
                                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--background)'}
                                        onMouseOut={(e) => e.currentTarget.style.background = language === lang.code ? 'var(--background)' : 'transparent'}
                                    >
                                        <span>{lang.flag}</span>
                                        <span>{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link href="/cart" style={{ position: 'relative', color: 'var(--text)', textDecoration: 'none' }}>
                        <ShoppingCart size={24} />
                        {itemCount > 0 && (
                            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <>
                            {user.isAdmin && (
                                <Link href="/admin" style={{ color: 'var(--success)', textDecoration: 'none', fontWeight: '500' }}>
                                    {t('nav.admin')}
                                </Link>
                            )}
                            <Link href="/profile" style={{ color: 'var(--text)', textDecoration: 'none' }}>
                                <User size={24} />
                            </Link>
                            <button onClick={signOut} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                                <LogOut size={24} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/signin" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--text)', borderColor: 'var(--border)' }}>
                                {t('nav.signin')}
                            </Link>
                            <Link href="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                {t('nav.signup')}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
