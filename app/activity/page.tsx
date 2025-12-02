'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PostCard from '@/components/ui/PostCard';
import { useAuth } from '@/components/providers/AuthProvider';
import axios from 'axios';

type TabType = 'bookmarks' | 'likes' | 'posts';

export default function ActivityPage() {
    const [activeTab, setActiveTab] = useState<TabType>('likes');
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && currentUser) {
            fetchPosts();
        }
    }, [activeTab, currentUser, authLoading]);


    const fetchPosts = async () => {
        setLoading(true);
        try {
            if (!currentUser?.id) {
                setPosts([]);
                setLoading(false);
                return;
            }

            // Build API URL with filter parameters
            const filterMap = {
                'likes': 'likes',
                'bookmarks': 'bookmarks',
                'posts': 'user'
            };

            const filterType = filterMap[activeTab];
            const response = await axios.get(`/api/posts?filter=${filterType}&userId=${currentUser.id}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div>
                {/* Header */}
                <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
                    <h1 className="font-bold text-xl px-4 py-3">활동</h1>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('likes')}
                            className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'likes'
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-500 hover:text-black'
                                }`}
                        >
                            좋아요
                        </button>
                        <button
                            onClick={() => setActiveTab('bookmarks')}
                            className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'bookmarks'
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-500 hover:text-black'
                                }`}
                        >
                            북마크
                        </button>
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'posts'
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-500 hover:text-black'
                                }`}
                        >
                            내 게시물
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">로딩 중...</div>
                    ) : posts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {activeTab === 'likes' && '아직 좋아요를 누른 게시물이 없습니다.'}
                            {activeTab === 'bookmarks' && '아직 북마크한 게시물이 없습니다.'}
                            {activeTab === 'posts' && '아직 작성한 게시물이 없습니다.'}
                        </div>
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
            </div>
        </MainLayout>
    );
}
