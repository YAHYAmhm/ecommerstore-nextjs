import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'users.json');
        const file = readFileSync(filePath, 'utf-8');
        const users = JSON.parse(file);
        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error reading users:', error);
        return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
    }
}
