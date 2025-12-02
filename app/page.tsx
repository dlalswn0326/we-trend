'use client';

// Trigger deployment
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PostCard from '@/components/ui/PostCard';
import InlinePostComposer from '@/components/ui/InlinePostComposer';
import axios from 'axios';

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    image?: string;
  };
  content: string;
  createdAt: string;
  sourceUrl?: string;
  sourceTitle?: string;
  tags?: string[];
  stats: {
    likes: number;
    comments: number;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <MainLayout>
      <div className="divide-y divide-gray-100">
        {/* Inline Post Composer */}
        <InlinePostComposer onPostCreated={fetchPosts} />

        {/* Posts Feed */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">로딩 중...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!</div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              {...post}
              createdAt={new Date(post.createdAt)}
            />
          ))
        )}
      </div>
    </MainLayout>
  );
}
