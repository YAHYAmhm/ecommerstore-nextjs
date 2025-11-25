'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';
import { Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [stats, setStats] = useState({
        orders: 0,
        products: 0,
        users: 0,
        revenue: 0
    });
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
        fetchStats();
    }, [user, router]);

    const fetchStats = async () => {
        try {
            const resOrders = await fetch('/api/orders');
            const dataOrders = await resOrders.json();

            const resProducts = await fetch('/api/products');
            const dataProducts = await resProducts.json();

            if (dataOrders.orders && dataProducts.products) {
                const totalRevenue = dataOrders.orders.reduce((sum: number, order: any) => sum + order.total, 0);

                setStats({
                    orders: dataOrders.orders.length,
                    products: dataProducts.products.length,
                    users: 2,
                    revenue: totalRevenue
                });
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user || !user.isAdmin) return null;

    return (
        <div className="page-with-navbar">
            <Navbar />

            <div className="container" style={{ padding: '2rem 0' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Admin Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-light)' }}>Welcome back, {user?.name}!</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
                    <Link href="/admin/products" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-lg)', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                                📦
                            </div>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Products</div>
                                <div style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Manage inventory</div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/orders" className="card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-lg)', background: 'var(--secondary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                                🛒
                            </div>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Orders</div>
                                <div style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Process orders</div>
                            </div>
                        </div>
                    </Link>

                    <div className="card" style={{ opacity: 0.6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-lg)', background: 'var(--success-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                                👥
                            </div>
                            <div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Users</div>
                                <div style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Coming soon</div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </div>
                ) : (
                    <>
                        {/* Statistics */}
                        <div className="grid grid-cols-4" style={{ marginBottom: '3rem' }}>
                            <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500' }}>Total Revenue</h3>
                                    <TrendingUp size={24} />
                                </div>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>${stats.revenue.toFixed(2)}</p>
                            </div>

                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: 'var(--text-light)' }}>Orders</h3>
                                    <Package size={24} color="var(--primary)" />
                                </div>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.orders}</p>
                            </div>

                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: 'var(--text-light)' }}>Products</h3>
                                    <ShoppingBag size={24} color="var(--success)" />
                                </div>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.products}</p>
                            </div>

                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: 'var(--text-light)' }}>Users</h3>
                                    <Users size={24} color="var(--warning)" />
                                </div>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.users}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
