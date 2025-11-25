'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../globals.css';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = searchParams.get('token');
        if (!token) {
            setError('Reset token is missing');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, token }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
            } else {
                setSuccess(data.message);
                setTimeout(() => router.push('/signin'), 3000);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '2rem' }}>
            <div className="card animate-fade-in" style={{ maxWidth: '450px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
                    <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Reset Password</h1>
                    <p style={{ color: 'var(--text-light)' }}>Enter your new password</p>
                </div>

                {error && (
                    <div style={{ background: '#fee', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--error)', marginBottom: '1rem' }}>
                        <p className="error-message">{error}</p>
                    </div>
                )}

                {success && (
                    <div style={{ background: '#efe', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--success)', marginBottom: '1rem' }}>
                        <p className="success-message">{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label className="label">New Password</label>
                        <input
                            type="password"
                            className="input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />
                    </div>

                    <div>
                        <label className="label">Confirm New Password</label>
                        <input
                            type="password"
                            className="input"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-secondary"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link href="/signin" style={{ color: 'var(--text-light)', fontSize: '0.875rem', textDecoration: 'none' }}>
                        ← Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
