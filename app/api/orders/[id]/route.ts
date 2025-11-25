import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET single order
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const order = await db.getOrderById(id);

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Check if user owns this order or is admin
        if (order.userId !== user.userId && !user.isAdmin) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching order' },
            { status: 500 }
        );
    }
}

// PUT - Update order status (admin only)
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
        const { status } = body;

        if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid order status' },
                { status: 400 }
            );
        }

        const order = await db.updateOrder(id, { status });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating order' },
            { status: 500 }
        );
    }
}
