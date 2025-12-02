import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractKeywords } from '@/lib/ai';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.trim();

        // If no query, return trending/popular keywords
        if (!query) {
            // Get recent posts and extract keywords
            const recentPosts = await prisma.post.findMany({
                take: 50,
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    content: true,
                },
            });

            const texts = recentPosts.map(post => post.content);
            const keywords = await extractKeywords(texts);
            return NextResponse.json(keywords);
        }

        // For query-based suggestions, filter posts that contain the query
        const relevantPosts = await prisma.post.findMany({
            where: {
                OR: [
                    { content: { contains: query } },
                    { tags: { contains: query } },
                    { title: { contains: query } },
                ],
            },
            take: 20,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                content: true,
            },
        });

        if (relevantPosts.length === 0) {
            // Fallback to general keywords if no relevant posts
            const generalPosts = await prisma.post.findMany({
                take: 20,
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    content: true,
                },
            });

            const texts = generalPosts.map(post => post.content);
            const keywords = await extractKeywords(texts, query);
            return NextResponse.json(keywords);
        }

        const texts = relevantPosts.map(post => post.content);
        const keywords = await extractKeywords(texts, query);

        // Filter keywords that contain the query (for autocomplete feel)
        const filteredKeywords = keywords.filter(keyword =>
            keyword.toLowerCase().includes(query.toLowerCase()) ||
            keyword.toLowerCase().includes(query.toLowerCase().slice(0, -1)) // partial match
        );

        return NextResponse.json(filteredKeywords.length > 0 ? filteredKeywords : keywords.slice(0, 5));
    } catch (error: any) {
        console.error('Error fetching suggestions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch suggestions', details: error.message },
            { status: 500 }
        );
    }
}
