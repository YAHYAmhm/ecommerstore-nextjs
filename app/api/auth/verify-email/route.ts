import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Verification token is required' },
                { status: 400 }
            );
        }

        // Find user with this verification token
        const users = await db.getUsers();
        const user = users.find(u => u.verificationToken === token);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        if (user.isVerified) {
            return NextResponse.json({
                message: 'Email already verified. You can sign in now.',
            });
        }

        // Update user verification status
        await db.updateUser(user.id, {
            isVerified: true,
            verificationToken: undefined,
        });

        return NextResponse.json({
            message: 'Email verified successfully! You can now sign in.',
        });
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { error: 'An error occurred during email verification' },
            { status: 500 }
        );
    }
}
