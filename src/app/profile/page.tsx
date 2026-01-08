'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Trophy, Flame, Clock, ChevronRight,
    Shield, Bell, HelpCircle, Save, Check, Mail, Settings, Calendar
} from 'lucide-react';
import {
    getUser, getLoggedInUser, getAllSessions,
    getUserProfile, type User, type SessionMemory, type UserProfile
} from '@/lib/memory/sessionStore';
import Header from '@/components/Header';
import { personalities } from '@/lib/constants/personalities';

const LANGUAGES = [
    { id: 'english', name: 'English', flag: '🇺🇸' },
    { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { id: 'french', name: 'French', flag: '🇫🇷' },
    { id: 'italian', name: 'Italian', flag: '🇮🇹' },
    { id: 'japanese', name: 'Japanese', flag: '🇯🇵' },
    { id: 'korean', name: 'Korean', flag: '🇰🇷' },
    { id: 'tamil', name: 'Tamil', flag: '🇮🇳' },
    { id: 'telugu', name: 'Telugu', flag: '🇮🇳' },
    { id: 'malayalam', name: 'Malayalam', flag: '🇮🇳' },
    { id: 'hindi', name: 'Hindi', flag: '🇮🇳' },
    { id: 'kannada', name: 'Kannada', flag: '🇮🇳' },
];

export default function ProfilePage() {
    const [userData, setUserData] = useState<User | null>(null);
    const [stats, setStats] = useState<UserProfile | null>(null);
    const [sessions, setSessions] = useState<SessionMemory[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Settings state
    const [nativeLang, setNativeLang] = useState('');
    const [learningLang, setLearningLang] = useState('');
    const [preferredPersonality, setPreferredPersonality] = useState('cheerful');

    const router = useRouter();

    useEffect(() => {
        const loadProfileData = async () => {
            const email = await getLoggedInUser();
            if (!email) {
                router.push('/login');
                return;
            }

            const supabaseUser = await getUser(email);
            const profile = await getUserProfile();
            const allSessions = await getAllSessions();

            // Map Supabase user to local User type
            if (supabaseUser) {
                setUserData({
                    name: supabaseUser.user_metadata?.name || 'User',
                    email: supabaseUser.email || email,
                    createdAt: new Date(supabaseUser.created_at || Date.now()).getTime()
                } as User);
            }

            // Language preferences are still in localStorage (can migrate to Supabase metadata later)
            setNativeLang(localStorage.getItem('nativeLanguage') || 'english');
            setLearningLang(localStorage.getItem('learningLanguage') || 'spanish');
            setPreferredPersonality(localStorage.getItem('selectedPersonality') || 'cheerful');
            setStats(profile || null);
            setSessions(allSessions.reverse().slice(0, 5)); // Latest 5
        };

        loadProfileData();
    }, [router]);

    const handleSettingsSave = async () => {
        setIsSaving(true);
        try {
            // Save to localStorage (can migrate to Supabase metadata later)
            localStorage.setItem('nativeLanguage', nativeLang);
            localStorage.setItem('learningLanguage', learningLang);
            localStorage.setItem('selectedPersonality', preferredPersonality);

            // Force all tabs/components to update translations
            window.dispatchEvent(new Event('storage'));

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-dark-900 dark gradient-bg text-white">
            <Header />

            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <main className="relative pt-28 pb-20 px-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-8 text-center relative overflow-hidden"
                        >
                            {/* Decorative gradient */}
                            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary-500/10 to-transparent" />

                            {/* Avatar with ring */}
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-full animate-spin-slow blur-sm" style={{ padding: '3px', animation: 'spin 8s linear infinite' }} />
                                <div className="relative w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-glow-md border-4 border-dark-900">
                                    {userData.name.charAt(0)}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mb-1 gradient-text">{userData.name}</h2>
                            <p className="text-gray-400 text-sm mb-6 flex items-center justify-center gap-1.5">
                                <Mail className="w-4 h-4" /> {userData.email}
                            </p>
                            <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 text-sm font-medium group">
                                <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> Edit Profile
                            </button>
                        </motion.div>

                        {/* Quick Stats Grid - Enhanced */}
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="stat-card group hover:scale-105 transition-transform"
                            >
                                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                </div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">{stats?.streakDays || 0}</p>
                                <p className="text-xs text-gray-400 mt-1">Day Streak</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="stat-card group hover:scale-105 transition-transform"
                            >
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                </div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">{stats?.totalSessions || 0}</p>
                                <p className="text-xs text-gray-400 mt-1">Lessons</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="stat-card col-span-2"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center mb-3">
                                            <Shield className="w-5 h-5 text-primary-400" />
                                        </div>
                                        <p className="text-3xl font-bold gradient-text">{Math.round((stats?.avgConfidenceScore || 0) * 100)}%</p>
                                        <p className="text-xs text-gray-400 mt-1">Avg. Confidence</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="badge badge-primary mb-2">
                                            {stats?.learnedPatterns?.strengths?.length || 0} Patterns
                                        </div>
                                        <p className="text-xs text-gray-400">Mastered</p>
                                    </div>
                                </div>
                                {/* Progress visualization */}
                                <div className="mt-4 progress-bar">
                                    <div className="progress-bar-fill" style={{ width: `${(stats?.avgConfidenceScore || 0) * 100}%` }} />
                                </div>
                            </motion.div>
                        </div>

                        {/* Preference Settings */}
                        <div className="glass p-6 rounded-2xl border border-white/10">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-primary-400" /> Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Native Language</label>
                                    <select
                                        value={nativeLang}
                                        onChange={(e) => setNativeLang(e.target.value)}
                                        className="w-full bg-dark-800 border-none rounded-xl text-sm py-2 px-3 focus:ring-2 focus:ring-primary-500 transition-all border-white/5"
                                    >
                                        {LANGUAGES.map(lang => (
                                            <option key={lang.id} value={lang.id}>{lang.flag} {lang.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Learning Language</label>
                                    <select
                                        value={learningLang}
                                        onChange={(e) => setLearningLang(e.target.value)}
                                        className="w-full bg-dark-800 border-none rounded-xl text-sm py-2 px-3 focus:ring-2 focus:ring-primary-500 transition-all border-white/5"
                                    >
                                        {LANGUAGES.map(lang => (
                                            <option key={lang.id} value={lang.id}>{lang.flag} {lang.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">AI Tutor Personality</label>
                                    <select
                                        value={preferredPersonality}
                                        onChange={(e) => setPreferredPersonality(e.target.value)}
                                        className="w-full bg-dark-800 border-none rounded-xl text-sm py-2 px-3 focus:ring-2 focus:ring-primary-500 transition-all border-white/5"
                                    >
                                        {personalities.map(p => (
                                            <option key={p.id} value={p.id}>{p.traits[0]} {p.name} ({p.subtitle})</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleSettingsSave}
                                    disabled={isSaving}
                                    className={`w-full mt-2 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${saveSuccess
                                        ? 'bg-green-500 text-white'
                                        : 'bg-primary-500 hover:bg-primary-600 text-white shadow-glow-sm'
                                        }`}
                                >
                                    {isSaving ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : saveSuccess ? (
                                        <><Check className="w-4 h-4" /> Saved!</>
                                    ) : (
                                        <><Save className="w-4 h-4" /> Save Changes</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity & History */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Learning Status */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-primary-900/10 to-transparent"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Clock className="w-6 h-6 text-primary-400" /> Recent Activity
                                    </h3>
                                    <p className="text-gray-400 text-sm">Your learning journey this week</p>
                                </div>
                                <Link href="/languages" className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {sessions.length > 0 ? (
                                <div className="space-y-4">
                                    {sessions.map((session) => (
                                        <div key={session.id} className="flex items-center gap-4 p-4 rounded-2xl bg-dark-800/50 border border-white/5 hover:border-primary-500/20 transition-all group">
                                            <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                {session.language === 'spanish' && '🇪🇸'}
                                                {session.language === 'french' && '🇫🇷'}
                                                {session.language === 'japanese' && '🇯🇵'}
                                                {session.language === 'italian' && '🇮🇹'}
                                                {session.language === 'korean' && '🇰🇷'}
                                                {session.language === 'hindi' && '🇮🇳'}
                                                {session.language === 'kannada' && '🇮🇳'}
                                                {session.language === 'tamil' && '🇮🇳'}
                                                {session.language === 'telugu' && '🇮🇳'}
                                                {session.language === 'malayalam' && '🇮🇳'}
                                                {!['spanish', 'french', 'japanese', 'italian', 'korean', 'hindi', 'kannada', 'tamil', 'telugu', 'malayalam'].includes(session.language) && '🌐'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <h4 className="font-bold capitalize">{session.language} Practice</h4>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(session.startTime).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400 line-clamp-1">{session.summary || 'Completed conversation'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No learning sessions yet. Time to start practicing!</p>
                                    <Link href="/languages" className="btn-primary inline-flex mt-6 px-6 py-3 rounded-xl">
                                        Browse Courses
                                    </Link>
                                </div>
                            )}
                        </motion.div>

                        {/* Menu Items */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="flex items-center justify-between p-5 rounded-2xl bg-dark-800 hover:bg-dark-700 transition-colors border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">Security</p>
                                        <p className="text-xs text-gray-500">Privacy & auth settings</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                            </button>

                            <button className="flex items-center justify-between p-5 rounded-2xl bg-dark-800 hover:bg-dark-700 transition-colors border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">Notifications</p>
                                        <p className="text-xs text-gray-500">Manage alerts</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                            </button>

                            <button className="flex items-center justify-between p-5 rounded-2xl bg-dark-800 hover:bg-dark-700 transition-colors border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">History</p>
                                        <p className="text-xs text-gray-500">View all records</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                            </button>

                            <button className="flex items-center justify-between p-5 rounded-2xl bg-dark-800 hover:bg-dark-700 transition-colors border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
                                        <HelpCircle className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">Support</p>
                                        <p className="text-xs text-gray-500">Contact our team</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
