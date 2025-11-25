'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/lib/providers';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    rating?: number;
    reviews?: number;
    createdAt: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    // Filters
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterAndSortProducts();
    }, [products, search, category, priceRange, sortBy]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortProducts = () => {
        let result = [...products];

        // Search
        if (search) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        // Category
        if (category) {
            result = result.filter(p => p.category === category);
        }

        // Price Range
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Sorting
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
        }

        setFilteredProducts(result);
    };

    const categories = ['All', 'Electronics', 'Home & Office', 'Sports & Fitness', 'Home & Decor', 'Accessories'];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />

            <div className="container" style={{ padding: '2rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                        {t('nav.products')}
                    </h1>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <SlidersHorizontal size={20} />
                        Filters
                    </button>
                </div>

                {/* Filters Section */}
                {showFilters && (
                    <div className="card animate-fade-in" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        {/* Search */}
                        <div>
                            <label className="label">{t('search.placeholder')}</label>
                            <input
                                type="text"
                                className="input"
                                placeholder={t('search.placeholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="label">Category</label>
                            <select
                                className="input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value === 'All' ? '' : e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="label">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                step="10"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                style={{ width: '100%' }}
                            />
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="label">Sort By</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    className="input"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                                <ArrowUpDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-light)' }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)' }}>No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
