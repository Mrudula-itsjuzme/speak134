'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Users, Flame, BookOpen, Mic, PenTool } from 'lucide-react';

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
    id: 'portuguese',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    difficulty: 'Beginner Friendly',
    hours: 600,
    learners: '500k+',
    popularity: 65,
    features: ['Travel Situations', 'Listening Focus']
  }
];

const difficultyColors = {
  'Beginner Friendly': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Intermediate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Advanced': 'bg-red-500/20 text-red-400 border-red-500/30'
};

type FilterType = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

export default function LanguagesPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredLanguages = languages.filter(lang => {
    if (filter === 'All') return true;
    if (filter === 'Beginner') return lang.difficulty === 'Beginner Friendly';
    if (filter === 'Intermediate') return lang.difficulty === 'Intermediate';
    if (filter === 'Advanced') return lang.difficulty === 'Advanced';
    return true;
  });

  return (
    <div className="min-h-screen bg-dark-900 dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MisSpoke</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <Link href="/languages" className="text-primary-400 font-medium">Courses</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Community</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Profile</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-white transition-colors px-4 py-2">Log In</button>
            <button className="btn-primary px-4 py-2">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Select Your Language
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Choose from our curated selection of languages. Unlock new cultures and career opportunities with our AI-driven path.
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 mb-10"
          >
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as FilterType[]).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                  filter === filterOption
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-white'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </motion.div>

          {/* Language Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLanguages.map((language, index) => (
              <motion.div
                key={language.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => setSelectedLanguage(language)}
                className={`glass rounded-2xl p-5 cursor-pointer transition-all ${
                  selectedLanguage?.id === language.id
                    ? 'card-selected'
                    : 'hover:border-white/20'
                }`}
              >
                {/* Flag & Name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{language.flag}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{language.nativeName}</h3>
                      <p className="text-sm text-gray-400">{language.name}</p>
                    </div>
                  </div>
                  {selectedLanguage?.id === language.id && (
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Difficulty Badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-4 ${difficultyColors[language.difficulty]}`}>
                  {language.difficulty}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>~{language.hours} hrs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{language.learners}</span>
                  </div>
                </div>

                {/* Popularity */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Popularity</span>
                    <span className="text-white font-medium">{language.popularity}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${language.popularity}%` }}
                    />
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {language.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <Flame className="w-4 h-4 text-primary-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      {selectedLanguage && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-lg border-t border-white/10 px-6 py-4"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{selectedLanguage.flag}</span>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Selected</p>
                <p className="text-lg font-bold text-white">
                  {selectedLanguage.nativeName} <span className="text-gray-400 font-normal">({selectedLanguage.name})</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 rounded-xl bg-dark-700 text-white font-medium hover:bg-dark-600 transition-colors flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                View Curriculum
              </button>
              <Link 
                href={`/personalities?lang=${selectedLanguage.id}`}
                className="btn-primary px-6 py-3 flex items-center gap-2"
              >
                Begin Learning <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
