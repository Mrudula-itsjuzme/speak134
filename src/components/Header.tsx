'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { getLoggedInUser, getUser } from '@/lib/memory/sessionStore';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';

export default function Header() {
    const [user, setUser] = useState<{ name: string; email: string; learningLanguage?: string } | null>(null);
    const { t } = useTranslation();
    const pathname = usePathname();

    useEffect(() => {
        const fetchUser = async () => {
            const email = getLoggedInUser();
            if (email) {
                const userData = await getUser(email);
                if (userData) {
                    setUser(userData);
                }
            }
        };
        fetchUser();
        window.addEventListener('storage', fetchUser);
        return () => window.removeEventListener('storage', fetchUser);
    }, []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/profile' },
        { name: 'Community', path: '/community' }
    ];

    return (
        <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-card pointer-events-auto bg-[#2a2a2a]/90 backdrop-blur-xl border border-white/10 rounded-full px-2 py-2 flex items-center shadow-2xl max-w-2xl w-full justify-between"
            >
                {/* Logo Area / Left Nav */}
                <div className="flex items-center gap-1">
                    {/* Navigation Pills */}
                    <div className="flex items-center bg-white/5 rounded-full p-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === item.path
                                    ? 'bg-[#1e1e1e] text-white shadow-lg'
                                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Area: Search & Profile */}
                <div className="flex items-center gap-3 pr-2">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/5 transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    <div className="h-6 w-px bg-white/10 mx-1" />

                    {user ? (
                        <Link href="/profile" className="flex items-center gap-3 pl-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold border-2 border-dark-800 shadow-glow-sm">
                                {user.name.charAt(0)}
                            </div>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="px-5 py-2 rounded-full text-sm font-bold text-white bg-white/5 hover:bg-white/10 transition-colors">
                                {t('login', 'Log In')}
                            </Link>
                            <Link href="/signup" className="px-5 py-2 rounded-full text-sm font-bold text-dark-900 bg-white hover:bg-stone-100 transition-colors shadow-lg shadow-white/10">
                                {t('signup', 'Sign Up')}
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </header>
    );
}
