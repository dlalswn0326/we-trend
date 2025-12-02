'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import PostCard from '@/components/ui/PostCard';
import { Search } from 'lucide-react';
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

export default function SearchPage() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams?.get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const performSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setPosts([]);
            setSearched(false);
            return;
        }

        setLoading(true);
        setSearched(true);
        try {
            const response = await axios.get(`/api/posts?q=${encodeURIComponent(searchQuery)}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Search failed:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuggestions = async (searchQuery: string) => {
        setLoadingSuggestions(true);
        try {
            const response = await axios.get(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
            setSuggestions(response.data);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Suggestions failed:', error);
            setSuggestions([]);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    useEffect(() => {
        if (initialQuery) {
            performSearch(initialQuery);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(query);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (value.trim()) {
            debounceRef.current = setTimeout(() => {
                fetchSuggestions(value);
            }, 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        performSearch(suggestion);
    };

    const handleInputFocus = () => {
        if (suggestions.length > 0 && query.trim()) {
            setShowSuggestions(true);
        }
    };

    const handleInputBlur = () => {
        // Delay hiding to allow suggestion click
        setTimeout(() => setShowSuggestions(false), 200);
    };

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-4">검색</h1>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="relative">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="게시물 내용이나 태그를 검색하세요..."
                                value={query}
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={loading}
                            >
                                <Search size={20} />
                            </button>
                            {/* Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                    {loadingSuggestions ? (
                                        <div className="px-4 py-2 text-gray-500">추천 로딩 중...</div>
                                    ) : (
                                        suggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                                            >
                                                {suggestion}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Results */}
                <div className="divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">검색 중...</div>
                    ) : posts.length === 0 && searched ? (
                        <div className="p-8 text-center text-gray-500">
                            '{query}'에 대한 검색 결과가 없습니다.
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <PostCard
                                key={post.id}
                                {...post}
                                createdAt={new Date(post.createdAt)}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            검색어를 입력해주세요.
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
