'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Package, X, Search } from 'lucide-react';
import Link from 'next/link';

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

export default function AdminProductsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: ''
    });

    useEffect(() => {
        if (!user) {
            router.push('/signin');
            return;
        }
        if (!user.isAdmin) {
            router.push('/');
            return;
        }
        fetchProducts();
    }, [user, router]);

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

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                image: product.image,
                category: product.category,
                stock: product.stock.toString()
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                image: '',
                category: '',
                stock: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            image: '',
            category: '',
            stock: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock)
        };

        try {
            const url = editingProduct 
                ? `/api/products/${editingProduct.id}`
                : '/api/products';
            
            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (res.ok) {
                await fetchProducts();
                handleCloseModal();
                alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('Product deleted successfully!');
                fetchProducts();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Products Management
                        </h1>
                        <Link href="/admin" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                            ← Back to Dashboard
                        </Link>
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', maxWidth: '400px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input"
                            style={{ paddingLeft: '3rem' }}
                        />
                    </div>
                </div>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--background)', borderBottom: '2px solid var(--border)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Product</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Category</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Price</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Stock</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Rating</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{product.name}</div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                                    {product.description.substring(0, 50)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ background: 'var(--primary-gradient)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--primary)' }}>
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ color: product.stock > 10 ? 'var(--success)' : product.stock > 0 ? 'var(--warning)' : 'var(--error)' }}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        ⭐ {product.rating || 'N/A'} ({product.reviews || 0})
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                                                onClick={() => handleOpenModal(product)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="btn"
                                                style={{ padding: '0.5rem', fontSize: '0.875rem', background: 'var(--error)', color: 'white' }}
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                        No products found
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'rgba(0, 0, 0, 0.5)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 100,
                    padding: '1rem'
                }}>
                    <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label className="label">Product Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Description</label>
                                    <textarea
                                        className="input"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="label">Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="input"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Stock</label>
                                        <input
                                            type="number"
                                            className="input"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Category</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Image URL</label>
                                    <input
                                        type="url"
                                        className="input"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        required
                                    />
                                    {formData.image && (
                                        <div style={{ marginTop: '0.5rem', width: '100px', height: '100px', background: 'var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                            <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                    <button type="button" onClick={handleCloseModal} className="btn btn-secondary" style={{ flex: 1 }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
