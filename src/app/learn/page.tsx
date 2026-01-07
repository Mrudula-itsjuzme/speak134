
'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import {
  Mic, MicOff, Phone, PhoneOff, Volume2, Languages as LanguagesIcon,
  User, X
} from 'lucide-react';

import { useConversation } from '@11labs/react';
import { useVoiceMemory } from '@/hooks/useVoiceMemory';
import { getLatestSession } from '@/lib/memory/sessionStore';
import Header from '@/components/Header';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  translation?: string;
  isTranslating?: boolean;
  correction?: string;
  timestamp: Date;
}


function LearnPageContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'spanish';
  const personality = searchParams.get('personality') || 'cheerful';

  const [topic] = useState('Immersive Daily Conversation');
  const [level] = useState('Beginner');

  // Load Latest Chat History on mount
  useEffect(() => {
    const loadSessionData = async () => {
      const lastSession = await getLatestSession(lang);
      if (lastSession && lastSession.messages.length > 0) {
        setMessages(lastSession.messages.map((m: { role: string; content: string; timestamp: number; correction?: string }) => ({
          id: uuidv4(),
          type: m.role as 'ai' | 'user',
          content: m.content,
          timestamp: new Date(m.timestamp),
          correction: m.correction
        })));
      } else {
        setMessages([
          {
            id: '1',
            type: 'ai',
            content: `Hello! I am your ${personality} ${lang} tutor. Ready to practice?`,
            timestamp: new Date()
          }
        ]);
      }
    };
    loadSessionData();
  }, [lang, personality]);

  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const [agentConfig, setAgentConfig] = useState<{ systemPrompt: string; firstMessage: string } | null>(null);

  const [nativeLanguage, setNativeLanguage] = useState('English');
  const [uiTranslations, setUiTranslations] = useState<Record<string, string>>({
    'practice': 'Conversation Practice',
    'topic': 'Topic',
    'online': 'AI ONLINE',
    'roadmap': 'Your Roadmap',
    'complete': 'Complete',
    'completed': 'COMPLETED',
    'in_progress': 'IN PROGRESS',
    'locked': 'LOCKED',
    'listen': 'Listen',
    'translate': 'Translate',
    'connected': 'Connected',
    'join': 'Join Call',
    'leave': 'Leave',
    'placeholder': 'Talk to MisSpoke !!'
  });

  const t = (key: string) => {
    return uiTranslations[key] || key;
  };

  // Fetch UI translations
  useEffect(() => {
    const fetchTranslations = async () => {
      const nativeLang = localStorage.getItem('nativeLanguage') || 'English';
      setNativeLanguage(nativeLang);

      if (nativeLang === 'English') return;

      try {
        const response = await fetch('/api/translate-ui', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetLanguage: nativeLang })
        });
        const data = await response.json();
        setUiTranslations(data);
      } catch (error) {
        console.error('Failed to fetch translations:', error);
      }
    };

    fetchTranslations();
  }, []);

  // Fetch dynamic prompt from Gemini
  useEffect(() => {
    const fetchPrompt = async () => {
      const nativeLang = localStorage.getItem('nativeLanguage') || 'English';
      // setNativeLanguage(nativeLang); // Already set in fetchTranslations
      try {
        const response = await fetch('/api/prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: lang,
            nativeLanguage: nativeLang,
            personality: personality,
            topic: 'Immersive Daily Conversation',
            level: 'Beginner'
          })
        });
        const data = await response.json();
        setAgentConfig(data);

        // Update the initial message only if no history exists
        setMessages(prev => {
          if (prev.length === 0) {
            return [{
              id: uuidv4(),
              type: 'ai',
              content: data.firstMessage,
              timestamp: new Date()
            }];
          }
          return prev;
        });
      } catch (error) {
        console.error('Failed to fetch prompt:', error);
      }
    };

    fetchPrompt();
  }, [lang, personality, topic, level]);

  // ElevenLabs Conversation Hook
  const conversation = useConversation({
    onConnect: () => {
      setIsConnected(true);
    },
    onDisconnect: () => {
      setIsConnected(false);
      setIsEnding(false);
    },
    onMessage: (message: { message?: string; source?: string }) => {
      if (message.message) {
        setMessages(prev => [...prev, {
          id: uuidv4(),
          type: message.source === 'user' ? 'user' : 'ai',
          content: message.message as string,
          timestamp: new Date()
        }]);
      }
    },
    onError: (error: string | Error) => {
      const errorMessage = typeof error === 'string' ? error : error.message;
      if (errorMessage.includes('CLOSING') || errorMessage.includes('CLOSED')) {
        console.warn('Benign ElevenLabs WebSocket closure caught:', errorMessage);
        return;
      }
      console.error('ElevenLabs error:', error);
    }
  });

  const { endSession: saveSessionToMemory, isSaving } = useVoiceMemory();

  // Send initial context when connected
  useEffect(() => {
    if (isConnected && agentConfig) {
      // Try to send context to the agent
      const contextMessage = `System Update: ${agentConfig.systemPrompt}`;

      // Attempt to send hidden context message if supported
      // @ts-ignore
      if (typeof conversation.sendMessage === 'function') {
        // @ts-ignore
        // conversation.sendMessage(contextMessage);
      }
    }
  }, [isConnected, agentConfig, conversation]);

  const startConversation = useCallback(async () => {
    try {
      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

      if (!agentId) {
        throw new Error('NEXT_PUBLIC_ELEVENLABS_AGENT_ID is missing');
      }

      await navigator.mediaDevices.getUserMedia({ audio: true });

      await conversation.startSession({
        agentId: agentId,
        // @ts-ignore
        connectionType: 'websocket',
        dynamicVariables: {
          language: lang,
          personality: personality,
          level: level,
          topic: topic,
          // Pass brief history context
          history: messages.slice(-10).map(m => `${m.type === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n')
        }
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation, agentConfig, lang, personality, level, topic, messages]);

  const endConversation = useCallback(async () => {
    if (isEnding) return;
    setIsEnding(true);

    try {
      // Try to end session gracefully
      if (conversation.status === 'connected') {
        await conversation.endSession();
      }
    } catch (error) {
      console.warn('Caught WebSocket error during disconnect (expected):', error);
      setIsEnding(false);
    } finally {
      // isEnding and isConnected will be handled by onDisconnect
      // Always try to save session to memory even if WebSocket fails
      await saveSessionToMemory(messages, lang, personality, 'Immersive Daily Conversation');
    }
  }, [conversation, messages, lang, personality, saveSessionToMemory, isEnding]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      conversation.setVolume({ volume: 1 });
    } else {
      conversation.setVolume({ volume: 0 });
    }
    setIsMuted(!isMuted);
  }, [conversation, isMuted]);

  const handleTranslate = async (messageId: string, content: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isTranslating: true } : msg
    ));

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          targetLanguage: nativeLanguage
        })
      });
      const data = await response.json();
      if (data.translation) {
        setMessages(prev => prev.map(msg =>
          msg.id === messageId ? { ...msg, translation: data.translation, isTranslating: false } : msg
        ));
      } else {
        throw new Error(data.error || 'Translation failed');
      }
    } catch (error) {
      console.error('Failed to translate:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === messageId ? { ...msg, isTranslating: false } : msg
      ));
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue('');

    // Send text to AI
    if (isConnected && conversation.status === 'connected') {
      // @ts-ignore
      await conversation.sendUserMessage(inputValue);
    } else {
      // Use text-only chat
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages, // Send the newly updated history
            language: lang,
            personality: personality,
            topic: topic,
            level: level
          })
        });
        const data = await response.json();

        if (!response.ok) {
          console.error('❌ Chat API Error:', response.status, data);
          setMessages(prev => [...prev, {
            id: uuidv4(),
            type: 'ai',
            content: `Error: ${data.error || 'Failed to get response'}. Check console for details.`,
            timestamp: new Date()
          }]);
          return;
        }

        if (data.content) {
          setMessages(prev => [...prev, {
            id: uuidv4(),
            type: 'ai',
            content: data.content,
            timestamp: new Date()
          }]);
        } else {
          console.warn('⚠️ No content in response:', data);
        }
      } catch (error) {
        console.error('Failed to send text message:', error);
      } finally {
      }
    }

  };


  return (
    <div className="min-h-screen bg-dark-900 dark flex flex-col pt-20">
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Topic Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{t('practice')}</h1>
              <p className="text-gray-400">{t('topic')}: Immersive Daily Conversation</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 font-medium">{t('online')}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className={`max-w-md ${message.type === 'user' ? 'order-first' : ''}`}>
                    <p className="text-xs text-gray-500 mb-1">
                      {message.type === 'ai' ? 'MisSpoke AI' : 'You'}
                    </p>
                    <div className={`rounded-2xl px-4 py-3 ${message.type === 'ai'
                      ? 'bg-dark-800 text-white'
                      : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                      }`}>
                      <p>{message.content}</p>
                      {message.correction && (
                        <p className="mt-2 text-green-400 italic">&apos;{message.correction}&apos;</p>
                      )}
                    </div>

                    {message.type === 'ai' && (
                      <div className="flex gap-2 mt-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white text-sm transition-colors">
                          <Volume2 className="w-4 h-4" />
                          {t('listen')}
                        </button>
                        <button
                          onClick={() => handleTranslate(message.id, message.content)}
                          disabled={message.isTranslating}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white text-sm transition-colors"
                        >
                          <LanguagesIcon className="w-4 h-4" />
                          {message.isTranslating ? 'Translating...' : t('translate')}
                        </button>
                      </div>
                    )}
                    {message.translation && (
                      <div className="mt-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-sm italic text-primary-300 shadow-inner">
                        <span className="opacity-50 text-[10px] uppercase font-bold block mb-1">Translation ({nativeLanguage})</span>
                        "{message.translation}"
                      </div>
                    )}
                  </div>

                  {message.type === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex-shrink-0 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t('placeholder')}
                  className="w-full bg-dark-800 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>

              <button
                onClick={isConnected ? endConversation : startConversation}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${isConnected
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
              >
                <Phone className="w-5 h-5" />
                {isEnding || isSaving ? 'Saving...' : (isConnected ? t('connected') : t('join'))}
              </button>

              <button
                onClick={isConnected ? endConversation : undefined}
                disabled={!isConnected}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${isConnected
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-dark-800 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <PhoneOff className="w-5 h-5" />
                {isEnding || isSaving ? '...' : t('leave')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Overlay */}
      <AnimatePresence>
        {isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-900/95 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center p-8"
          >
            <button
              onClick={endConversation}
              className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-10 h-10" />
            </button>

            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">{t('practice')}</h2>
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-medium border border-primary-500/30">
                  {lang}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                <span className="text-gray-400 font-medium">{topic}</span>
              </div>
            </div>

            {/* Voice Chat Messages */}
            <div className="w-full max-w-2xl flex-1 overflow-y-auto mb-8 px-4 space-y-4 scroll-smooth custom-scrollbar">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-lg ${message.type === 'user'
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                      : 'bg-dark-800 text-white border border-white/5'
                      }`}>
                      <p className="text-sm font-medium opacity-70 mb-1">
                        {message.type === 'ai' ? 'MisSpoke AI' : 'You'}
                      </p>
                      <p className="text-lg leading-relaxed">{message.content}</p>
                      {message.type === 'ai' && (
                        <button
                          onClick={() => handleTranslate(message.id, message.content)}
                          disabled={message.isTranslating}
                          className="mt-2 text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                        >
                          <LanguagesIcon className="w-3 h-3" />
                          {message.isTranslating ? 'Translating...' : (message.translation ? 'Re-translate' : 'Translate')}
                        </button>
                      )}
                      {message.translation && (
                        <p className="mt-2 pt-2 border-t border-white/10 text-sm italic text-gray-300 bg-white/5 p-2 rounded-lg">
                          <span className="text-[9px] uppercase font-bold text-primary-400 block mb-1 opacity-70">{nativeLanguage}</span>
                          {message.translation}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Voice Visualizer Area */}
            <div className="relative flex flex-col items-center">
              {/* Voice Visualizer */}
              <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                {/* Outer Pulse Rings */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-primary-500"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute inset-4 rounded-full bg-purple-500"
                />

                {/* Core Visualizer */}
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 shadow-glow-lg flex items-center justify-center z-10">
                  <div className="flex items-end gap-1 h-8">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: isConnected && !isMuted ? [8, 32, 8] : 4
                        }}
                        transition={{
                          duration: 0.5 + i * 0.1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-1 bg-white rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xl text-white font-semibold mb-6 tracking-wide">
                  {conversation.isSpeaking ? `${personality} ${lang} tutor is speaking...` : "Listening carefully..."}
                </p>

                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={toggleMute}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white'
                      }`}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={endConversation}
                    disabled={isEnding || isSaving}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isEnding || isSaving ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                      }`}
                  >
                    {isEnding || isSaving ? <span className="animate-spin text-white">⏳</span> : <PhoneOff className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mic Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={isConnected ? toggleMute : startConversation}
        className={`fixed bottom-24 right-8 w-16 h-16 rounded-full shadow-glow-lg flex items-center justify-center transition-colors z-[90] ${isConnected
          ? isMuted
            ? 'bg-red-500'
            : 'bg-gradient-to-br from-primary-500 to-purple-500'
          : 'bg-gradient-to-br from-primary-500 to-purple-500'
          }`}
      >
        {isMuted ? (
          <MicOff className="w-7 h-7 text-white" />
        ) : (
          <Mic className="w-7 h-7 text-white" />
        )}

        {/* Pulse animation when connected */}
        {isConnected && !isMuted && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary-500 voice-pulse" />
            <span className="absolute inset-0 rounded-full bg-primary-500 voice-pulse" style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </motion.button>
    </div>
  );
}


export default function LearnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Loading...</div>}>
      <LearnPageContent />
    </Suspense>
  );
}
