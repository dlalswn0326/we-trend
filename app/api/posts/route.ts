import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter'); // 'likes', 'bookmarks', 'user'
        const userId = searchParams.get('userId');
        const q = searchParams.get('q'); // Search query

        let whereClause: any = {};

        // Handle filter types that require specific logic
        if (filter && userId) {
            if (filter === 'likes') {
                whereClause.interactions = {
                    some: {
                        userId: userId,
                        type: 'LIKE'
                    }
                };
            } else if (filter === 'bookmarks') {
                whereClause.interactions = {
                    some: {
                        userId: userId,
                        type: 'BOOKMARK'
                    }
                };
            } else if (filter === 'user') {
                whereClause.authorId = userId;
            }
            // For invalid or no filter, no additional where conditions
        }

        // Add search condition if query provided
        if (q) {
            whereClause.OR = [
                { content: { contains: q } },
                { tags: { contains: q } },
                { title: { contains: q } },
            ];
        }

        // Query posts with built where clause
        const posts = await prisma.post.findMany({
            where: whereClause,
            include: {
                author: true,
                interactions: true,
                comments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Transform data for frontend
        const formattedPosts = posts.map(post => ({
            id: post.id,
            author: {
                name: post.author?.name || 'Anonymous',
                username: post.author?.name || post.author?.email?.split('@')[0] || 'user',
                image: post.author?.profileImage || post.author?.image,
            },
            content: post.content,
            images: post.images, // Add images field
            createdAt: post.createdAt,
            sourceUrl: post.sourceUrl,
            sourceTitle: post.title,
            tags: post.tags ? post.tags.split(',') : [],
            stats: {
                likes: post.interactions.filter(i => i.type === 'LIKE').length,
                comments: post.comments.length,
            },
        }));

        return NextResponse.json(formattedPosts);
    } catch (error: any) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, images, authorId } = body; // Add images

        // For MVP, create a dummy user if no authorId provided
        let finalAuthorId = authorId;
        if (!finalAuthorId) {
            const user = await prisma.user.upsert({
                where: { email: 'user@example.com' },
                update: {},
                create: {
                    email: 'user@example.com',
                    name: 'Demo User',
                },
            });
            finalAuthorId = user.id;
        }

        const post = await prisma.post.create({
            data: {
                content,
                images: images || null, // Save images
                authorId: finalAuthorId,
            },
        });

        return NextResponse.json(post);
    } catch (error: any) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post', details: error.message },
            { status: 500 }
        );
    }
}
