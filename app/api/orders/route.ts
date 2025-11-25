import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { checkoutSchema } from '@/lib/validation';

// GET user's orders
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const orders = user.isAdmin
            ? await db.getOrders() // Admin sees all orders
            : await db.getOrders(user.userId); // User sees only their orders

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Get orders error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching orders' },
            { status: 500 }
        );
    }
}

// POST - Create order from cart
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const validation = checkoutSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { shippingAddress, paymentMethod } = validation.data;
        const { items } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: 'Cart is empty' },
                { status: 400 }
            );
        }

        // Calculate total
        const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

        const order = await db.createOrder({
            id: `order-${Date.now()}`,
            userId: user.userId,
            items,
            total,
            status: 'pending',
            shippingAddress,
            paymentMethod,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({
            order,
            message: 'Order placed successfully!'
        });
    } catch (error) {
        console.error('Create order error:', error);
        return NextResponse.json(
            { error: 'An error occurred while creating order' },
            { status: 500 }
        );
    }
}
