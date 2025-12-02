import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import ActionButtons from './ActionButtons';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface PostCardProps {
    id: string;
    author: {
        name: string;
        image?: string;
        username: string;
    };
    content: string;
    images?: string; // Comma-separated image URLs
    createdAt: Date;
    sourceUrl?: string;
    sourceTitle?: string;
    tags?: string[];
    stats: {
        likes: number;
        comments: number;
    };
}

export default function PostCard({
    id,
    author,
    content,
    images,
    createdAt,
    sourceUrl,
    sourceTitle,
    tags,
    stats
}: PostCardProps) {
    const imageUrls = images ? images.split(',').filter(Boolean) : [];
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('이 게시물을 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`/api/posts/${id}`);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('게시물 삭제에 실패했습니다.');
        }
    };

    const handleEdit = () => {
        setShowMenu(false);
        router.push(`/edit/${id}`);
    };
    return (
        <article className="p-4 border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex gap-3">
                {/* Left: Avatar */}
                <div className="flex-shrink-0 pt-1">
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
                        {author.image ? (
                            <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-sm">
                                {author.name[0]}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-[15px] text-black">{author.username}</span>
                            <span className="text-gray-400 text-sm">
                                {formatDistanceToNow(createdAt, { addSuffix: false }).replace('about ', '')}
                            </span>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100"
                            >
                                <MoreHorizontal size={18} />
                            </button>

                            {showMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                        <button
                                            onClick={handleEdit}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <Edit size={16} />
                                            <span>편집</span>
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors text-left"
                                        >
                                            <Trash2 size={16} />
                                            <span>삭제</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-[15px] text-gray-900 whitespace-pre-wrap leading-relaxed mb-2">
                        {content.split(/(#[^\s#]+)/g).map((part, index) => {
                            if (part.startsWith('#')) {
                                return (
                                    <span key={index} className="text-blue-500 hover:underline cursor-pointer font-medium">
                                        {part}
                                    </span>
                                );
                            }
                            return part;
                        })}
                    </div>

                    {/* Images */}
                    {imageUrls.length > 0 && (
                        <div className={`grid gap-2 mb-3 rounded-xl overflow-hidden ${imageUrls.length === 1 ? 'grid-cols-1' :
                            imageUrls.length === 2 ? 'grid-cols-2' :
                                imageUrls.length === 3 ? 'grid-cols-2' :
                                    'grid-cols-2'
                            }`}>
                            {imageUrls.map((url, index) => (
                                <div
                                    key={index}
                                    className={`relative ${imageUrls.length === 3 && index === 0 ? 'col-span-2' : ''
                                        } ${imageUrls.length === 1 ? 'aspect-video' : 'aspect-square'
                                        } bg-gray-100`}
                                >
                                    <img
                                        src={url}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tags section removed as requested */}

                    {/* Source Link Card */}
                    {sourceUrl && (
                        <Link
                            href={sourceUrl}
                            target="_blank"
                            className="block mb-3 rounded-xl border border-gray-200 overflow-hidden hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-3">
                                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    🔗 Source
                                </div>
                                <div className="font-medium text-sm text-gray-900 line-clamp-1">
                                    {sourceTitle || sourceUrl}
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Action Buttons */}
                    <ActionButtons postId={id} likes={stats.likes} comments={stats.comments} />
                </div>
            </div>
        </article>
    );
}
