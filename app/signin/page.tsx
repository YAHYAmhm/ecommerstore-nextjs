'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import '../globals.css';

export default function SignInPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Invalid credentials');
                return;
            }

            setUser(data.user);
            router.push('/');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
            <div className="card animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-light)' }}>Sign in to your account</p>
                </div>

                {error && (
                    <div style={{ background: '#fee', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--error)', marginBottom: '1rem' }}>
                        <p className="error-message">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label className="label">Email Address</label>
                        <input
                            type="email"
                            className="input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <Link href="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: '600' }}>
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', fontSize: '1.125rem' }}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-light)' }}>
                    Don't have an account?{' '}
                    <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
