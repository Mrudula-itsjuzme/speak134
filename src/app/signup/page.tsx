'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { registerUser } from '@/lib/memory/sessionStore';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { session } = await registerUser({ name, email, password });
            if (!session) {
                setShowConfirmation(true);
            } else {
                router.push('/');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (showConfirmation) {
        return (
            <div className="min-h-screen bg-dark-900 dark flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-purple-900/20 via-dark-900 to-dark-900">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md glass rounded-3xl p-8 border border-white/10 shadow-glow-md text-center"
                >
                    <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-primary-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
                    <p className="text-gray-400 mb-8">
                        We&apos;ve sent a verification link to <span className="text-white font-medium">{email}</span>.
                        Please confirm your email to start your journey.
                    </p>
                    <Link
                        href="/login"
                        className="w-full inline-flex items-center justify-center py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all font-medium"
                    >
                        Back to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-900 dark flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-purple-900/20 via-dark-900 to-dark-900">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex w-16 h-16 bg-gradient-to-br from-purple-500 to-primary-600 rounded-2xl items-center justify-center mb-6 shadow-glow-lg"
                    >
                        <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Join MisSpoke</h1>
                    <p className="text-gray-400">Master new languages with AI precision</p>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-3xl p-8 border border-white/10 shadow-glow-sm"
                >
                    <form onSubmit={handleSignup} className="space-y-5">
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
                            <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-dark-800 text-white rounded-xl py-3 pl-12 pr-4 border border-white/5 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

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
                            <label className="text-sm font-medium text-gray-400 ml-1">Create Password</label>
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

                        <p className="text-[10px] text-gray-500 px-1 leading-relaxed">
                            By signing up, you agree to our Terms of Service and Privacy Policy. Any data entered is stored locally in your browser.
                        </p>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full group mt-4 bg-gradient-to-r from-purple-500 to-primary-600 text-white font-bold py-4 rounded-xl shadow-glow-md hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/5 text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary-400 font-bold hover:text-primary-300 transition-colors">
                            Log In
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
