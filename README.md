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

3. (Optional) Add your OpenAI key in `.env.local`:

```bash
OPENAI_API_KEY=your_api_key_here
```

If you skip this key, LocalBoost AI will use built-in fallback content generation for demo/testing.

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



## Docker

This project is fully **Dockerized** and can be built/run with the included `Dockerfile`.

Build image:

```bash
docker build -t localboost-ai:latest .
```

Run container:

```bash
docker run -d --name localboost-ai -p 3000:3000 \
  -e OPENAI_API_KEY=your_api_key_here \
  localboost-ai:latest
```

`OPENAI_API_KEY` is optional. Without it, fallback content is returned by the API for demo usage.

Open `http://localhost:3000`

## Deploy on AWS EC2 (Docker)

1. Launch an Ubuntu EC2 instance and allow inbound ports:
   - `22` (SSH)
   - `3000` (app) or `80/443` if using reverse proxy
2. SSH into EC2 and install Docker:

```bash
sudo apt-get update
sudo apt-get install -y docker.io
sudo systemctl enable --now docker
```

3. Copy project to EC2 (git clone or scp), then build and run:

```bash
docker build -t localboost-ai:latest .
docker run -d --restart unless-stopped --name localboost-ai -p 3000:3000 \
  -e OPENAI_API_KEY=your_api_key_here \
  localboost-ai:latest
```

4. Access app:

```text
http://<EC2_PUBLIC_IP>:3000
```

Optional: place Nginx in front and use a domain + TLS for production.

## CI Pipeline (Primary Build Path)

To keep development reliable across environments, the canonical build and checks run in **GitHub Actions** (not this restricted local sandbox).

GitHub Actions runs on push, pull requests, and manual dispatch with:

- `npm install --no-audit --no-fund`
- `npm run lint`
- `npm run test`
- `npm run typecheck`
- `npm run build`
- Upload `.next` as build artifact (hidden files enabled in artifact action)
- Docker build + run smoke check (`docker build` + `docker run` + HTTP probe)

> Note: `package-lock.json` is committed so GitHub Actions can safely use npm caching.

> Optional: set repository variable `APP_URL` to show your live app link in the workflow summary.

The workflow is split into visual stages: **Lint**, **Unit Tests**, **Typecheck**, **Build**, and **Docker Build & Run**.

Node 24 action runtime is opted in via `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` to stay ahead of GitHub deprecation notices.

## Future-Ready Extensions

The code is organized for easy additions:

- Multi-language expansion
- Save generation history
- Scheduled posting
- Analytics dashboard
