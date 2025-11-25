import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateRandomToken } from '@/lib/auth';
import { sendEmail, getVerificationEmailTemplate } from '@/lib/email';
import { signUpSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = signUpSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email, password, name } = validation.data;

        // Check if user already exists
        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password and generate verification token
        const hashedPassword = await hashPassword(password);
        const verificationToken = generateRandomToken();

        // Create user
        const user = await db.createUser({
            id: `user-${Date.now()}`,
            email,
            password: hashedPassword,
            name,
            isVerified: false,
            verificationToken,
            createdAt: new Date().toISOString(),
        });

        // Send verification email
        const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        await sendEmail({
            to: email,
            subject: 'Verify Your Email Address',
            html: getVerificationEmailTemplate(name || email, verificationUrl),
        });

        return NextResponse.json({
            message: 'Account created successfully. Please check your email to verify your account.',
            userId: user.id,
        });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'An error occurred during signup' },
            { status: 500 }
        );
    }
}
