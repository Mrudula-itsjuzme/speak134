'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { personalities } from '@/lib/constants/personalities';

function PersonalitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedLang = searchParams.get('lang') || 'spanish';
  const { t } = useTranslation();

  const handleSelect = (personalityId: string) => {
    localStorage.setItem('preferredPersonality', personalityId);
    router.push(`/learn?lang=${selectedLang}&personality=${personalityId}`);
  };

  return (
    <div className="min-h-screen bg-dark-900 dark gradient-bg">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-500/5 to-transparent rounded-full" />
      </div>

      {/* Main Content */}
      <main className="relative pt-12 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{t('choose_personality', 'Choose Your AI Personality')}</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-lg mx-auto">
              {t('mood_match', 'Every mood has a match. Who do you want to talk to today?')}
            </p>
          </motion.div>

          {/* Personality Grid - Enhanced */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalities.map((personality, index) => (
              <motion.div
                key={personality.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => handleSelect(personality.id)}
                className="glass-card p-4 cursor-pointer group relative overflow-hidden"
              >
                {/* Avatar */}
                <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${personality.avatarBg} mb-4 flex items-center justify-center relative overflow-hidden`}>
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="text-4xl">{personality.traits[0]}</div>
                  </div>
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
    </div>
  );
}

export default function PersonalitiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Loading...</div>}>
      <PersonalitiesContent />
    </Suspense>
  );
}
