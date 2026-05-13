# MisSpoke

MisSpoke is a voice-first language-learning platform that helps users practice real conversations with adaptive AI tutors.

Built for the ElevenLabs Challenge, the project focuses on speaking practice, tutor personalities, translation, session memory, and learning analytics.

---

## Why MisSpoke?

Most language-learning apps focus on flashcards, streaks, and passive memorization. MisSpoke is built around actual conversation.

The goal is to help learners become confident speakers by letting them practice realistic scenarios with AI tutors that adapt to their language, level, topic, and preferred teaching style.

---

## Core features

### Voice-first tutoring

- real-time voice conversations using ElevenLabs Conversational AI
- microphone-based speaking practice
- AI tutor voice responses
- language and accent-aware session configuration
- live voice-session interface

### Text-based practice

- chat with the tutor when voice mode is not active
- context-aware responses based on previous messages
- dynamic tutor behavior based on language, topic, level, and personality

### Tutor personalities

Supported tutor styles include:

- cheerful
- calm
- motivating
- intellectual
- creative
- casual
- empathetic
- energetic

### Multi-language learning

- native-language selection
- target-language selection
- translation of tutor messages
- dynamic UI translation support
- support for several learning languages, including Spanish, French, Japanese, German, Italian, Korean, Mandarin, Hindi, Tamil, Telugu, Malayalam, and Kannada

### Learning memory and analytics

MisSpoke tracks learning signals such as:

- conversation history
- common mistakes
- vocabulary learned
- corrections
- confidence scores
- strengths and weaknesses
- session summaries
- recent practice patterns

---

## System flow

```text
Learner Setup
     ↓
Language + Level + Tutor Personality
     ↓
Voice or Text Practice Session
     ↓
AI Tutor Feedback
     ↓
Memory + Analytics Update
```

---

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Motion/UI | Framer Motion, Lucide React |
| Voice AI | ElevenLabs Conversational AI |
| LLM layer | OpenRouter API, fallback model logic |
| Backend | Next.js API routes |
| Auth/storage | Supabase, IndexedDB through `idb` |

---

## Project structure

```text
src/
├── app/
│   ├── api/              # chat, prompt, summary, translation routes
│   ├── learn/            # main practice page
│   ├── login/            # login page
│   ├── signup/           # signup page
│   ├── profile/          # user profile
│   ├── personalities/    # tutor personality selection
│   ├── languages/        # target language selection
│   └── native-language/  # native language selection
├── components/           # shared UI components
├── constants/            # app constants
├── hooks/                # custom React hooks
├── lib/                  # memory, OpenRouter, Supabase utilities
└── styles/               # global styling
```

---

## Getting started

```bash
git clone https://github.com/Mrudula-itsjuzme/speak134.git
cd speak134

npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_elevenlabs_agent_id
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | start local development server |
| `npm run build` | build production app |
| `npm run start` | run production build |
| `npm run lint` | run lint checks |

---

## API routes

| Route | Purpose |
|---|---|
| `/api/chat` | text-based tutor responses |
| `/api/prompt` | dynamic tutor prompt generation |
| `/api/summary` | session summary generation |
| `/api/translate` | tutor-message translation |
| `/api/translate-ui` | UI-label translation |

---

## Current status

Implemented:

- voice-based tutor sessions
- text chat fallback
- dynamic tutor prompts
- multiple tutor personalities
- language selection
- translation support
- session memory
- IndexedDB persistence
- Supabase authentication
- confidence tracking
- conversation-history tracking

Planned improvements:

- cloud sync for session history
- stronger pronunciation scoring
- long-term memory
- gamified progress system
- community learning features
- dashboard analytics
- mobile polish

---

## Local notes

- Browser microphone permission is required for voice practice.
- ElevenLabs sessions require a valid agent ID.
- OpenRouter is used for tutor responses and analysis.
- Supabase is used for authentication.
- Some learning memory is stored locally through IndexedDB.

---

## Authors

Built by [Pedamallu Sai Mrudula](https://github.com/Mrudula-itsjuzme) and Meghana Kotharu.

---

## License

Educational, experimental, and hackathon-style use.
