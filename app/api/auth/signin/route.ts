import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { signInSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = signInSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        // Find user
        const user = await db.getUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if email is verified
        if (!user.isVerified) {
            return NextResponse.json(
                { error: 'Please verify your email before signing in' },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        });

        // Set cookie
        await setAuthCookie(token);

        return NextResponse.json({
            message: 'Signed in successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        console.error('Signin error:', error);
        return NextResponse.json(
            { error: 'An error occurred during signin' },
            { status: 500 }
        );
    }
}
