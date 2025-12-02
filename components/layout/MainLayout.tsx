import React from 'react';
import BottomNav from './BottomNav';
import SideNav from './SideNav';
import ScrollToTopButton from '../ui/ScrollToTopButton';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-white md:bg-gray-50 flex justify-center">
            {/* Desktop Sidebar */}
            <SideNav />

            {/* Main Content */}
            <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl bg-white min-h-screen shadow-sm relative pb-20 md:pb-0 md:ml-20 xl:ml-64 border-x border-gray-100">
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-center md:hidden">
                    <h1 className="font-bold text-xl tracking-tight">We-Trend</h1>
                </header>

                <main>
                    {children}
                </main>

                {/* Mobile Bottom Nav */}
                <div className="md:hidden">
                    <BottomNav />
                </div>
            </div>

            {/* Scroll To Top Button */}
            <ScrollToTopButton />
        </div>
    );
}
