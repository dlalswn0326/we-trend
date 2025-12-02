'use client';

import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { useAuth } from '../providers/AuthProvider';
import LoginModal from '../auth/LoginModal';

interface ActionButtonsProps {
    postId: string;
    likes: number;
    comments: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
}

export default function ActionButtons({
    postId,
    likes: initialLikes,
    comments,
    isLiked: initialIsLiked = false,
    isBookmarked: initialIsBookmarked = false
}: ActionButtonsProps) {
    const [liked, setLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [bookmarked, setBookmarked] = useState(initialIsBookmarked);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { user } = useAuth();

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent post click

        if (!user || user.isAnonymous) {
            setShowLoginModal(true);
            return;
        }

        const newLiked = !liked;
        setLiked(newLiked);
        setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

        try {
            await axios.post('/api/interactions', {
                postId,
                userId: user.id,
                type: 'LIKE'
            });
        } catch (error) {
            console.error('Failed to toggle like:', error);
            // Revert on error
            setLiked(!newLiked);
            setLikeCount(prev => newLiked ? prev - 1 : prev + 1);
        }
    };

    const handleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!user || user.isAnonymous) {
            setShowLoginModal(true);
            return;
        }

        const newBookmarked = !bookmarked;
        setBookmarked(newBookmarked);

        try {
            await axios.post('/api/interactions', {
                postId,
                userId: user.id,
                type: 'BOOKMARK'
            });
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
            // Revert on error
            setBookmarked(!newBookmarked);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mt-2 -ml-2">
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1.5 p-2 rounded-full hover:bg-gray-100 transition-colors group"
                    >
                        <Heart
                            size={20}
                            className={clsx(
                                "transition-all",
                                liked ? "fill-red-500 text-red-500" : "text-black group-hover:text-red-500"
                            )}
                        />
                        <span className={clsx("text-[13px]", liked ? "text-red-500" : "text-gray-500")}>
                            {likeCount > 0 && likeCount}
                        </span>
                    </button>

                    <button className="flex items-center gap-1.5 p-2 rounded-full hover:bg-gray-100 transition-colors group">
                        <MessageCircle size={20} className="text-black group-hover:text-blue-500" />
                        <span className="text-[13px] text-gray-500">{comments > 0 && comments}</span>
                    </button>
                </div>

                <button
                    onClick={handleBookmark}
                    className="flex items-center gap-1.5 p-2 rounded-full hover:bg-gray-100 transition-colors group"
                >
                    <Bookmark
                        size={20}
                        className={clsx(
                            "transition-all",
                            bookmarked ? "fill-black text-black" : "text-black group-hover:text-blue-500"
                        )}
                    />
                </button>
            </div>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    );
}
