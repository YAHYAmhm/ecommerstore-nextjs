import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await clearAuthCookie();

        return NextResponse.json({
            message: 'Signed out successfully',
        });
    } catch (error) {
        console.error('Signout error:', error);
        return NextResponse.json(
            { error: 'An error occurred during signout' },
            { status: 500 }
        );
    }
}
