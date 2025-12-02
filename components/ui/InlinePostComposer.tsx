'use client';

import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface InlinePostComposerProps {
    onPostCreated?: () => void;
}

export default function InlinePostComposer({ onPostCreated }: InlinePostComposerProps) {
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 4) {
            alert('최대 4개의 이미지만 업로드할 수 있습니다.');
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

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
        if (!content.trim() && images.length === 0) return;

        setIsSubmitting(true);
        try {
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
                images: imageUrls.length > 0 ? imageUrls.join(',') : null,
                authorId: user?.id
            });

            // Reset form
            setContent('');
            setImages([]);
            setPreviews([]);

            if (onPostCreated) {
                onPostCreated();
            } else {
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('게시물 작성에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white border-b border-gray-100 p-4">
            <div className="flex gap-3">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    {user?.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                            {user?.name?.[0] || 'U'}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    {/* Text Input */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="여러분의 AI/IT 트렌드를 공유해 주세요"
                        className="w-full bg-transparent border-none focus:ring-0 resize-none text-[15px] placeholder:text-gray-400 p-0"
                        rows={2}
                    />

                    {/* Image Previews */}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-0.5 bg-black/70 rounded-full text-white hover:bg-black"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            {/* Image Upload Button */}
                            {images.length < 4 && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        id="inline-image-upload"
                                    />
                                    <label
                                        htmlFor="inline-image-upload"
                                        className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition"
                                    >
                                        <ImageIcon size={18} className="text-gray-600" />
                                    </label>
                                </>
                            )}
                        </div>

                        {/* Post Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={(!content.trim() && images.length === 0) || isSubmitting}
                            className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                        >
                            {isSubmitting ? '게시 중...' : '게시'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
