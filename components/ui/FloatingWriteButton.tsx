'use client';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function FloatingWriteButton() {
    return (
        <Link
            href="/create"
            className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 bg-black text-white rounded-full p-4 shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-110"
            aria-label="글쓰기"
        >
            <PlusCircle size={28} strokeWidth={2} />
        </Link>
    );
}
