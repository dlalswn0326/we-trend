'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Camera } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [profileImage, setProfileImage] = useState<string>('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/api/profile');
            const { name, bio, profileImage } = response.data;
            setName(name || '');
            setBio(bio || '');
            setProfileImage(profileImage || '');
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put('/api/profile', {
                name,
                bio,
                profileImage
            });
            alert('프로필이 저장되었습니다.');
            router.refresh();
        } catch (error) {
            console.error('Failed to save profile:', error);
            alert('프로필 저장에 실패했습니다.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div>
                {/* Header */}
                <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
                    <h1 className="font-bold text-xl px-4 py-3">프로필</h1>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl font-bold">
                                        {name[0]}
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                                id="profile-upload"
                            />
                            <label
                                htmlFor="profile-upload"
                                className="absolute bottom-0 right-0 p-2 bg-white border border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition"
                            >
                                <Camera size={18} />
                            </label>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">소개</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="자기소개를 입력하세요..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                                rows={3}
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {saving ? '저장 중...' : '프로필 저장'}
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
