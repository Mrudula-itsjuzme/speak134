'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mic, Globe, Sparkles, Users, MessageCircle, Plane, Coffee, Briefcase, ShoppingBag, Utensils } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-dark-900">MisSpoke</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-dark-600 hover:text-dark-900 transition-colors">Features</Link>
            <Link href="#missions" className="text-dark-600 hover:text-dark-900 transition-colors">Missions</Link>
            <Link href="#testimonials" className="text-dark-600 hover:text-dark-900 transition-colors">Stories</Link>
          </div>
          
          <Link href="/languages" className="btn-primary flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-dark-900 leading-tight mb-6">
              Master a New Language.{' '}
              <span className="gradient-text">Just by Speaking.</span>
            </h1>
            <p className="text-xl text-dark-500 mb-8 max-w-lg">
              Talk to AI tutors who adapt to your voice, remember your progress, and evolve with every conversation. No memorization. Just real conversations.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/languages" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Try Free <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
            <div className="flex items-center gap-6 text-sm text-dark-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 border-2 border-white" />
                  ))}
                </div>
                <span className="font-semibold text-dark-900">10k+</span> Active Learners
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★★★★★</span>
                <span>4.9 Rating</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Placeholder for 3D Robot - Replace with actual image */}
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                    <Mic className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-dark-500">AI Tutor</p>
                </div>
              </div>
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary-500" />
                  <span className="font-semibold">8+ Languages</span>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold">AI Powered</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why MisSpoke Works */}
      <section id="features" className="py-20 bg-gray-50">
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
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white mb-4">
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
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-purple-600" />
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-400" />
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
            className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl p-12 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to speak with confidence?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are finally speaking their target language
            </p>
            <Link href="/languages" className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Mic className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-dark-900">MisSpoke</span>
          </div>
          <p className="text-dark-500 text-sm">© 2024 MisSpoke. Built for the ElevenLabs Challenge.</p>
        </div>
      </footer>
    </div>
  );
}
