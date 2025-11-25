'use client';

import Navbar from '@/components/Navbar';
import { useCart } from '@/lib/useCart';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import '../globals.css';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
    const total = getTotal();

    if (items.length === 0) {
        return (
            <div className="page-with-navbar">
                <Navbar />
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h1>
                    <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Start shopping to add items to your cart</p>
                    <Link href="/products" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-with-navbar">
            <Navbar />

            <div className="container" style={{ padding: '2rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Shopping Cart</h1>
                    <button onClick={clearCart} className="btn btn-outline" style={{ color: 'var(--error)', borderColor: 'var(--error)' }}>
                        Clear Cart
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Cart Items */}
                    <div>
                        {items.map((item) => (
                            <div key={item.productId} className="card" style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '100px', height: '100px', background: 'var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                        {item.image ? (
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: '2rem' }}>📦</span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{item.name}</h3>
                                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>${item.price.toFixed(2)}</p>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.5rem' }}>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>

                                        <button onClick={() => removeItem(item.productId)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div>
                        <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Order Summary</h2>

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

                                <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}>
                                    Proceed to Checkout
                                </Link>
                            </div>

                            <Link href="/products" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600', fontSize: '0.875rem' }}>
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
