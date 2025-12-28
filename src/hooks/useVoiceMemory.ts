import { useState, useCallback } from 'react';
import { saveSession, updateUserProfile, getUserProfile } from '@/lib/memory/sessionStore';
import { generateSessionSummary } from '@/lib/gemini/client';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  correction?: string;
}

export function useVoiceMemory() {
  const [isSaving, setIsSaving] = useState(false);

  const endSession = useCallback(async (
    messages: ChatMessage[], 
    language: string, 
    personalityId: string
  ) => {
    if (messages.length === 0) return;
    
    setIsSaving(true);
    try {
      const sessionId = uuidv4();
      const startTime = messages[0].timestamp.getTime();
      const endTime = Date.now();
      
      // Convert messages to transcript for Gemini
      const transcript = messages
        .map(m => `${m.type.toUpperCase()}: ${m.content}`)
        .join('\n');

      // Generate AI summary
      const analysis = await generateSessionSummary(transcript);
      
      // Save to IndexedDB
      await saveSession({
        id: sessionId,
        startTime,
        endTime,
        language,
        personalityId,
        messages: messages.map(m => ({
          role: m.type,
          content: m.content,
          timestamp: m.timestamp.getTime(),
          correction: m.correction
        })),
        summary: analysis?.summary,
        mistakes: analysis?.mistakes || [],
        vocabulary: analysis?.vocabulary || [],
        emotions: analysis?.emotions || []
      });

      // Update User Profile
      const profile = await getUserProfile();
      const lastPractice = new Date(profile?.lastPracticeDate || 0);
      const today = new Date();
      const isConsecutiveDay = 
        today.getDate() === lastPractice.getDate() + 1 && 
        today.getMonth() === lastPractice.getMonth() &&
        today.getFullYear() === lastPractice.getFullYear();
      
      const isSameDay = 
        today.getDate() === lastPractice.getDate() && 
        today.getMonth() === lastPractice.getMonth() &&
        today.getFullYear() === lastPractice.getFullYear();

      await updateUserProfile({
        totalSessions: (profile?.totalSessions || 0) + 1,
        lastPracticeDate: Date.now(),
        streakDays: isSameDay ? (profile?.streakDays || 0) : isConsecutiveDay ? (profile?.streakDays || 0) + 1 : 1
      });

      console.log('Session saved successfully:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Failed to save session:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    endSession,
    isSaving
  };
}
