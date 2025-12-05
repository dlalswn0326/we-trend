import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

        // Build Supabase query
        let query = supabase
            .from('Post')
            .select(`
                id,
                content,
                images,
                createdAt,
                sourceUrl,
                title,
                tags,
                authorId,
                author:User (
                    name,
                    email,
                    profileImage,
                    image
                ),
                interactions:Interaction (
                    type
                ),
                comments:Comment (
                    id
                )
            `)
            .order('createdAt', { ascending: false });

        // Apply where conditions
        if (filter && userId) {
            if (filter === 'likes') {
                query = query.eq('interactions.type', 'LIKE').eq('interactions.userId', userId);
            } else if (filter === 'bookmarks') {
                query = query.eq('interactions.type', 'BOOKMARK').eq('interactions.userId', userId);
            } else if (filter === 'user') {
                query = query.eq('authorId', userId);
            }
        }

        if (q) {
            query = query.or(`content.ilike.%${q}%,title.ilike.%${q}%,tags.ilike.%${q}%`);
        }

        const { data: posts, error } = await query;

        if (error) {
            throw error;
        }

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
            const { data: existingUser, error: userError } = await supabase
                .from('User')
                .select('id')
                .eq('email', 'user@example.com')
                .single();

            if (!existingUser) {
                const { data: newUser, error: createError } = await supabase
                    .from('User')
                    .insert({
                        email: 'user@example.com',
                        name: 'Demo User',
                    })
                    .select('id')
                    .single();

                if (createError) throw createError;
                finalAuthorId = newUser.id;
            } else {
                finalAuthorId = existingUser.id;
            }
        }

        const { data: post, error } = await supabase
            .from('Post')
            .insert({
                id: crypto.randomUUID(),
                content,
                images: images || null,
                authorId: finalAuthorId,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(post);
    } catch (error: any) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post', details: error.message },
            { status: 500 }
        );
    }
}
