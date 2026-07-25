# DicVocab AI — AI Dictionary

A modern AI-powered English dictionary and vocabulary tutor built with Next.js App Router, Tailwind CSS, Framer Motion, Lucide React, and the Google Gemini API.

## Features

- AI-generated word definitions with structured JSON output
- Pronunciation text and browser text-to-speech audio
- Simple and detailed meanings
- Natural examples and additional usage sentences
- Synonyms, antonyms, Urdu translation, and memory tips
- One-click Simple English explanation
- Expanded Urdu translation and Roman Urdu
- Five-question vocabulary quiz with score tracking
- Related words with usage differences
- Dark and light themes
- Local search history
- Favorites and a vocabulary notebook
- Deterministic daily word
- Responsive glass-style interface and Framer Motion animations
- Server-only Gemini API key

## Project Structure

```text
app/
├── api/
│   └── dictionary/
│       └── route.js
├── globals.css
├── layout.js
└── page.js

components/
├── AudioButton.jsx
├── Loader.jsx
├── QuizCard.jsx
├── SearchBar.jsx
├── ThemeToggle.jsx
├── TranslationCard.jsx
└── WordCard.jsx

lib/
└── gemini.js
```

## 1. Install

```bash
npm install
```

## 2. Configure Gemini

Copy the example environment file if needed:

```bash
cp .env.example .env.local
```

Replace the placeholder with a Gemini API key created in Google AI Studio:

```env
GEMINI_API_KEY=your_real_api_key
GEMINI_MODEL=gemini-3.6-flash
```

`GEMINI_MODEL` is optional. The application defaults to `gemini-3.6-flash`.

Never rename the key to `NEXT_PUBLIC_GEMINI_API_KEY`. Variables prefixed with `NEXT_PUBLIC_` can be included in browser bundles.

## 3. Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## 4. Production Build

```bash
npm run build
npm start
```

## API Contract

Send a POST request to `/api/dictionary`:

```json
{
  "word": "resilient",
  "action": "lookup"
}
```

Available actions:

- `lookup`
- `simplify`
- `translate`
- `quiz`
- `similar`

The server validates input, calls Gemini, requests schema-constrained JSON, parses the result, and returns it as `{ "data": ... }`.

## Deploy to Vercel

1. Push the project to GitHub, GitLab, or Bitbucket.
2. Import the repository into Vercel.
3. In **Project Settings → Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL` (optional)
4. Deploy. Vercel detects Next.js automatically.
5. Redeploy after changing environment variables.

Do not commit `.env.local`. The included file contains only a placeholder and is ignored by Git.

## Production Notes

- Add durable rate limiting before opening a public deployment with a paid API key.
- Consider request logging and abuse monitoring without storing sensitive user input.
- Browser speech synthesis voice quality depends on the device and installed voices.
- The requested `@google/generative-ai` SDK is used here. Google also provides the newer `@google/genai` SDK for future migrations.
