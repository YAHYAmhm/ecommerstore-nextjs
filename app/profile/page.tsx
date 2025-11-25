'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/useAuth';
import { Package } from 'lucide-react';
import '../globals.css';

interface Order {
    id: string;
    items: any[];
    total: number;
    status: string;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/signin');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />

            <div className="container" style={{ padding: '2rem 0' }}>
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>My Profile</h1>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <p><strong>Email:</strong> {user.email}</p>
                        {user.name && <p><strong>Name:</strong> {user.name}</p>}
                        {user.isAdmin && (
                            <p style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ Admin User</p>
                        )}
                    </div>
                    <button onClick={signOut} className="btn btn-outline" style={{ marginTop: '1.5rem', color: 'var(--error)', borderColor: 'var(--error)' }}>
                        Sign Out
                    </button>
                </div>

                <div className="card">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Order History</h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className="spinner" style={{ margin: '0 auto' }}></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p style={{ color: 'var(--text-light)' }}>No orders yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {orders.map((order) => (
                                <div key={order.id} style={{ padding: '1rem', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>Order #{order.id}</span>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.875rem',
                                            background: order.status === 'delivered' ? 'var(--success)' : 'var(--warning)',
                                            color: 'white'
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        ${order.total.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
