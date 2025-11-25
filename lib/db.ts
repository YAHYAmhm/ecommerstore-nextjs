import fs from 'fs';
import path from 'path';

// Data directory path
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// User interface
export interface User {
    id: string;
    email: string;
    password: string; // hashed
    name?: string;
    isVerified: boolean;
    verificationToken?: string;
    resetToken?: string;
    resetTokenExpiry?: number;
    createdAt: string;
    isAdmin?: boolean;
}

// Product interface
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    images?: string[];
    stock: number;
    rating?: number;
    reviews?: number;
    createdAt: string;
}

// Order interface
export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    createdAt: string;
}

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface ShippingAddress {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
}

// Database operations
class Database {
    private getUsersPath() {
        return path.join(DATA_DIR, 'users.json');
    }

    private getProductsPath() {
        return path.join(DATA_DIR, 'products.json');
    }

    private getOrdersPath() {
        return path.join(DATA_DIR, 'orders.json');
    }

    // Initialize files if they don't exist
    private initializeFile(filePath: string, defaultData: any) {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
        }
    }

    // User operations
    async getUsers(): Promise<User[]> {
        this.initializeFile(this.getUsersPath(), []);
        const data = fs.readFileSync(this.getUsersPath(), 'utf-8');
        return JSON.parse(data);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const users = await this.getUsers();
        return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }

    async getUserById(id: string): Promise<User | null> {
        const users = await this.getUsers();
        return users.find(u => u.id === id) || null;
    }

    async createUser(user: User): Promise<User> {
        const users = await this.getUsers();
        users.push(user);
        fs.writeFileSync(this.getUsersPath(), JSON.stringify(users, null, 2));
        return user;
    }

    async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
        const users = await this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return null;

        users[index] = { ...users[index], ...updates };
        fs.writeFileSync(this.getUsersPath(), JSON.stringify(users, null, 2));
        return users[index];
    }

    // Product operations
    async getProducts(filters?: { category?: string; search?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
        this.initializeFile(this.getProductsPath(), []);
        const data = fs.readFileSync(this.getProductsPath(), 'utf-8');
        let products: Product[] = JSON.parse(data);

        if (filters) {
            if (filters.category) {
                products = products.filter(p => p.category === filters.category);
            }
            if (filters.search) {
                const search = filters.search.toLowerCase();
                products = products.filter(p =>
                    p.name.toLowerCase().includes(search) ||
                    p.description.toLowerCase().includes(search)
                );
            }
            if (filters.minPrice !== undefined) {
                products = products.filter(p => p.price >= filters.minPrice!);
            }
            if (filters.maxPrice !== undefined) {
                products = products.filter(p => p.price <= filters.maxPrice!);
            }
        }

        return products;
    }

    async getProductById(id: string): Promise<Product | null> {
        const products = await this.getProducts();
        return products.find(p => p.id === id) || null;
    }

    async createProduct(product: Product): Promise<Product> {
        const products = await this.getProducts();
        products.push(product);
        fs.writeFileSync(this.getProductsPath(), JSON.stringify(products, null, 2));
        return product;
    }

    async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;

        products[index] = { ...products[index], ...updates };
        fs.writeFileSync(this.getProductsPath(), JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id: string): Promise<boolean> {
        const products = await this.getProducts();
        const filtered = products.filter(p => p.id !== id);
        if (filtered.length === products.length) return false;

        fs.writeFileSync(this.getProductsPath(), JSON.stringify(filtered, null, 2));
        return true;
    }

    // Order operations
    async getOrders(userId?: string): Promise<Order[]> {
        this.initializeFile(this.getOrdersPath(), []);
        const data = fs.readFileSync(this.getOrdersPath(), 'utf-8');
        let orders: Order[] = JSON.parse(data);

        if (userId) {
            orders = orders.filter(o => o.userId === userId);
        }

        return orders;
    }

    async getOrderById(id: string): Promise<Order | null> {
        const orders = await this.getOrders();
        return orders.find(o => o.id === id) || null;
    }

    async createOrder(order: Order): Promise<Order> {
        const orders = await this.getOrders();
        orders.push(order);
        fs.writeFileSync(this.getOrdersPath(), JSON.stringify(orders, null, 2));
        return order;
    }

    async updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
        const orders = await this.getOrders();
        const index = orders.findIndex(o => o.id === id);
        if (index === -1) return null;

        orders[index] = { ...orders[index], ...updates };
        fs.writeFileSync(this.getOrdersPath(), JSON.stringify(orders, null, 2));
        return orders[index];
    }
}

export const db = new Database();
