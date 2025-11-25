'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useCart } from '@/lib/useCart';
import { useAuth } from '@/lib/useAuth';
import '../globals.css';

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { items, getTotal, clearCart } = useCart();
    const total = getTotal();

    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
        paymentMethod: 'credit_card',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            router.push('/signin?redirect=/checkout');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shippingAddress: {
                        fullName: formData.fullName,
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        country: formData.country,
                        phone: formData.phone,
                    },
                    paymentMethod: formData.paymentMethod,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to place order');
                return;
            }

            clearCart();
            alert('Order placed successfully!');
            router.push('/profile');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        router.push('/cart');
        return null;
    }

    return (
        <div className="page-with-navbar">
            <Navbar />

            <div className="container" style={{ padding: '2rem 0' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Checkout</h1>

                {error && (
                    <div style={{ background: '#fee', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--error)', marginBottom: '2rem' }}>
                        <p className="error-message">{error}</p>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Checkout Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="card" style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Shipping Information</h2>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label className="label">Full Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Address</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="label">City</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Postal Code</label>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.postalCode}
                                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Country</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="input"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Payment Method</h2>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'].map((method) => (
                                    <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: formData.paymentMethod === method ? 'var(--background)' : 'white' }}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method}
                                            checked={formData.paymentMethod === method}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                        <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                                            {method.replace('_', ' ')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </form>

                    {/* Order Summary */}
                    <div>
                        <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Order Summary</h2>

                            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                                {items.map((item) => (
                                    <div key={item.productId} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ width: '60px', height: '60px', background: 'var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                            {item.image ? (
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                                    📦
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>Qty: {item.quantity}</p>
                                        </div>
                                        <p style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-light)' }}>Subtotal:</span>
                                    <span style={{ fontWeight: '600' }}>${total.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-light)' }}>Shipping:</span>
                                    <span style={{ fontWeight: '600' }}>FREE</span>
                                </div>
                            </div>

                            <div style={{ borderTop: '2px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Total:</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="btn btn-success"
                                    disabled={loading}
                                    style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', background: 'var(--success-gradient)', color: 'white' }}
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
