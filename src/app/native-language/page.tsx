'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mic, Globe } from 'lucide-react';

interface Language {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
}

const nativeLanguages: Language[] = [
  { id: 'english', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { id: 'spanish', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { id: 'french', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { id: 'german', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { id: 'hindi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { id: 'mandarin', name: 'Mandarin', nativeName: '普通话', flag: '🇨🇳' },
  { id: 'japanese', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { id: 'korean', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { id: 'portuguese', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { id: 'italian', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { id: 'russian', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { id: 'arabic', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export default function NativeLanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedLanguage) {
      localStorage.setItem('nativeLanguage', selectedLanguage.name);
      router.push('/languages');
    }
  };

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
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What is your native language?
            </h1>
            <p className="text-xl text-gray-400">
              We'll use this to tailor your learning experience and provide translations when needed.
            </p>
          </motion.div>

          {/* Language Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-left">
            {nativeLanguages.map((language, index) => (
              <motion.div
                key={language.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedLanguage(language)}
                className={`glass rounded-xl p-4 cursor-pointer transition-all flex items-center gap-4 ${
                  selectedLanguage?.id === language.id
                    ? 'card-selected ring-2 ring-primary-500 bg-primary-500/10'
                    : 'hover:bg-white/5 hover:border-white/20'
                }`}
              >
                <span className="text-3xl">{language.flag}</span>
                <div>
                  <p className="font-bold text-white">{language.nativeName}</p>
                  <p className="text-xs text-gray-400">{language.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: selectedLanguage ? 0 : 100, opacity: selectedLanguage ? 1 : 0 }}
        className="fixed bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-lg border-t border-white/10 px-6 py-4"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Globe className="w-6 h-6 text-primary-400" />
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Your Native Language</p>
              <p className="text-lg font-bold text-white">
                {selectedLanguage?.nativeName} <span className="text-gray-400 font-normal">({selectedLanguage?.name})</span>
              </p>
            </div>
          </div>
          <button 
            onClick={handleContinue}
            className="btn-primary px-8 py-3 flex items-center gap-2 text-lg"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
