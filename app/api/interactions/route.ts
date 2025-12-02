import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { postId, userId, type } = body;

        if (!postId || !userId || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: postId, userId, type' },
                { status: 400 }
            );
        }

        if (type !== 'LIKE' && type !== 'BOOKMARK') {
            return NextResponse.json(
                { error: 'Invalid type. Must be LIKE or BOOKMARK' },
                { status: 400 }
            );
        }

        // Check if interaction already exists
        const existingInteraction = await prisma.interaction.findUnique({
            where: {
                userId_postId_type: {
                    userId,
                    postId,
                    type
                }
            }
        });

        if (existingInteraction) {
            // Delete existing interaction (toggle off)
            await prisma.interaction.delete({
                where: {
                    id: existingInteraction.id
                }
            });

            return NextResponse.json({
                success: true,
                action: 'removed',
                type
            });
        } else {
            // Create new interaction (toggle on)
            const interaction = await prisma.interaction.create({
                data: {
                    userId,
                    postId,
                    type
                }
            });

            return NextResponse.json({
                success: true,
                action: 'added',
                type,
                interaction
            });
        }
    } catch (error: any) {
        console.error('Interaction error:', error);
        return NextResponse.json(
            { error: 'Failed to process interaction', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const postId = searchParams.get('postId');
        const type = searchParams.get('type');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        const where: any = { userId };
        if (postId) where.postId = postId;
        if (type) where.type = type;

        const interactions = await prisma.interaction.findMany({
            where
        });

        return NextResponse.json(interactions);
    } catch (error: any) {
        console.error('Get interactions error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch interactions', details: error.message },
            { status: 500 }
        );
    }
}
