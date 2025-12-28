'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Mic, MicOff, Phone, PhoneOff, Volume2, Languages, 
  CheckCircle, PlayCircle, Lock, MoreVertical,
  LogOut, User
} from 'lucide-react';
import { useConversation } from '@11labs/react';
import { useVoiceMemory } from '@/hooks/useVoiceMemory';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  correction?: string;
  timestamp: Date;
}

interface RoadmapItem {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'locked';
}

const roadmapItems: RoadmapItem[] = [
  { id: 'greetings', title: 'Greetings', status: 'completed' },
  { id: 'introductions', title: 'Introductions', status: 'completed' },
  { id: 'basic-phrases', title: 'Basic Phrases', status: 'in-progress' },
  { id: 'numbers', title: 'Numbers', status: 'locked' },
  { id: 'colors-objects', title: 'Colors & Objects', status: 'locked' },
  { id: 'food-drinks', title: 'Food & Drinks', status: 'locked' },
  { id: 'daily-routine', title: 'Daily Routine', status: 'locked' },
  { id: 'travel', title: 'Travel', status: 'locked' },
];

export default function LearnPage() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'spanish';
  const personality = searchParams.get('personality') || 'cheerful';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hola! ¿Cómo estás hoy? Let's practice ordering coffee.",
      timestamp: new Date('2024-01-01T12:00:00')
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // ElevenLabs Conversation Hook
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setIsConnected(true);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setIsConnected(false);
    },
    onMessage: (message: { message?: string; source?: string }) => {
      console.log('Message:', message);
      if (message.message) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: message.source === 'user' ? 'user' : 'ai',
          content: message.message as string,
          timestamp: new Date()
        }]);
      }
    },
    onError: (error: string | Error) => {
      console.error('ElevenLabs error:', error);
    }
  });

  const startConversation = useCallback(async () => {
    try {
      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
      console.log('Starting conversation with Agent ID:', agentId ? `${agentId.slice(0, 5)}...` : 'MISSING');
      
      if (!agentId) {
        throw new Error('NEXT_PUBLIC_ELEVENLABS_AGENT_ID is missing in environment variables');
      }

      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the conversation with the agent
      await conversation.startSession({
        agentId: agentId,
        // @ts-ignore - connectionType might be an enum, using string for now
        connectionType: 'websocket', 
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      // Log more details if available
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Unknown error object:', JSON.stringify(error, null, 2));
      }
    }
  }, [conversation]);

  const { endSession: saveSessionToMemory } = useVoiceMemory();

  // Send initial context when connected
  useEffect(() => {
    if (isConnected) {
      // Try to send context to the agent
      // Note: This depends on the agent being configured to accept text input or instructions
      const contextMessage = `The user is learning ${lang}. Act as a ${personality} tutor.`;
      console.log('Sending context:', contextMessage);
      
      // Attempt to send hidden context message if supported
      // @ts-ignore - checking for method existence
      if (typeof conversation.sendMessage === 'function') {
        // @ts-ignore
        conversation.sendMessage(contextMessage);
      }
    }
  }, [isConnected, lang, personality, conversation]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
    // Save session to memory
    await saveSessionToMemory(messages, lang, personality);
  }, [conversation, messages, lang, personality, saveSessionToMemory]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      conversation.setVolume({ volume: 1 });
    } else {
      conversation.setVolume({ volume: 0 });
    }
    setIsMuted(!isMuted);
  }, [conversation, isMuted]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Send text to ElevenLabs if supported
    // @ts-ignore
    if (isConnected && typeof conversation.sendMessage === 'function') {
      // @ts-ignore
      await conversation.sendMessage(inputValue);
    }
  };

  const completedCount = roadmapItems.filter(item => item.status === 'completed').length;
  const progressPercentage = Math.round((completedCount / roadmapItems.length) * 100);

  return (
    <div className="min-h-screen bg-dark-900 dark flex flex-col">
      {/* Navigation */}
      <nav className="bg-dark-900/80 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MisSpoke</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/learn" className="text-primary-400 font-medium">Lessons</Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">Profile</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-800 text-gray-300 hover:bg-dark-700 transition-colors">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Topic Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Conversation Practice</h1>
              <p className="text-gray-400">Topic: Ordering Coffee in Spanish</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 font-medium">AI ONLINE</span>
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
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'ai' 
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
                          Listen
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white text-sm transition-colors">
                          <Languages className="w-4 h-4" />
                          Translate
                        </button>
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
                  placeholder="Talk to MisSpoke !!"
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
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isConnected 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <Phone className="w-5 h-5" />
                {isConnected ? 'Connected' : 'Join Call'}
              </button>
              
              <button
                onClick={isConnected ? endConversation : undefined}
                disabled={!isConnected}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isConnected
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                    : 'bg-dark-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <PhoneOff className="w-5 h-5" />
                Leave
              </button>
            </div>
          </div>
        </div>

        {/* Roadmap Sidebar */}
        <div className="w-80 border-l border-white/10 p-6 hidden lg:block">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Your Roadmap</h2>
            <button className="text-gray-400 hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Level 1: Spanish Basics</span>
              <span className="text-green-400 font-medium">{progressPercentage}% Complete</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {roadmapItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  item.status === 'in-progress'
                    ? 'bg-primary-500/20 border border-primary-500/30'
                    : item.status === 'completed'
                    ? 'bg-dark-800'
                    : 'bg-dark-800/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.status === 'completed'
                    ? 'bg-green-500/20 text-green-400'
                    : item.status === 'in-progress'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-gray-500'
                }`}>
                  {item.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : item.status === 'in-progress' ? (
                    <PlayCircle className="w-5 h-5" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    item.status === 'locked' ? 'text-gray-500' : 'text-white'
                  }`}>
                    {item.title}
                  </p>
                  <p className={`text-xs ${
                    item.status === 'completed'
                      ? 'text-green-400'
                      : item.status === 'in-progress'
                      ? 'text-primary-400'
                      : 'text-gray-500'
                  }`}>
                    {item.status === 'completed' ? 'COMPLETED' : 
                     item.status === 'in-progress' ? 'IN PROGRESS' : 'LOCKED'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Mic Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={isConnected ? toggleMute : startConversation}
        className={`fixed bottom-24 right-8 w-16 h-16 rounded-full shadow-glow-lg flex items-center justify-center transition-colors ${
          isConnected
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
