'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function EditPost() {
    const params = useParams();
    const postId = params.id as string;
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Fetch existing post data
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${postId}`);
                const post = response.data;
                setContent(post.content);
                if (post.images) {
                    const imageUrls = post.images.split(',').filter(Boolean);
                    setExistingImages(imageUrls);
                    setPreviews(imageUrls);
                }
            } catch (error) {
                console.error('Failed to fetch post:', error);
                alert('게시물을 불러오는데 실패했습니다.');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId, router]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length + existingImages.length > 4) {
            alert('최대 4개의 이미지만 업로드할 수 있습니다.');
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        // Create previews for new images
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        const newImageStartIndex = existingImages.length;
        const actualIndex = index - newImageStartIndex;
        setImages(prev => prev.filter((_, i) => i !== actualIndex));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            // Upload new images if any
            let newImageUrls: string[] = [];
            if (images.length > 0) {
                const formData = new FormData();
                images.forEach(image => {
                    formData.append('images', image);
                });

                const uploadRes = await axios.post('/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                newImageUrls = uploadRes.data.urls;
            }

            // Combine existing and new images
            const allImages = [...existingImages, ...newImageUrls];

            await axios.put(`/api/posts/${postId}`, {
                content,
                images: allImages.length > 0 ? allImages.join(',') : null
            });

            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Failed to update post:', error);
            alert('게시물 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="p-8 text-center text-gray-500">로딩 중...</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="text-gray-600 hover:text-black">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="font-bold text-lg">게시물 수정</h2>
                    <div className="w-6" /> {/* Spacer for centering */}
                </div>

                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                            U
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="font-semibold mb-1">User</div>
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
                                            onClick={() => {
                                                if (index < existingImages.length) {
                                                    removeExistingImage(index);
                                                } else {
                                                    removeNewImage(index);
                                                }
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-white hover:bg-black"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Image Upload Button */}
                        {(images.length + existingImages.length) < 4 && (
                            <div className="mt-4">
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
                            </div>
                        )}
                    </div>
                </div>

                <div className="fixed bottom-20 md:bottom-4 left-0 w-full flex justify-center pointer-events-none">
                    <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl px-4 flex justify-end pointer-events-auto">
                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() || isSubmitting}
                            className="bg-black text-white px-6 py-2 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                        >
                            {isSubmitting ? '수정 중...' : '수정'}
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
