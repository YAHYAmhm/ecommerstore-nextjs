import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { resetPasswordSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = resetPasswordSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { token, password } = validation.data;

        // Find user with this reset token
        const users = await db.getUsers();
        const user = users.find(u => u.resetToken === token);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Check if token has expired
        if (user.resetTokenExpiry && user.resetTokenExpiry < Date.now()) {
            return NextResponse.json(
                { error: 'Reset token has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update user password and clear reset token
        await db.updateUser(user.id, {
            password: hashedPassword,
            resetToken: undefined,
            resetTokenExpiry: undefined,
        });

        return NextResponse.json({
            message: 'Password reset successfully. You can now sign in with your new password.',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'An error occurred while resetting your password' },
            { status: 500 }
        );
    }
}
