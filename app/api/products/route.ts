import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { productSchema } from '@/lib/validation';

// GET all products with optional filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || undefined;
        const search = searchParams.get('search') || undefined;
        const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
        const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

        const products = await db.getProducts({ category, search, minPrice, maxPrice });

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Get products error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching products' },
            { status: 500 }
        );
    }
}

// POST - Create new product (admin only)
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user || !user.isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 403 }
            );
        }

        const body = await request.json();

        const validation = productSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const product = await db.createProduct({
            id: `product-${Date.now()}`,
            ...validation.data,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Create product error:', error);
        return NextResponse.json(
            { error: 'An error occurred while creating product' },
            { status: 500 }
        );
    }
}
