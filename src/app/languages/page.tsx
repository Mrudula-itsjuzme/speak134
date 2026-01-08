'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import { useRouter } from 'next/navigation';
import { Clock, Users, Flame } from 'lucide-react';
import Header from '@/components/Header';
import { useTranslation } from '@/hooks/useTranslation';

interface Language {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Advanced';
  hours: number;
  learners: string;
  popularity: number;
  features: string[];
}

const languages: Language[] = [
  {
    id: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    difficulty: 'Beginner Friendly',
    hours: 600,
    learners: '1.2M+',
    popularity: 98,
    features: ['Real-world convo focus', 'AI Pronunciation']
  },
  {
    id: 'french',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    difficulty: 'Intermediate',
    hours: 750,
    learners: '850k+',
    popularity: 85,
    features: ['Culture & Literature', 'Accent Training']
  },
  {
    id: 'japanese',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    difficulty: 'Advanced',
    hours: 2200,
    learners: '920k+',
    popularity: 90,
    features: ['Kanji Writer', 'Anime Context AI']
  },
  {
    id: 'german',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    difficulty: 'Intermediate',
    hours: 750,
    learners: '600k+',
    popularity: 70,
    features: ['Technical Vocab', 'Dialogue Simulator']
  },
  {
    id: 'mandarin',
    name: 'Mandarin',
    nativeName: '普通话',
    flag: '🇨🇳',
    difficulty: 'Advanced',
    hours: 2200,
    learners: '1.1M+',
    popularity: 88,
    features: ['Tone Analyzer', 'Character Practice']
  },
  {
    id: 'italian',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    difficulty: 'Beginner Friendly',
    hours: 600,
    learners: '400k+',
    popularity: 55,
    features: ['Culinary Focus', 'Art History']
  },
  {
    id: 'korean',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    difficulty: 'Advanced',
    hours: 2200,
    learners: '1.5M+',
    popularity: 92,
    features: ['K-Pop Lyrics', 'Honorifics Drill']
  },
  {
    id: 'tamil',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    difficulty: 'Advanced',
    hours: 1100,
    learners: '80M+',
    popularity: 75,
    features: ['Classical Literature', 'Dravidian Roots']
  },
  {
    id: 'telugu',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    difficulty: 'Intermediate',
    hours: 1000,
    learners: '85M+',
    popularity: 72,
    features: ['Vowel Harmony', 'Poetic Tradition']
  },
  {
    id: 'malayalam',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    difficulty: 'Advanced',
    hours: 1100,
    learners: '35M+',
    popularity: 68,
    features: ['Agglutinative Grammar', 'Sanskrit Influence']
  },
  {
    id: 'hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    difficulty: 'Intermediate',
    hours: 1000,
    learners: '120M+',
    popularity: 95,
    features: ['Devanagari Script', 'Common in Movies']
  },
  {
    id: 'kannada',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    difficulty: 'Advanced',
    hours: 1100,
    learners: '45M+',
    popularity: 62,
    features: ['Dravidian Roots', 'Complex Grammar']
  }
];

const getGradient = () => {
  return 'from-primary-500/10 to-transparent';
};

const getIsoCode = (id: string) => {
  const map: Record<string, string> = {
    'spanish': 'ES', 'french': 'FR', 'japanese': 'JP', 'german': 'DE',
    'mandarin': 'CN', 'italian': 'IT', 'korean': 'KR', 'hindi': 'IN',
    'tamil': 'TA', 'kannada': 'KN', 'telugu': 'TE', 'malayalam': 'ML'
  };
  return map[id] || id.substring(0, 2).toUpperCase();
};

const getLevelColor = (level: string) => {
  if (level === 'Beginner Friendly') return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (level === 'Intermediate') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
};

type FilterType = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

export default function LanguagesPage() {
  const [filter, setFilter] = useState<FilterType>('All');
  const router = useRouter();
  const { t } = useTranslation();

  const filteredLanguages = languages.filter((lang) => {
    if (filter === 'All') return true;
    if (filter === 'Beginner') return lang.difficulty === 'Beginner Friendly';
    if (filter === 'Intermediate') return lang.difficulty === 'Intermediate';
    if (filter === 'Advanced') return lang.difficulty === 'Advanced';
    return true;
  });

  return (
    <div className="min-h-screen bg-dark-900 dark gradient-bg text-white">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">{t('explore_languages', 'Explore Languages')}</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('start_journey', 'Choose from our diverse collection of languages. Each designed with unique cultural context and native-speaking AI personalities.')}
            </p>
          </motion.div>

          {/* Filter Tabs - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as FilterType[]).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${filter === filterOption
                  ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-glow-sm'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
              >
                {t(`filter_${filterOption.toLowerCase()}`, filterOption)}
              </button>
            ))}
          </motion.div>

          {/* Language Grid - Enhanced */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLanguages.map((language, index) => (
              <motion.div
                key={language.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => router.push(`/personalities?lang=${language.id}`)}
                className="group relative bg-[#0F172A] rounded-3xl p-6 border border-white/5 hover:-translate-y-2 transition-transform duration-500 shadow-xl cursor-pointer overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} rounded-3xl opacity-50 group-hover:opacity-70 transition-opacity`} />

                {/* ISO Code Watermark */}
                <span className="text-6xl font-bold text-white/5 select-none absolute -top-4 right-0 pointer-events-none group-hover:text-white/10 transition-colors">
                  {getIsoCode(language.id)}
                </span>

                {/* Header */}
                <div className="relative mb-6">
                  <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                    {language.nativeName}
                  </h3>
                  <p className="text-gray-400 text-sm">{language.name}</p>
                </div>

                {/* Badge */}
                <div className={`relative inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-6 ${getLevelColor(language.difficulty)}`}>
                  {language.difficulty}
                </div>

                {/* Stats */}
                <div className="relative grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-medium text-gray-200">~{language.hours}h</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-medium text-gray-200">{language.learners}</span>
                  </div>
                </div>

                {/* Popularity */}
                <div className="relative mb-6">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">Popularity</span>
                    <span className="text-white font-bold">{language.popularity}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${language.popularity}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-primary-500 rounded-full"
                    />
                  </div>
                </div>

                {/* FooterFeature */}
                <div className="relative pt-4 border-t border-white/5 flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wide">
                  <Flame className="w-3 h-3" />
                  {language.features[0]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
