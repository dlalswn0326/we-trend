'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/components/providers/AuthProvider';

export default function CreatePost() {
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 4) {
            alert('최대 4개의 이미지만 업로드할 수 있습니다.');
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            // Upload images first if any
            let imageUrls: string[] = [];
            if (images.length > 0) {
                const formData = new FormData();
                images.forEach(image => {
                    formData.append('images', image);
                });

                const uploadRes = await axios.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrls = uploadRes.data.urls;
            }

            await axios.post('/api/posts', {
                content,
                images: imageUrls.length > 0 ? imageUrls.join(',') : null
            });

            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('게시물 작성에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="text-gray-600 hover:text-black">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="font-bold text-lg">새 게시물</h2>
                    <div className="w-6" /> {/* Spacer for centering */}
                </div>

                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                {user?.name?.[0] || 'U'}
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="font-semibold mb-1">{user?.name || 'User'}</div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="무슨 일이 일어나고 있나요?"
                            className="w-full min-h-[200px] bg-transparent border-none focus:ring-0 resize-none text-[15px] placeholder:text-gray-400 p-0"
                            autoFocus
                        />

                        {/* Image Previews */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {previews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-white hover:bg-black"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Image Upload Button and Post Button */}
                        <div className="flex items-center justify-between mt-4">
                            <div>
                                {images.length < 4 && (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageSelect}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition text-sm"
                                        >
                                            <ImageIcon size={18} />
                                            <span>이미지 추가</span>
                                        </label>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!content.trim() || isSubmitting}
                                className="bg-black text-white px-6 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                            >
                                {isSubmitting ? '게시 중...' : '게시'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
