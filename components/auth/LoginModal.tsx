'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                await login(email, password);
                onClose();
            } else {
                if (password !== confirmPassword) {
                    setError('비밀번호가 일치하지 않습니다.');
                    setLoading(false);
                    return;
                }
                await register(email, password, name);
                onClose();
            }
        } catch (err: any) {
            setError(err.response?.data?.error || '오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">
                        {mode === 'login' ? '로그인' : '회원가입'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        onClick={() => setMode('login')}
                        className={`flex-1 py-3 font-medium transition ${mode === 'login'
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-400'
                            }`}
                    >
                        로그인
                    </button>
                    <button
                        onClick={() => setMode('register')}
                        className={`flex-1 py-3 font-medium transition ${mode === 'register'
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-400'
                            }`}
                    >
                        회원가입
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                이름 (선택)
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="홍길동"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            이메일
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            비밀번호
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                비밀번호 확인
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading
                            ? '처리 중...'
                            : mode === 'login'
                                ? '로그인'
                                : '회원가입'}
                    </button>
                </form>
            </div>
        </div>
    );
}
