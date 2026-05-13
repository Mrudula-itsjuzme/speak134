# MisSpoke

**MisSpoke** is an AI-powered, voice-first language learning platform that helps users practice real conversations with adaptive AI tutors. It combines live voice interaction, text chat, tutor personalities, translations, session memory, and learning analytics into one conversational learning experience.

Built for the **ElevenLabs Challenge**, MisSpoke focuses on what most language apps avoid: actually speaking.

---

## Why MisSpoke?

Most language learning tools are built around flashcards, streaks, and passive memorization. MisSpoke is built around conversation.

The goal is simple: help learners become confident speakers by letting them practice realistic scenarios with AI tutors that remember their progress, adapt to their level, and respond in a natural teaching style.

---

## Core Features

### Voice-first AI tutoring

- Real-time voice conversations using ElevenLabs Conversational AI
- Microphone-based speaking practice
- AI tutor voice responses
- Language/accent-aware session configuration
- Voice overlay with live conversation UI

### Text-based practice

- Chat with the AI tutor when voice mode is not active
- Context-aware responses using previous messages
- Dynamic tutor behavior based on language, topic, level, and personality

### Tutor personalities

Users can choose different tutor styles, including:

- Cheerful
- Calm
- Motivating
- Intellectual
- Creative
- Casual
- Empathetic
- Energetic

Each personality changes how the tutor explains, corrects, motivates, and responds.

### Multi-language learning flow

- Select native language
- Select target learning language
- Practice languages such as Spanish, French, Japanese, German, Italian, Korean, Mandarin, Hindi, Tamil, Telugu, Malayalam, and Kannada
- Translate tutor messages into the learner's native language
- Dynamic UI translation support

### Session memory and learning analytics

MisSpoke tracks useful learning signals across practice sessions:

- Conversation history
- Common mistakes
- Vocabulary learned
- Corrections
- Confidence scores
- Strengths and weaknesses
- Session summaries
- Recent practice patterns

### Authentication

- Supabase-based login and signup
- Persistent authenticated sessions
- Profile-aware learning flow

---

## Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons

### AI and voice

- ElevenLabs Conversational AI
- OpenRouter API
- Multi-model fallback logic
- Google Generative AI SDK dependency included for AI-related workflows

### Backend and storage

- Next.js API routes
- Supabase authentication
- IndexedDB via `idb`
- Local session persistence

---

## Project Structure

```bash
src/
├── app/
│   ├── api/
│   │   ├── chat/           # Text tutor responses
│   │   ├── prompt/         # Dynamic tutor prompt generation
│   │   ├── summary/        # Session summaries and analysis
│   │   ├── translate/      # Message translation
│   │   └── translate-ui/   # UI translation
│   ├── learn/              # Main voice/text practice page
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── profile/            # User profile
│   ├── personalities/      # Tutor personality selection
│   ├── languages/          # Target language selection
│   ├── native-language/    # Native language selection
│   ├── diagnostic/         # Diagnostic flow
│   └── community/          # Community page
├── components/             # Shared UI components
├── constants/              # App constants
├── hooks/                  # Custom React hooks
├── lib/
│   ├── memory/             # Local learning memory/session store
│   ├── openrouter/         # OpenRouter client and fallback logic
│   └── supabase/           # Supabase client
└── styles/                 # Global styling
```

---

## How It Works

1. The learner chooses a native language, target language, and tutor personality.
2. MisSpoke generates a tutor prompt based on the selected language, level, topic, and personality.
3. The learner starts either a voice session or a text chat.
4. The AI tutor responds conversationally, corrects mistakes, and adapts to the session context.
5. After practice, the app stores learning signals such as vocabulary, mistakes, confidence scores, and session history.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Mrudula-itsjuzme/speak134.git
cd speak134
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open the app at:

```bash
http://localhost:3000
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server with Turbopack |
| `npm run build` | Build the production app |
| `npm run start` | Run the production build |
| `npm run lint` | Run lint checks |

---

## API Routes

| Route | Purpose |
|---|---|
| `/api/chat` | Generates text-based tutor responses |
| `/api/prompt` | Creates dynamic tutor prompts |
| `/api/summary` | Generates learning/session summaries |
| `/api/translate` | Translates tutor messages |
| `/api/translate-ui` | Translates UI labels |

---

## Current Status

Implemented:

- Voice-based AI tutor sessions
- Text chat fallback
- Dynamic tutor prompts
- Multiple tutor personalities
- Native language and target language selection
- Translation support
- Session memory
- IndexedDB persistence
- Supabase authentication
- Confidence score tracking
- Conversation history tracking
- Learning pattern extraction

Planned improvements:

- Cloud sync for session history
- More detailed pronunciation scoring
- Better long-term memory
- Gamified progress system
- Streaks and achievements
- Community learning features
- Leaderboards
- More polished mobile experience
- Stronger dashboard analytics

---

## Screenshots

Screenshots can be added here once the UI is finalized.

```markdown
![Home Page](./screenshots/home.png)
![Voice Practice](./screenshots/voice-practice.png)
![Learning Dashboard](./screenshots/dashboard.png)
```

---

## Notes for Running Locally

- Browser microphone permission is required for voice practice.
- ElevenLabs voice sessions require a valid agent ID.
- OpenRouter is used for AI tutor responses and analysis.
- Supabase is used for authentication.
- Some learning memory is stored locally through IndexedDB.

---

## Author

Built by **Pedamallu Sai Mrudula** and **Meghana Kotharu**.

---

## License

This project is currently intended for educational, experimental, and hackathon-style use.
