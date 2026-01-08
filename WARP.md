# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
MisSpoke is an AI-powered voice-first language learning platform built for the ElevenLabs Challenge. It enables users to practice speaking languages with AI tutors that adapt to different personalities and learning styles. The app uses ElevenLabs for voice conversation, OpenRouter for LLM inference, and IndexedDB for client-side session storage.

## Development Commands

### Running the Development Server
```bash
npm run dev
# Uses Next.js with Turbopack for fast refresh
# Server runs on http://localhost:3000
```

### Building for Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
# Uses ESLint with Next.js config
```

## Environment Variables
Required environment variables (add to `.env.local`):
- `OPENROUTER_API_KEY` - OpenRouter API key for LLM inference (required for chat/prompt generation)
- `ELEVENLABS_API_KEY` - ElevenLabs API key for voice synthesis
- `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` - ElevenLabs agent ID for conversation
- `NEXT_PUBLIC_SITE_URL` - Site URL for API headers (defaults to http://localhost:3000)

**IMPORTANT**: API keys are checked at runtime. The OpenRouter client has automatic fallback logic across multiple models if the primary model is rate-limited or unavailable.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glass morphism effects
- **Voice**: ElevenLabs React SDK (`@11labs/react`)
- **LLM**: OpenRouter API (replacing Google Gemini for flexibility)
- **Storage**: IndexedDB via `idb` library (client-side only)
- **Animation**: Framer Motion

### Project Structure
```
src/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes (server-side)
│   │   ├── chat/             # Chat message generation
│   │   ├── prompt/           # Dynamic system prompt generation
│   │   ├── summary/          # Session summary and analysis
│   │   ├── translate/        # Text translation
│   │   └── translate-ui/     # UI label translation
│   ├── learn/                # Main conversation interface
│   ├── languages/            # Language selection
│   ├── personalities/        # Personality selection
│   ├── native-language/      # Native language selection
│   ├── profile/              # User profile and stats
│   ├── diagnostic/           # Level diagnostic test
│   ├── community/            # Community features
│   ├── login/signup/         # Authentication pages
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/
│   └── Header.tsx            # Navigation header
├── hooks/
│   ├── useVoiceMemory.ts     # Session management and IndexedDB operations
│   └── useTranslation.ts     # Translation utilities
└── lib/
    ├── constants/
    │   └── personalities.tsx  # Personality definitions
    ├── openrouter/
    │   └── client.ts          # OpenRouter API client with model fallback
    ├── memory/
    │   └── sessionStore.ts    # IndexedDB schema and operations
    └── utils/
        └── security.ts        # Client-side password hashing (Web Crypto API)
```

### Data Flow and State Management

#### Voice Conversation Flow
1. User clicks "Join Call" on `/learn` page
2. `useConversation` hook (ElevenLabs SDK) requests microphone permission
3. Dynamic system prompt fetched from `/api/prompt` based on: language, personality, topic, level
4. Session started with ElevenLabs agent, passing dynamicVariables with user patterns from IndexedDB
5. Real-time bidirectional audio streaming via WebSocket
6. Messages captured in local state with STT confidence scores
7. On session end: transcript sent to `/api/summary` for AI analysis
8. Session metadata saved to IndexedDB via `useVoiceMemory` hook

#### LLM Inference Architecture
- **OpenRouter Client** (`lib/openrouter/client.ts`): Centralized API client with automatic model fallback
- **Model Priority**: Tries free/cheap models first (gemini-2.0-flash-exp, llama-3.1, mistral-7b, etc.)
- **Rate Limit Handling**: On 429 errors, automatically switches to next available model
- **Two Main Functions**:
  - `generateContentSafe()`: Single user prompt (used for prompt generation, translations)
  - `generateWithMessagesSafe()`: Multi-turn conversations (used for chat API)

#### IndexedDB Schema (Client-Side Storage)
Four object stores managed by `lib/memory/sessionStore.ts`:
1. **sessions**: Conversation history with analysis
   - Key: session ID (UUID)
   - Index: `by-date` (on startTime)
   - Fields: messages[], confidenceScores[], summary, mistakes, vocabulary, emotions, patterns
2. **userProfile**: Aggregated learning stats
   - Key: 'default' (single user profile)
   - Fields: currentLevel, totalSessions, streakDays, avgConfidenceScore, learnedPatterns
3. **users**: Authentication (local only)
   - Key: email
   - Fields: password (hashed via PBKDF2), name, nativeLanguage, learningLanguage
4. **curriculumProgress**: Learning path state
   - Key: language code
   - Fields: items[] (id, status: completed/in-progress/locked)

**Memory Flow**: Sessions are saved at end of conversation → profile stats updated → patterns accumulated over time → fed back into next session as context

### Key Design Patterns

#### API Route Pattern
All API routes follow this structure:
1. Validate request body
2. Call OpenRouter with fallback logic
3. Return JSON response with error handling
4. Console logging for debugging model selection

Example: `/api/chat/route.ts` constructs system prompt from session context, appends conversation history, calls OpenRouter, returns AI response.

#### ElevenLabs Integration
- Uses `@11labs/react` SDK's `useConversation` hook
- Agent configuration done via ElevenLabs dashboard (not in code)
- Locale mapping in `learn/page.tsx` (lines 293-307): maps language names to ISO codes
- Accent handling for Indian languages: Uses English locale with accent instructions in system prompt

#### Personality System
8 pre-defined personalities in `lib/constants/personalities.tsx`:
- Cheerful, Empathetic, Energetic, Intellectual, Casual, Calm, Motivating, Creative
- Each has: id, name, subtitle, description, traits (emojis), avatarBg (Tailwind gradient), icon
- Personality ID passed to all API routes to influence AI behavior

#### Translation Architecture
- User's native language stored in localStorage
- UI labels translated once on mount via `/api/translate-ui`
- Chat messages can be translated on-demand via `/api/translate`
- Translations cached in component state to avoid redundant API calls

### Styling Conventions
- **Glass Morphism**: Extensive use of `.glass`, `.glass-dark`, `.glass-light` classes
- **Color Scheme**: Warm theme (burnt orange primary) avoiding blue
- **Dark Mode**: CSS variables in `globals.css` with radial gradient backgrounds
- **Animations**: Framer Motion for page transitions, Tailwind for micro-interactions
- **Font**: Inter (loaded from Google Fonts)
- **Design System**: Uses Tailwind custom color palette (primary, dark, accent)

## Common Development Workflows

### Adding a New Language
1. Add language to supported list in `/languages/page.tsx`
2. Update locale mapping in `/learn/page.tsx` (lines 293-307)
3. Test accent handling for non-Latin scripts (e.g., Japanese, Tamil)

### Adding a New Personality
1. Add to `lib/constants/personalities.tsx` array
2. Import appropriate icon from `lucide-react`
3. Test system prompt generation in `/api/prompt`

### Modifying Chat Behavior
- Edit system prompt template in `/api/chat/route.ts` (lines 12-38)
- Adjust model priority in `lib/openrouter/client.ts` (lines 21-29)
- Test with different personalities and levels

### Debugging Voice Issues
- Check browser console for ElevenLabs WebSocket errors
- Verify `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` is set
- Microphone permission must be granted
- Benign "CLOSING/CLOSED" errors are logged but ignored (line 239 in `learn/page.tsx`)

### Working with IndexedDB
- All database operations are async
- Use helper functions from `lib/memory/sessionStore.ts`
- Browser DevTools → Application → IndexedDB to inspect data
- DB schema version is 2 (upgrade logic in `sessionStore.ts` lines 86-108)

## Important Constraints

### API Key Security
- Never commit API keys to git
- `.env.local` is gitignored
- Keys checked at runtime with console warnings if missing
- OpenRouter client works server-side only (process.env)

### ElevenLabs SDK Limitations
- Cannot send hidden context messages after connection
- Agent configuration (voice, speed, interruption) set via dashboard, not code
- Locale support is limited (see locale mapping in `learn/page.tsx`)

### IndexedDB Constraints
- Client-side only - no server persistence
- Data lost if user clears browser storage
- Single-user model (no multi-user support)
- Async operations require proper error handling

### Performance Considerations
- Turbopack enabled for fast dev refresh
- Images and fonts should be optimized
- Large conversation histories may slow down IndexedDB queries
- OpenRouter rate limits handled via automatic model fallback

## Codebase Conventions

### Import Paths
Use `@/` alias for `src/` directory:
```typescript
import Header from '@/components/Header';
import { personalities } from '@/lib/constants/personalities';
```

### TypeScript
- Strict mode enabled
- Interfaces preferred over types for object shapes
- API responses should have explicit return types

### Error Handling
- Always wrap IndexedDB operations in try-catch
- Console logging for debugging (not production-ready)
- Fallback responses for API failures

### Component Structure
- Client components: `'use client'` directive at top
- Server components: No directive (default)
- API routes: Always validate input, return NextResponse

### State Management
- React hooks for local state (useState, useEffect)
- No global state library (Redux, Zustand)
- localStorage for simple user preferences
- IndexedDB for structured data

## Testing Notes
- No test framework currently configured
- Manual testing via browser DevTools
- Check Network tab for API calls
- Use Application tab for IndexedDB inspection
- Console logs provide debugging info

## Known Issues & Quirks
- OpenRouter free tier has rate limits - client auto-falls back to next model
- ElevenLabs WebSocket may throw benign closure warnings (filtered in code)
- Indian language accents use English locale with special instructions
- Password hashing is client-side only (not production-secure)
- No backend database - all storage is client-side IndexedDB
