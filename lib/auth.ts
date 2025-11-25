import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';

export interface TokenPayload {
    userId: string;
    email: string;
    isAdmin?: boolean;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
}

// Verify JWT token
export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
}

// Generate random token for email verification and password reset
export function generateRandomToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Get current user from cookies
export async function getCurrentUser(): Promise<TokenPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) return null;

    return verifyToken(token);
}

// Set auth cookie
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

// Clear auth cookie
export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
}
