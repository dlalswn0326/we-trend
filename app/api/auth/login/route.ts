import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRandomNickname } from '@/lib/nickname-generator';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { createAnonymous } = body;

        if (createAnonymous) {
            // Create a new anonymous user
            const nickname = generateRandomNickname();
            const user = await prisma.user.create({
                data: {
                    name: nickname,
                    isAnonymous: true,
                    profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${nickname}`,
                },
            });

            return NextResponse.json(user);
        }

        // For regular login (with password)
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password required' },
                { status: 400 }
            );
        }

        const bcrypt = require('bcrypt');

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Failed to login', details: error.message },
            { status: 500 }
        );
    }
}
