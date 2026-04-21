# AI Sensei

A Claude-powered Shotokan karate training assistant for **ESKA Norfolk** instructors and leaders.

Black-and-red, mobile-responsive web app with six tabs:

- **Home** — Chat with your AI Sensei (technique, drills, mindset).
- **Journey** — Track focus, weaknesses, goals, and session notes.
- **Kata** — Full Shotokan kata library, searchable, with purpose / key movements / stance focus / common errors / short drills.
- **Conditioning** — Strength, stance endurance, speed, core drills with reps and sets.
- **History** — Short factual history of Shotokan and ESKA.
- **Profile** — Grade, role, and training preferences.

## Requirements

- **Node.js 18+** (uses the built-in `fetch` — no external dependencies).
- An **Anthropic API key**. Get one at <https://console.anthropic.com>.

## Setup

```bash
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY=sk-ant-...
npm start
```

Or without npm:

```bash
ANTHROPIC_API_KEY=sk-ant-... node server.js
```

Then open <http://localhost:3000>.

## How it works

- The browser talks only to your own server at `/api/chat`.
- The server adds the AI Sensei system prompt and forwards the conversation to the Claude Messages API using **`claude-opus-4-7`**.
- Your API key never leaves the server.
- Chat history, profile, journey, and session log are stored in browser `localStorage`.

## File structure

```
.
├── index.html
├── css/styles.css
├── js/app.js
├── js/data.js
├── js/system-prompt.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

## Troubleshooting

- **"Connection to Sensei failed"** — Confirm the server is running and `ANTHROPIC_API_KEY` is set.
- **Port in use** — Start with `PORT=3001 npm start`.
- **Model error 400** — Set `CLAUDE_MODEL=claude-sonnet-4-6` in `.env` if your key doesn't have Opus access.

Osu.
