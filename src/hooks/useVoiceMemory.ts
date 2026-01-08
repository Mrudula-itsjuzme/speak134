import { useState, useCallback } from 'react';
import { saveSession, updateUserProfile, getUserProfile } from '@/lib/memory/sessionStore';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  correction?: string;
  confidence?: number;
}

export function useVoiceMemory() {
  const [isSaving, setIsSaving] = useState(false);

  const endSession = useCallback(async (
    messages: ChatMessage[],
    language: string,
    personalityId: string,
    confidenceScores: number[] = []
  ) => {
    if (messages.length === 0) return;

    setIsSaving(true);
    try {
      const sessionId = uuidv4();
      const startTime = messages[0].timestamp.getTime();
      const endTime = Date.now();

      // Calculate average confidence
      const avgConfidence = confidenceScores.length > 0
        ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
        : 0;

      // Convert messages to transcript for Gemini
      const transcript = messages
        .map(m => `${m.type.toUpperCase()}: ${m.content}`)
        .join('\n');

      // Generate AI summary via server API
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      const analysis = await response.json();

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
          correction: m.correction,
          confidence: m.confidence
        })),
        confidenceScores,
        summary: analysis?.summary,
        mistakes: analysis?.mistakes || [],
        vocabulary: analysis?.vocabulary || [],
        emotions: analysis?.emotions || [],
        avgConfidence: avgConfidence,
        patterns: analysis?.patterns
      });


      // Update User Profile
      const profile = await getUserProfile();
      const lastPractice = new Date(profile?.lastPracticeDate || 0);
      const today = new Date();

      // Calculate day difference using milliseconds for accuracy across month/year boundaries
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      const lastPracticeStart = new Date(lastPractice.getFullYear(), lastPractice.getMonth(), lastPractice.getDate()).getTime();
      const daysDiff = Math.floor((todayStart - lastPracticeStart) / ONE_DAY_MS);

      const isConsecutiveDay = daysDiff === 1;
      const isSameDay = daysDiff === 0;

      const newTotalSessions = (profile?.totalSessions || 0) + 1;
      const newAvgConfidence = profile?.avgConfidenceScore
        ? (profile.avgConfidenceScore * (newTotalSessions - 1) + (avgConfidence || 0)) / newTotalSessions
        : (avgConfidence || 0);

      await updateUserProfile({
        totalSessions: newTotalSessions,
        lastPracticeDate: Date.now(),
        streakDays: isSameDay ? (profile?.streakDays || 0) : isConsecutiveDay ? (profile?.streakDays || 0) + 1 : 1,
        avgConfidenceScore: newAvgConfidence,
        learnedPatterns: {
          strengths: Array.from(new Set([...(profile?.learnedPatterns?.strengths || []), ...(analysis?.patterns?.strengths || [])])),
          weaknesses: Array.from(new Set([...(profile?.learnedPatterns?.weaknesses || []), ...(analysis?.patterns?.weaknesses || [])]))
        }
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
