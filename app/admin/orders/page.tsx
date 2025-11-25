'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import Link from 'next/link';

interface Order {
    id: string;
    userId: string;
    items: any[];
    total: number;
    status: string;
    shippingAddress: any;
    paymentMethod: string;
    createdAt: string;
}

export default function AdminOrdersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/signin');
            return;
        }
        if (!user.isAdmin) {
            router.push('/');
            return;
        }
        fetchOrders();
    }, [user, router]);

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

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                alert('Order status updated!');
                fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock size={20} color="var(--warning)" />;
            case 'processing': return <Package size={20} color="var(--primary)" />;
            case 'shipped': return <Truck size={20} color="var(--primary)" />;
            case 'delivered': return <CheckCircle size={20} color="var(--success)" />;
            case 'cancelled': return <XCircle size={20} color="var(--error)" />;
            default: return <Clock size={20} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'var(--warning)';
            case 'processing': return 'var(--primary)';
            case 'shipped': return 'var(--primary)';
            case 'delivered': return 'var(--success)';
            case 'cancelled': return 'var(--error)';
            default: return 'var(--text-light)';
        }
    };

    if (loading) {
        return (
            <div className="page-with-navbar">
                <Navbar />
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-with-navbar">
            <Navbar />

            <div className="container" style={{ padding: '2rem 0' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Orders Management
                    </h1>
                    <Link href="/admin" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            {orders.length}
                        </div>
                        <div style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Total Orders</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                            {orders.filter(o => o.status === 'pending').length}
                        </div>
                        <div style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Pending</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚚</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            {orders.filter(o => o.status === 'shipped').length}
                        </div>
                        <div style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Shipped</div>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                            {orders.filter(o => o.status === 'delivered').length}
                        </div>
                        <div style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Delivered</div>
                    </div>
                </div>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--background)', borderBottom: '2px solid var(--border)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Order ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Customer</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Items</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Total</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                        {order.id.substring(0, 20)}...
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600' }}>{order.shippingAddress.fullName}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                            {order.shippingAddress.city}, {order.shippingAddress.country}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--primary)' }}>
                                        ${order.total.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: getStatusColor(order.status) }}>
                                            {getStatusIcon(order.status)}
                                            <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{order.status}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            className="input"
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>
                        <Package size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <p>No orders yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
