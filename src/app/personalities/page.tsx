'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Mic, Smile, Heart, Zap, BookOpen, Coffee, Leaf, Trophy, Palette } from 'lucide-react';

interface Personality {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  traits: string[];
  avatarBg: string;
  icon: React.ReactNode;
}

const personalities: Personality[] = [
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
    avatarBg: 'from-primary-400 to-cyan-400',
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: 'intellectual',
    name: 'Intellectual',
    subtitle: 'Smart & Deep',
    description: 'Deep dives into grammar, nuance, and complex topics.',
    traits: ['🧠', '💡'],
    avatarBg: 'from-indigo-400 to-purple-400',
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

export default function PersonalitiesPage() {
  const searchParams = useSearchParams();
  const selectedLang = searchParams.get('lang') || 'spanish';
  const [selectedPersonality, setSelectedPersonality] = useState<Personality | null>(null);

  return (
    <div className="min-h-screen bg-dark-900 dark">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-dark-900 via-dark-900 to-primary-900/20 pointer-events-none" />

      {/* Main Content */}
      <main className="relative pt-12 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your<br />
              <span className="gradient-text">AI Personality</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-lg mx-auto">
              Every mood has a match. Who do you want to talk to today?
            </p>
          </motion.div>

          {/* Personality Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalities.map((personality, index) => (
              <motion.div
                key={personality.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => setSelectedPersonality(personality)}
                className={`glass rounded-2xl p-4 cursor-pointer transition-all ${
                  selectedPersonality?.id === personality.id
                    ? 'card-selected'
                    : 'hover:border-white/20'
                }`}
              >
                {/* Avatar */}
                <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${personality.avatarBg} mb-4 flex items-center justify-center relative overflow-hidden`}>
                  {/* Placeholder for 3D avatar - could be replaced with actual images */}
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="text-4xl">{personality.traits[0]}</div>
                  </div>
                  
                  {/* Selected indicator */}
                  {selectedPersonality?.id === personality.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{personality.name}</h3>
                    <p className="text-sm text-gray-400">{personality.subtitle}</p>
                  </div>
                  <div className="flex gap-1">
                    {personality.traits.map((trait, i) => (
                      <span key={i} className="text-lg">{trait}</span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2">
                  {personality.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Antigravity Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500">
              ✨ Your tutor will subtly adapt over time based on your learning patterns
            </p>
          </motion.div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      {selectedPersonality && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-lg border-t border-white/10 px-6 py-4"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedPersonality.avatarBg} flex items-center justify-center`}>
                <span className="text-xl">{selectedPersonality.traits[0]}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Selected Personality</p>
                <p className="text-lg font-bold text-white">
                  {selectedPersonality.name} <span className="text-gray-400 font-normal">· {selectedPersonality.subtitle}</span>
                </p>
              </div>
            </div>
            <Link 
              href={`/learn?lang=${selectedLang}&personality=${selectedPersonality.id}`}
              className="btn-primary px-8 py-3 flex items-center gap-2"
            >
              Start Learning Session <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
