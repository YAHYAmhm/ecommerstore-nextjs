'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/lib/useCart';
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    rating?: number;
    reviews?: number;
}

export default function ProductDetailPage() {
    const params = useParams();
    const { addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string);
        }
    }, [params.id]);

    const fetchProduct = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            if (res.ok) {
                setProduct(data.product);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
        });

        alert('Added to cart!');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '80px' }}>
                <Navbar />
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '80px' }}>
                <Navbar />
                <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                    <h1>Product not found</h1>
                    <Link href="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '80px' }}>
            <Navbar />

            <div className="container" style={{ padding: '2rem 0' }}>
                <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', textDecoration: 'none', marginBottom: '2rem' }}>
                    <ArrowLeft size={20} /> Back to Products
                </Link>

                <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', padding: '2rem' }}>
                    {/* Product Image */}
                    <div style={{ background: 'var(--background)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: '400px' }}>
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    {/* Product Info */}
                    <div>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ background: 'var(--primary-gradient)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', fontWeight: '500' }}>
                                {product.category}
                            </span>
                        </div>

                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{product.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Star size={20} fill="var(--warning)" color="var(--warning)" />
                                <span style={{ fontWeight: '600' }}>{product.rating || 4.5}</span>
                            </div>
                            <span style={{ color: 'var(--text-light)' }}>•</span>
                            <span style={{ color: 'var(--text-light)' }}>{product.reviews || 0} reviews</span>
                            <span style={{ color: 'var(--text-light)' }}>•</span>
                            <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--error)', fontWeight: '500' }}>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        <p style={{ fontSize: '1.125rem', color: 'var(--text-light)', lineHeight: '1.8', marginBottom: '2rem' }}>
                            {product.description}
                        </p>

                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '2rem' }}>
                            ${product.price.toFixed(2)}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text)' }}
                                >
                                    -
                                </button>
                                <span style={{ padding: '0 1rem', fontWeight: '600', fontSize: '1.125rem' }}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text)' }}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary"
                                style={{ flex: 1, fontSize: '1.125rem', justifyContent: 'center' }}
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart size={24} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
