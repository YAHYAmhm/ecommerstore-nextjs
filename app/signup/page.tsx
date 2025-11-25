'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import '../globals.css';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
                return;
            }

            setSuccess(data.message);
            setTimeout(() => router.push('/signin'), 3000);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
            <div className="card animate-fade-in" style={{ maxWidth: '500px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-light)' }}>Join us and start shopping!</p>
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
                        <label className="label">Full Name</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                        />
                    </div>

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
                            minLength={8}
                        />
                    </div>

                    <div>
                        <label className="label">Confirm Password</label>
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
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', fontSize: '1.125rem' }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-light)' }}>
                    Already have an account?{' '}
                    <Link href="/signin" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
