import { Smile, Heart, Zap, BookOpen, Coffee, Leaf, Trophy, Palette } from 'lucide-react';

export interface Personality {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    traits: string[];
    avatarBg: string;
    icon: React.ReactNode;
}

export const personalities: Personality[] = [
    {
        id: 'cheerful',
        name: 'Cheerful',
        subtitle: 'Friendly & Warm',
        description: 'Always smiling, great for beginners who need encouragement.',
        traits: ['😊', '☀️'],
        avatarBg: 'from-yellow-400 to-orange-400',
        icon: <Smile className="w-6 h-6" />
    },
    {
        id: 'empathetic',
        name: 'Empathetic',
        subtitle: 'Patient & Kind',
        description: 'Patient listener for stress-free practice and venting.',
        traits: ['❤️', '🌱'],
        avatarBg: 'from-pink-400 to-rose-400',
        icon: <Heart className="w-6 h-6" />
    },
    {
        id: 'energetic',
        name: 'Energetic',
        subtitle: 'Fast & Fun',
        description: 'Fast-paced conversation practice to boost your reflexes.',
        traits: ['⚡', '🎯'],
        avatarBg: 'from-orange-400 to-amber-400',
        icon: <Zap className="w-6 h-6" />
    },
    {
        id: 'intellectual',
        name: 'Intellectual',
        subtitle: 'Smart & Deep',
        description: 'Deep dives into grammar, nuance, and complex topics.',
        traits: ['🧠', '💡'],
        avatarBg: 'from-stone-600 to-stone-400',
        icon: <BookOpen className="w-6 h-6" />
    },
    {
        id: 'casual',
        name: 'Casual',
        subtitle: 'Relaxed & Cool',
        description: 'Relaxed, slang-heavy chat for daily life scenarios.',
        traits: ['☕', '🎧'],
        avatarBg: 'from-amber-400 to-yellow-600',
        icon: <Coffee className="w-6 h-6" />
    },
    {
        id: 'calm',
        name: 'Calm',
        subtitle: 'Zen & Slow',
        description: 'Slow, clear speech for total focus and pronunciation.',
        traits: ['🧘', '💧'],
        avatarBg: 'from-teal-400 to-emerald-400',
        icon: <Leaf className="w-6 h-6" />
    },
    {
        id: 'motivating',
        name: 'Motivating',
        subtitle: 'Pushy & Inspiring',
        description: 'High energy coaching to push your limits.',
        traits: ['💪', '🔥'],
        avatarBg: 'from-orange-400 to-red-400',
        icon: <Trophy className="w-6 h-6" />
    },
    {
        id: 'creative',
        name: 'Creative',
        subtitle: 'Imaginative',
        description: 'Imaginative roleplay and storytelling scenarios.',
        traits: ['🎨', '✨'],
        avatarBg: 'from-violet-400 to-fuchsia-400',
        icon: <Palette className="w-6 h-6" />
    }
];
