'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../globals.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
            } else {
                setMessage(data.message);
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
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                    <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Forgot Password?</h1>
                    <p style={{ color: 'var(--text-light)' }}>No worries, we'll send you reset instructions</p>
                </div>

                {error && (
                    <div style={{ background: '#fee', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--error)', marginBottom: '1rem' }}>
                        <p className="error-message">{error}</p>
                    </div>
                )}

                {message && (
                    <div style={{ background: '#efe', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--success)', marginBottom: '1rem' }}>
                        <p className="success-message">{message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label className="label">Email Address</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-secondary"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
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
