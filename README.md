# MisSpoke

AI-powered voice-first language learning platform built with Next.js, ElevenLabs, OpenRouter, and Supabase.

MisSpoke helps users practice real conversations in different languages using AI tutors with customizable personalities. Users can interact through both text and voice while the system tracks learning progress, vocabulary, mistakes, confidence, and conversation history.

---

# Features

## Voice-Based AI Conversations
- Real-time conversational AI using ElevenLabs
- Natural speaking practice with AI tutors
- Microphone support for live interaction
- AI-generated voice responses

## Text Chat Support
- Chat with AI tutors directly through text
- Context-aware conversational responses
- Dynamic language tutoring prompts

## Tutor Personalities
Choose different AI tutor personalities:
- Cheerful
- Calm
- Motivating
- Intellectual
- Creative
- Casual
- Empathetic
- Energetic

Each personality changes the teaching style, tone, and interaction flow.

## Multi-Language Learning
- Select native language
- Select target learning language
- Multilingual UI translation support

## Session Memory & Analytics
The platform stores:
- Conversation history
- Vocabulary learned
- Mistakes and corrections
- Confidence scores
- Session summaries
- Learning patterns

## Authentication
- Login / Signup using Supabase
- Persistent authentication sessions

## Personalized Learning
- Dynamic prompt generation
- User-level adaptation
- Conversation history awareness
- Focus-area based tutoring

---

# Tech Stack

## Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## AI & APIs
- ElevenLabs Conversational AI
- OpenRouter API
- Google Generative AI SDK

## Backend & Storage
- Next.js API Routes
- Supabase Authentication
- IndexedDB (`idb`)

---

# Project Structure

```bash
src/
│
├── app/
│   ├── api/
│   │   ├── chat/
│   │   ├── prompt/
│   │   ├── summary/
│   │   ├── translate/
│   │   └── translate-ui/
│   │
│   ├── learn/
│   ├── login/
│   ├── signup/
│   ├── profile/
│   ├── personalities/
│   ├── languages/
│   ├── native-language/
│   ├── diagnostic/
│   └── community/
│
├── components/
│
├── constants/
│
├── hooks/
│   └── useVoiceMemory.ts
│
├── lib/
│   ├── memory/
│   ├── openrouter/
│   └── supabase/
│
└── styles/
```

---

# How It Works

1. User selects:
   - Native language
   - Target language
   - Tutor personality

2. The app generates a dynamic AI tutor prompt.

3. User starts:
   - A voice conversation
   - OR a text conversation

4. AI tutor responds using:
   - OpenRouter LLMs
   - ElevenLabs voice synthesis

5. Session data is analyzed and stored locally.

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/Mrudula-itsjuzme/speak134.git
cd speak134
```

## Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env.local` file in the root directory.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

OPENROUTER_API_KEY=your_openrouter_api_key

NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

---

# Run the Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

# Available Scripts

```bash
npm run dev
```
Starts the development server.

```bash
npm run build
```
Builds the application for production.

```bash
npm run start
```
Runs the production build.

```bash
npm run lint
```
Runs ESLint checks.

---

# API Routes

| Route | Purpose |
|---|---|
| `/api/chat` | AI text conversation |
| `/api/prompt` | Dynamic tutor prompt generation |
| `/api/summary` | Session analysis and summaries |
| `/api/translate` | Message translation |
| `/api/translate-ui` | UI text translation |

---

# Current Features Implemented

- AI voice conversations
- Text-based AI chat
- Multiple tutor personalities
- Dynamic prompt generation
- Translation support
- Session memory
- Learning analytics
- IndexedDB persistence
- Supabase authentication
- Conversation history tracking
- Confidence score tracking

---

# Future Improvements

- Cloud sync for session history
- Better long-term memory
- Pronunciation analysis
- Real-time correction scoring
- Mobile responsiveness improvements
- Gamification system
- Community learning features
- Leaderboards and streaks
- Advanced adaptive tutoring

---

# Challenges Solved

- Real-time voice AI integration
- Multi-model LLM fallback system
- Dynamic conversational tutoring prompts
- Local session persistence
- AI memory architecture
- Voice + text hybrid learning flow

---

# Screenshots

Add screenshots here later.

Example:

```markdown
![Home Page](./screenshots/home.png)
![Voice Chat](./screenshots/voice-chat.png)
```

---

# Authors

Developed by the MisSpoke Team.

GitHub:
- https://github.com/Mrudula-itsjuzme

---

# License

This project is currently intended for educational and experimental purposes.

---

# Notes

- Requires valid API keys for ElevenLabs and OpenRouter.
- Some features depend on browser microphone permissions.
- Session data is currently stored locally using IndexedDB.
- Supabase integration is used for authentication.
