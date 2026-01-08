'use client';


import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mic, Globe, Sparkles, Users, MessageCircle, Plane, Coffee, Briefcase, ShoppingBag, Utensils, Clock, Flame } from 'lucide-react';
import Header from '@/components/Header';

export default function LandingPage() {

  const featuredLanguages = [
    {
      code: 'ES',
      name: 'Español',
      sub: 'Spanish',
      level: 'Beginner Friendly',
      levelColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      hours: '~600 hrs',
      learners: '1.2M+',
      popularity: 98,
      feature: 'Real-world convo focus',
      gradient: 'from-primary-500/10 to-transparent'
    },
    {
      code: 'FR',
      name: 'Français',
      sub: 'French',
      level: 'Intermediate',
      levelColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      hours: '~750 hrs',
      learners: '850k+',
      popularity: 85,
      feature: 'Culture & Literature',
      gradient: 'from-primary-500/10 to-transparent'
    },
    {
      code: 'JP',
      name: '日本語',
      sub: 'Japanese',
      level: 'Advanced',
      levelColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      hours: '~2200 hrs',
      learners: '920k+',
      popularity: 90,
      feature: 'Kanji Writer',
      gradient: 'from-primary-500/10 to-transparent'
    },
    {
      code: 'DE',
      name: 'Deutsch',
      sub: 'German',
      level: 'Intermediate',
      levelColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      hours: '~750 hrs',
      learners: '600k+',
      popularity: 70,
      feature: 'Technical Vocab',
      gradient: 'from-primary-500/10 to-transparent'
    }
  ];

  return (
    <div className="min-h-screen bg-[#C8BCB3] dark:bg-dark-900 overflow-hidden font-sans selection:bg-black selection:text-white">
      <Header />

      {/* Hero Section - Matching Reference */}
      <section className="relative pt-40 pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh]">
        {/* Decorative Floating Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-32 left-[15%] text-4xl font-light text-dark-900/40 pointer-events-none"
        >
          +
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-48 right-[15%] text-5xl font-light text-dark-900/40 pointer-events-none"
        >
          +
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12vw] md:text-[180px] leading-none font-medium tracking-tighter text-[#2a2a2a] dark:text-white text-center mb-12"
        >
          MisSpoke
        </motion.h1>

        {/* Floating Pill CTA */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative z-10"
        >
          <Link href="/native-language" className="group relative">
            <div className="absolute inset-0 bg-primary-900 rounded-full blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative bg-[#A89B93] text-[#2a2a2a] px-12 py-4 rounded-full text-xl font-semibold shadow-2xl hover:scale-105 transition-transform border border-black/5 flex items-center gap-3">
              Master a New Language, Just by Speaking!
            </div>
          </Link>
        </motion.div>

        {/* Language Cards Grid - Overlapping bottom */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-24 w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4"
        >
          {featuredLanguages.map((lang, i) => (
            <div key={lang.code} className="group relative bg-[#1e293b] rounded-3xl p-6 border border-white/10 hover:-translate-y-2 transition-transform duration-500 shadow-2xl">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${lang.gradient} rounded-3xl opacity-50`} />

              {/* Header */}
              <div className="relative flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{lang.name}</h3>
                  <p className="text-gray-400 text-sm">{lang.sub}</p>
                </div>
                <span className="text-4xl font-bold text-white/5 select-none absolute -top-2 right-0">{lang.code}</span>
              </div>

              {/* Badge */}
              <div className={`relative inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border mb-6 ${lang.levelColor}`}>
                {lang.level}
              </div>

              {/* Stats */}
              <div className="relative grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium text-stone-200">{lang.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-200">{lang.learners}</span>
                </div>
              </div>

              {/* Popularity */}
              <div className="relative mb-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Popularity</span>
                  <span className="text-white font-bold">{lang.popularity}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.popularity}%` }}
                    transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                    className="h-full bg-primary-500 rounded-full"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="relative pt-4 border-t border-white/5 flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-wide">
                <Flame className="w-3 h-3" />
                {lang.feature}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Why MisSpoke Works */}
      <section id="features" className="py-24 bg-white dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-dark-900 mb-4">Why MisSpoke Works</h2>
            <p className="text-xl text-dark-500 max-w-2xl mx-auto">
              AI-driven conversation practice that adapts to your unique learning style
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Mic className="w-8 h-8" />,
                title: 'Voice First',
                description: 'Speak naturally and learn through real conversations, not flashcards'
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Adaptive AI',
                description: 'AI that remembers your mistakes and adapts difficulty in real-time'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Cultural Wisdom',
                description: 'Learn cultural context and idioms native speakers actually use'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Live Coaching',
                description: 'Get instant pronunciation feedback and correction'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-light rounded-2xl p-6 card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-dark-900 mb-2">{feature.title}</h3>
                <p className="text-dark-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Voice Missions */}
      <section id="missions" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold text-dark-900 mb-4">Interactive Voice Missions</h2>
              <p className="text-xl text-dark-500">Practice real-world scenarios with AI role-play</p>
            </div>
            <Link href="/missions" className="hidden md:flex items-center gap-2 text-primary-500 font-semibold hover:gap-3 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Coffee className="w-6 h-6" />, title: 'Café Order', image: 'coffee', difficulty: 'Beginner' },
              { icon: <Briefcase className="w-6 h-6" />, title: 'Job Interview', image: 'interview', difficulty: 'Advanced' },
              { icon: <Plane className="w-6 h-6" />, title: 'Travel Help', image: 'travel', difficulty: 'Intermediate' },
              { icon: <Utensils className="w-6 h-6" />, title: 'Restaurant', image: 'restaurant', difficulty: 'Beginner' },
              { icon: <ShoppingBag className="w-6 h-6" />, title: 'Shopping', image: 'shopping', difficulty: 'Beginner' },
              { icon: <MessageCircle className="w-6 h-6" />, title: 'Free Conversation', image: 'chat', difficulty: 'All Levels' },
            ].map((mission, index) => (
              <motion.div
                key={mission.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer card-hover"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-stone-800" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      {mission.icon}
                    </div>
                    <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-1 rounded-full">
                      {mission.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{mission.title}</h3>
                </div>
                <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-dark-900 mb-4">Success Stories</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'Business Professional',
                quote: "I went from basic to conversational Spanish in just 3 months. The AI tutor feels like a patient friend who never judges.",
                avatar: '/avatars/sarah.jpg'
              },
              {
                name: 'Marcus Johnson',
                role: 'Travel Enthusiast',
                quote: "Finally, an app that focuses on SPEAKING. I used MisSpoke before my Japan trip and could actually hold conversations!",
                avatar: '/avatars/marcus.jpg'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Language Student',
                quote: "The personality system is genius. My tutor adapts to my mood and energy level. Some days I need encouragement, others I want a challenge.",
                avatar: '/avatars/emily.jpg'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-light rounded-2xl p-6"
              >
                <p className="text-dark-600 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600" />
                  <div>
                    <p className="font-semibold text-dark-900">{testimonial.name}</p>
                    <p className="text-sm text-dark-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-500 to-primary-800 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to speak with confidence?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are finally speaking their target language
            </p>
            <Link href="/native-language" className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Mic className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-dark-900">MisSpoke</span>
          </div>
          <p className="text-dark-500 text-sm">© 2026 MisSpoke. Built for the ElevenLabs Challenge.</p>
        </div>
      </footer>
    </div>
  );
}
