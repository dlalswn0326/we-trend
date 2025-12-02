'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, Heart, User, Menu, Pin, LogIn, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../providers/AuthProvider';
import { useState } from 'react';
import LoginModal from '../auth/LoginModal';

export default function SideNav() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const allNavItems = [
        { href: '/', icon: Home, label: '홈', requiresAuth: false },
        { href: '/search', icon: Search, label: '검색', requiresAuth: false },
        { href: '/create', icon: PlusSquare, label: '글쓰기', requiresAuth: false },
        { href: '/activity', icon: Heart, label: '활동', requiresAuth: true },
        { href: '/profile', icon: User, label: '프로필', requiresAuth: true },
    ];

    // Show all nav items, but handle clicks for restricted ones
    const handleNavClick = (e: React.MouseEvent, item: typeof allNavItems[0]) => {
        if (item.requiresAuth && user?.isAnonymous) {
            e.preventDefault();
            setShowLoginModal(true);
        }
    };

    return (
        <>
            <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 w-20 xl:w-64 bg-white border-r border-gray-200 z-50 py-6 px-4 justify-between">
                <div className="space-y-8">
                    {/* Logo */}
                    <div className="px-2">
                        <Link href="/" className="block">
                            <h1 className="text-2xl font-bold tracking-tighter hover:scale-105 transition-transform cursor-pointer">
                                We-Trend
                            </h1>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col gap-2">
                        {allNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item)}
                                    className={clsx(
                                        'flex items-center gap-4 p-3 rounded-xl transition-all duration-200',
                                        isActive
                                            ? 'text-black font-bold'
                                            : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                                    )}
                                >
                                    <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="hidden xl:block text-[17px]">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom: User Info or Login Button */}
                <div className="px-2">
                    {user?.isAnonymous ? (
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 w-full transition-colors"
                        >
                            <LogIn size={24} />
                            <div className="hidden xl:block text-left">
                                <div className="font-medium">로그인</div>
                                <div className="text-xs text-gray-500">더 많은 기능 사용</div>
                            </div>
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 p-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                    {user?.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                            {user?.name?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="hidden xl:block flex-1 min-w-0">
                                    <div className="font-medium truncate">{user?.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 w-full transition-colors"
                            >
                                <LogOut size={24} />
                                <span className="hidden xl:block text-[17px]">로그아웃</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    );
}
