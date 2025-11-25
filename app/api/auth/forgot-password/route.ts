import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateRandomToken } from '@/lib/auth';
import { sendEmail, getPasswordResetEmailTemplate } from '@/lib/email';
import { forgotPasswordSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = forgotPasswordSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email } = validation.data;

        // Find user
        const user = await db.getUserByEmail(email);
        if (!user) {
            // Don't reveal if email exists or not for security
            return NextResponse.json({
                message: 'If your email is registered, you will receive a password reset link.',
            });
        }

        // Generate reset token (expires in 1 hour)
        const resetToken = generateRandomToken();
        const resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour from now

        // Update user with reset token
        await db.updateUser(user.id, {
            resetToken,
            resetTokenExpiry,
        });

        // Send reset email
        const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        await sendEmail({
            to: email,
            subject: 'Reset Your Password',
            html: getPasswordResetEmailTemplate(user.name || email, resetUrl),
        });

        return NextResponse.json({
            message: 'If your email is registered, you will receive a password reset link.',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing your request' },
            { status: 500 }
        );
    }
}
