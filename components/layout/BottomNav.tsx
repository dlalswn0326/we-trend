'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusSquare, Heart, User, LogIn, LogOut } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../providers/AuthProvider';
import { useState } from 'react';
import LoginModal from '../auth/LoginModal';

export default function BottomNav() {
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

    const handleNavClick = (e: React.MouseEvent, item: typeof allNavItems[0]) => {
        if (item.requiresAuth && user?.isAnonymous) {
            e.preventDefault();
            setShowLoginModal(true);
        }
    };

    return (
        <>
            <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
                {allNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item)}
                            className={clsx(
                                'flex flex-col items-center justify-center w-full h-full',
                                isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                            )}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </Link>
                    );
                })}

                {/* Login Button for Anonymous Users or Logout for Registered Users (Mobile) */}
                {user?.isAnonymous ? (
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-gray-600"
                    >
                        <LogIn size={24} strokeWidth={2} />
                    </button>
                ) : (
                    <button
                        onClick={logout}
                        className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-gray-600"
                    >
                        <LogOut size={24} strokeWidth={2} />
                    </button>
                )}
            </nav>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    );
}
