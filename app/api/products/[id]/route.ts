import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await db.getProductById(id);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching product' },
            { status: 500 }
        );
    }
}

// PUT - Update product (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user || !user.isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        const product = await db.updateProduct(id, body);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating product' },
            { status: 500 }
        );
    }
}

// DELETE product (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user || !user.isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access required.' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const deleted = await db.deleteProduct(id);

        if (!deleted) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json(
            { error: 'An error occurred while deleting product' },
            { status: 500 }
        );
    }
}
