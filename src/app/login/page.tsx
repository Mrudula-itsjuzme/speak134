'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mic, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { getUser, setLoggedInUser } from '@/lib/memory/sessionStore';
import { verifyPassword } from '@/lib/utils/security';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const user = await getUser(email);
            if (user && user.password && await verifyPassword(password, user.password)) {
                setLoggedInUser(email);
                router.push('/');
            } else {
                setError('Invalid email or password');
            }
        } catch {
            setError('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 dark flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-900/20 via-dark-900 to-dark-900">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl items-center justify-center mb-6 shadow-glow-lg"
                    >
                        <Mic className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-400">Continue your language learning journey</p>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-3xl p-8 border border-white/10 shadow-glow-sm"
                >
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-dark-800 text-white rounded-xl py-3 pl-12 pr-4 border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-medium text-gray-400">Password</label>
                                <button type="button" className="text-sm text-primary-400 hover:text-primary-300">Forgot?</button>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-dark-800 text-white rounded-xl py-3 pl-12 pr-4 border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group mt-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-bold py-4 rounded-xl shadow-glow-md hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Log In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/5 text-gray-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-primary-400 font-bold hover:text-primary-300 transition-colors">
                            Sign Up Free
                        </Link>
                    </div>
                </motion.div>

                {/* Guest access hint */}
                <p className="mt-8 text-center text-gray-500 text-sm">
                    Any account created will be stored in your local browser session.
                </p>
            </div>
        </div>
    );
}
