import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: true,
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error: any) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post', details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { content, images } = body;

        const post = await prisma.post.update({
            where: { id },
            data: {
                content,
                images: images || null,
            },
        });

        return NextResponse.json(post);
    } catch (error: any) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Failed to update post', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Delete associated interactions and comments first
        await prisma.interaction.deleteMany({
            where: { postId: id }
        });

        await prisma.comment.deleteMany({
            where: { postId: id }
        });

        // Delete the post
        await prisma.post.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Failed to delete post', details: error.message },
            { status: 500 }
        );
    }
}
