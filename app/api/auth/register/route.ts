import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, anonymousUserId } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password required' },
                { status: 400 }
            );
        }

        const bcrypt = require('bcrypt');

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser && !existingUser.isAnonymous) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let user;

        if (anonymousUserId) {
            // Convert anonymous user to registered user
            user = await prisma.user.update({
                where: { id: anonymousUserId },
                data: {
                    email,
                    password: hashedPassword,
                    name: name || undefined,
                    isAnonymous: false,
                },
            });
        } else {
            // Create new registered user
            user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: name || email.split('@')[0],
                    isAnonymous: false,
                    profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                },
            });
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Failed to register', details: error.message },
            { status: 500 }
        );
    }
}
