'use client';

import Link from 'next/link';
import { useCart } from '@/lib/useCart';
import { useLanguage } from '@/lib/providers';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    rating?: number;
    reviews?: number;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const { t } = useLanguage();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
        });
    };

    return (
        <div className="card" style={{ 
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}>
            <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    background: 'var(--border)',
                    overflow: 'hidden'
                }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ 
                        fontWeight: '600', 
                        fontSize: '1.125rem', 
                        marginBottom: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {product.name}
                    </h3>
                    
                    {product.rating && (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} style={{ 
                                        color: i < Math.floor(product.rating!) ? '#feca57' : '#ddd',
                                        fontSize: '1rem'
                                    }}>
                                        ★
                                    </span>
                                ))}
                            </div>
                            {product.reviews && (
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                    ({product.reviews})
                                </span>
                            )}
                        </div>
                    )}
                    
                    <div style={{ 
                        fontSize: '1.75rem', 
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '1rem'
                    }}>
                        ${product.price.toFixed(2)}
                    </div>
                    
                    <button 
                        onClick={handleAddToCart}
                        className="btn btn-primary"
                        style={{ width: '100%', fontWeight: '600' }}
                    >
                        🛒 {t('product.add')}
                    </button>
                </div>
            </Link>
        </div>
    );
}
