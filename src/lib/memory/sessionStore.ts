import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SessionMemory {
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
  }[];
  summary?: string;
  mistakes: string[];
  vocabulary: string[];
  emotions: string[];
}

interface MisSpokeDB extends DBSchema {
  sessions: {
    key: string;
    value: SessionMemory;
    indexes: { 'by-date': number };
  };
  userProfile: {
    key: string;
    value: {
      id: string;
      currentLevel: string;
      totalSessions: number;
      streakDays: number;
      lastPracticeDate: number;
    };
  };
}

const DB_NAME = 'misspoke-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<MisSpokeDB>>;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<MisSpokeDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Sessions store
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
        sessionStore.createIndex('by-date', 'startTime');

        // User profile store
        db.createObjectStore('userProfile', { keyPath: 'id' });
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
  };
  
  await db.put('userProfile', { ...current, ...updates });
};

export const getUserProfile = async () => {
  const db = await getDB();
  return db.get('userProfile', 'default');
};
