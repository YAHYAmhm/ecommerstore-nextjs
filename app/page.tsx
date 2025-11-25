'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import './globals.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products.slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-with-navbar">
      <Navbar />

      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '6rem 2rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ 
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1.5rem',
              borderRadius: '50px',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              ✨ New Collection Available
            </div>
            
            <h1 style={{ 
              fontSize: '4rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              Discover Amazing Products
            </h1>
            
            <p style={{ 
              fontSize: '1.5rem', 
              marginBottom: '2rem',
              opacity: 0.95
            }}>
              Shop the latest trends at unbeatable prices
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/products">
                <button className="btn btn-primary" style={{ 
                  background: 'white',
                  color: '#667eea',
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: 'bold'
                }}>
                  Shop Now →
                </button>
              </Link>
              <Link href="/products">
                <button className="btn" style={{ 
                  background: 'transparent',
                  border: '2px solid white',
                  color: 'white',
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: 'bold'
                }}>
                  View Collections
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '2rem' 
        }}>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              📈
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Premium Quality
            </h3>
            <p style={{ color: 'var(--text-light)' }}>
              Carefully curated products from trusted brands
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 1.5rem',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              🛡️
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Secure Shopping
            </h3>
            <p style={{ color: 'var(--text-light)' }}>
              Your data is protected with industry-leading security
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 1.5rem',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              🚚
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Fast Delivery
            </h3>
            <p style={{ color: 'var(--text-light)' }}>
              Quick and reliable shipping to your doorstep
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            ⭐ Trending Products
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '1.125rem' }}>
            Discover our most popular items
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link href="/products">
                <button className="btn btn-primary" style={{ 
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem'
                }}>
                  View All Products →
                </button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '3rem 0',
        marginTop: '4rem'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              E-Store
            </h3>
            <p style={{ opacity: 0.9, marginBottom: '1rem' }}>
              Your trusted online shopping destination
            </p>
            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              © 2024 E-commerce Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
