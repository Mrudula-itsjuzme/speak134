import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface SessionMemory {
  id: string;
  startTime: number;
  endTime?: number;
  language: string;
  personalityId: string;
  messages: {
    role: 'user' | 'ai';
    content: string;
    timestamp: number;
    correction?: string;
    confidence?: number;
  }[];
  confidenceScores: number[];
  summary?: string;
  mistakes: string[];
  vocabulary: string[];
  emotions: string[];
  avgConfidence?: number;
  patterns?: {
    pronunciation?: string[];
    grammar?: string[];
    vocabulary?: string[];
    commonMistakes?: string[];
    strengths?: string[];
    weaknesses?: string[];
  };
}

export interface User {
  email: string;
  password?: string;
  name: string;
  nativeLanguage?: string;
  learningLanguage?: string;
  createdAt: number;
}

export interface UserProfile {
  id: string;
  currentLevel: string;
  totalSessions: number;
  streakDays: number;
  lastPracticeDate: number;
  avgConfidenceScore: number;
  learnedPatterns: {
    strengths: string[];
    weaknesses: string[];
  };
}

interface MisSpokeDB extends DBSchema {
  sessions: {
    key: string;
    value: SessionMemory;
    indexes: { 'by-date': number };
  };
  userProfile: {
    key: string;
    value: UserProfile;
  };
  users: {
    key: string;
    value: User;
  };
  curriculumProgress: {
    key: string;
    value: {
      lang: string;
      items: { id: string; status: 'completed' | 'in-progress' | 'locked' }[];
      lastUpdated: number;
    };
  };
}

const DB_NAME = 'misspoke-db';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<MisSpokeDB>>;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<MisSpokeDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionStore.createIndex('by-date', 'startTime');
        }

        // User profile store
        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'id' });
        }


        // Users store
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'email' });
        }

        // Curriculum progress store
        if (!db.objectStoreNames.contains('curriculumProgress')) {
          db.createObjectStore('curriculumProgress', { keyPath: 'lang' });
        }
      },
    });
  }
  return dbPromise;
};

export const saveSession = async (session: SessionMemory) => {
  const db = await getDB();
  await db.put('sessions', session);
};

export const getSession = async (id: string) => {
  const db = await getDB();
  return db.get('sessions', id);
};

export const getAllSessions = async () => {
  const db = await getDB();
  return db.getAllFromIndex('sessions', 'by-date');
};

export const updateUserProfile = async (updates: Partial<MisSpokeDB['userProfile']['value']>) => {
  const db = await getDB();
  const current = await db.get('userProfile', 'default') || {
    id: 'default',
    currentLevel: 'Beginner',
    totalSessions: 0,
    streakDays: 0,
    lastPracticeDate: Date.now(),
    avgConfidenceScore: 0,
    learnedPatterns: { strengths: [], weaknesses: [] }
  };

  await db.put('userProfile', { ...current, ...updates });
};

export const getUserProfile = async () => {
  const db = await getDB();
  return db.get('userProfile', 'default');
};

export const saveCurriculumProgress = async (lang: string, items: { id: string; status: 'completed' | 'in-progress' | 'locked' }[]) => {
  const db = await getDB();
  await db.put('curriculumProgress', {
    lang,
    items,
    lastUpdated: Date.now()
  });
};

export const getCurriculumProgress = async (lang: string) => {
  const db = await getDB();
  return db.get('curriculumProgress', lang);
};

export const getLatestSession = async (lang: string) => {
  const db = await getDB();
  const allSessions = await db.getAllFromIndex('sessions', 'by-date');
  return allSessions.reverse().find(s => s.language === lang);
};

import { hashPassword } from '../utils/security';

// Auth helpers
export const registerUser = async (user: MisSpokeDB['users']['value']) => {
  const db = await getDB();
  const hashedPassword = user.password ? await hashPassword(user.password) : undefined;
  await db.put('users', { ...user, password: hashedPassword, createdAt: Date.now() });
};

export const getUser = async (email: string) => {
  const db = await getDB();
  return db.get('users', email);
};

export const updateUser = async (email: string, updates: Partial<User>) => {
  const db = await getDB();
  const user = await db.get('users', email);
  if (user) {
    await db.put('users', { ...user, ...updates });
  }
};

export const setLoggedInUser = (email: string) => {
  localStorage.setItem('currentUser', email);
};

export const getLoggedInUser = () => {
  return localStorage.getItem('currentUser');
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};
