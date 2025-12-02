// Usage examples for Supabase anon key connection
// This file demonstrates how to use Supabase client for anonymous data access

import { supabase } from './supabase';

// Example 1: Fetch posts anonymously (client-side)
export const fetchPostsWithSupabase = async () => {
    const { data, error } = await supabase
        .from('Post')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return null;
    }

    return data;
};

// Example 2: Create a comment (requires authentication or RLS setup)
export const createCommentWithSupabase = async (postId: string, content: string) => {
    const { data, error } = await supabase
        .from('Comment')
        .insert([
            { postId, content, userId: 'anonymous' } // Note: This might require auth setup
        ])
        .select();

    if (error) {
        console.error('Error creating comment:', error);
        return null;
    }

    return data;
};

// Example 3: Subscribe to real-time updates
export const subscribeToPosts = (callback: (payload: any) => void) => {
    const subscription = supabase
        .channel('posts')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'Post' },
            callback
        )
        .subscribe();

    return subscription;
};

// Note: To use these functions safely, ensure Row Level Security (RLS)
// is properly configured in your Supabase dashboard for anonymous access.
// Alternatively, use server-side API routes for authenticated operations.
