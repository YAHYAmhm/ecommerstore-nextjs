'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../globals.css';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setError('Verification token is missing');
            setLoading(false);
            return;
        }

        verifyEmail(token);
    }, [searchParams]);

    const verifyEmail = async (token: string) => {
        try {
            const res = await fetch(`/api/auth/verify-email?token=${token}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Verification failed');
            } else {
                setMessage(data.message);
                setTimeout(() => router.push('/signin'), 3000);
            }
        } catch (err) {
            setError('An error occurred during verification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', padding: '2rem' }}>
            <div className="card animate-fade-in" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                {loading && (
                    <>
                        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Verifying Your Email</h2>
                        <p style={{ color: 'var(--text-light)' }}>Please wait...</p>
                    </>
                )}

                {!loading && message && (
                    <>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Email Verified!</h2>
                        <p style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>{message}</p>
                        <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Redirecting to sign in...</p>
                    </>
                )}

                {!loading && error && (
                    <>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--error)' }}>Verification Failed</h2>
                        <p style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>{error}</p>
                        <Link href="/signin" className="btn btn-primary">
                            Go to Sign In
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
