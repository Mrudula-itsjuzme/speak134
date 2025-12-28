export interface RoadmapItem {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'locked';
}

export interface Curriculum {
  level: string;
  topic: string;
  initialMessage: string;
  items: RoadmapItem[];
}

export const curriculums: Record<string, Curriculum> = {
  spanish: {
    level: 'Level 1: Spanish Basics',
    topic: 'Ordering Coffee in Spanish',
    initialMessage: "Hola! ¿Cómo estás hoy? Let's practice ordering coffee.",
    items: [
      { id: 'greetings', title: 'Greetings', status: 'completed' },
      { id: 'introductions', title: 'Introductions', status: 'completed' },
      { id: 'basic-phrases', title: 'Basic Phrases', status: 'in-progress' },
      { id: 'numbers', title: 'Numbers', status: 'locked' },
      { id: 'colors-objects', title: 'Colors & Objects', status: 'locked' },
      { id: 'food-drinks', title: 'Food & Drinks', status: 'locked' },
      { id: 'daily-routine', title: 'Daily Routine', status: 'locked' },
      { id: 'travel', title: 'Travel', status: 'locked' },
    ]
  },
  french: {
    level: 'Level 1: French Basics',
    topic: 'Ordering Coffee in French',
    initialMessage: "Bonjour! Comment allez-vous? Let's practice ordering coffee.",
    items: [
      { id: 'greetings', title: 'Salutations', status: 'completed' },
      { id: 'introductions', title: 'Présentations', status: 'completed' },
      { id: 'basic-phrases', title: 'Phrases de base', status: 'in-progress' },
      { id: 'numbers', title: 'Nombres', status: 'locked' },
      { id: 'colors-objects', title: 'Couleurs et Objets', status: 'locked' },
      { id: 'food-drinks', title: 'Nourriture et Boissons', status: 'locked' },
      { id: 'daily-routine', title: 'Routine Quotidienne', status: 'locked' },
      { id: 'travel', title: 'Voyage', status: 'locked' },
    ]
  },
  german: {
    level: 'Level 1: German Basics',
    topic: 'Ordering Coffee in German',
    initialMessage: "Hallo! Wie geht es Ihnen? Let's practice ordering coffee.",
    items: [
      { id: 'greetings', title: 'Begrüßungen', status: 'completed' },
      { id: 'introductions', title: 'Vorstellungen', status: 'completed' },
      { id: 'basic-phrases', title: 'Grundlegende Sätze', status: 'in-progress' },
      { id: 'numbers', title: 'Zahlen', status: 'locked' },
      { id: 'colors-objects', title: 'Farben & Objekte', status: 'locked' },
      { id: 'food-drinks', title: 'Essen & Trinken', status: 'locked' },
      { id: 'daily-routine', title: 'Tagesablauf', status: 'locked' },
      { id: 'travel', title: 'Reisen', status: 'locked' },
    ]
  },
  italian: {
    level: 'Level 1: Italian Basics',
    topic: 'Ordering Coffee in Italian',
    initialMessage: "Ciao! Come stai? Let's practice ordering coffee.",
    items: [
      { id: 'greetings', title: 'Saluti', status: 'completed' },
      { id: 'introductions', title: 'Presentazioni', status: 'completed' },
      { id: 'basic-phrases', title: 'Frasi Base', status: 'in-progress' },
      { id: 'numbers', title: 'Numeri', status: 'locked' },
      { id: 'colors-objects', title: 'Colori e Oggetti', status: 'locked' },
      { id: 'food-drinks', title: 'Cibo e Bevande', status: 'locked' },
      { id: 'daily-routine', title: 'Routine Quotidiana', status: 'locked' },
      { id: 'travel', title: 'Viaggi', status: 'locked' },
    ]
  },
  japanese: {
    level: 'Level 1: Japanese Basics',
    topic: 'Ordering Coffee in Japanese',
    initialMessage: "Konnichiwa! Genki desu ka? Let's practice ordering coffee.",
    items: [
      { id: 'greetings', title: 'Aisatsu (Greetings)', status: 'completed' },
      { id: 'introductions', title: 'Jikoshoukai (Intros)', status: 'completed' },
      { id: 'basic-phrases', title: 'Kihon (Basics)', status: 'in-progress' },
      { id: 'numbers', title: 'Suuji (Numbers)', status: 'locked' },
      { id: 'colors-objects', title: 'Iro to Mono', status: 'locked' },
      { id: 'food-drinks', title: 'Tabemono', status: 'locked' },
      { id: 'daily-routine', title: 'Nichijou', status: 'locked' },
      { id: 'travel', title: 'Ryokou', status: 'locked' },
    ]
  },
  // Fallback for others
  default: {
    level: 'Level 1: Language Basics',
    topic: 'Ordering Coffee',
    initialMessage: "Hello! Ready to learn? Let's practice ordering coffee.",
    items: [
      { id: 'greetings', title: 'Greetings', status: 'completed' },
      { id: 'introductions', title: 'Introductions', status: 'completed' },
      { id: 'basic-phrases', title: 'Basic Phrases', status: 'in-progress' },
      { id: 'numbers', title: 'Numbers', status: 'locked' },
      { id: 'colors-objects', title: 'Colors & Objects', status: 'locked' },
      { id: 'food-drinks', title: 'Food & Drinks', status: 'locked' },
      { id: 'daily-routine', title: 'Daily Routine', status: 'locked' },
      { id: 'travel', title: 'Travel', status: 'locked' },
    ]
  }
};
