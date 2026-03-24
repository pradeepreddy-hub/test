# LocalBoost AI

LocalBoost AI is a mobile-first MVP web app that helps small business owners quickly generate marketing content for WhatsApp, Instagram, and LinkedIn.

## Features

- Simple 2-3 step flow: enter details → generate content → copy/share.
- Clean form with beginner-friendly fields.
- Platform-specific AI prompts for:
  - WhatsApp (casual, direct)
  - Instagram (catchy + hashtags)
  - LinkedIn (professional storytelling)
- Output cards with:
  - Copy to clipboard
  - Edit generated text
  - WhatsApp share button for WhatsApp copy
- Basic poster generator with HTML canvas:
  - Business name
  - Offer
  - Location
  - Download as PNG
- Five built-in sample use cases:
  - Coorg homestay
  - Organic vegetables in Bangalore
  - Local bakery
  - Tuition center
  - Salon

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Node.js API Route (`/api/generate`)
- OpenAI API (with safe local fallback when API key is missing)

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Add your OpenAI key in `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
```

4. Start development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`

## Project Structure

```text
src/
  app/
    api/generate/route.ts      # AI content generation route + prompt engineering
    globals.css
    layout.tsx
    page.tsx
  components/
    LocalBoostApp.tsx          # Main mobile-first UX and workflow
    ContentCard.tsx            # Reusable output card (copy/edit/share)
    PosterGenerator.tsx        # Canvas poster template + download
    types.ts                   # Shared types
```

## Prompt Strategy

`/api/generate` builds separate prompts per platform:

- WhatsApp: friendly + direct + emoji + forward-friendly.
- Instagram: catchy opening + concise copy + hashtags.
- LinkedIn: professional tone + storytelling + local business impact.

## MVP Constraints Followed

- No auth
- No scheduling
- No heavy image AI generation
- Fast, simple UI for non-technical users


## CI Pipeline (Primary Build Path)

To keep development reliable across environments, the canonical build and checks run in **GitHub Actions** (not this restricted local sandbox).

GitHub Actions runs on push, pull requests, and manual dispatch with:

- `npm install --no-audit --no-fund`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Upload `.next` as build artifact (hidden files enabled in artifact action)

> Note: `package-lock.json` is committed so GitHub Actions can safely use npm caching.

> Optional: set repository variable `APP_URL` to show your live app link in the workflow summary.

## Future-Ready Extensions

The code is organized for easy additions:

- Multi-language expansion
- Save generation history
- Scheduled posting
- Analytics dashboard
