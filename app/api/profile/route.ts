import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This route is deprecated - AuthProvider now handles user management
// Keeping for backward compatibility but should not be used

export async function GET() {
    try {
        return NextResponse.json({ error: 'Use AuthProvider instead' }, { status: 410 });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { name, bio, profileImage, userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                profileImage,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
