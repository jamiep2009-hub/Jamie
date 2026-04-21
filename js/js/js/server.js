// AI Sensei — Node.js server
// Serves static files and proxies /api/chat to the Claude Messages API.
// Zero external dependencies — uses only Node's built-in http, fs, path, and fetch (Node 18+).

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { AI_SENSEI_SYSTEM_PROMPT } = require('./js/system-prompt.js');

loadDotEnv(path.join(__dirname, '.env'));

const PORT = parseInt(process.env.PORT || '3000', 10);
const MODEL = process.env.CLAUDE_MODEL || 'claude-opus-4-7';
const API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/api/chat') {
      return handleChat(req, res);
    }
    if (req.method === 'GET') {
      return serveStatic(req, res);
    }
    return send(res, 405, 'text/plain', 'Method Not Allowed');
  } catch (err) {
    console.error('[server] unexpected error:', err);
    return send(res, 500, 'text/plain', 'Internal server error');
  }
});

server.listen(PORT, () => {
  console.log(`\nAI Sensei running at http://localhost:${PORT}`);
  console.log(`Model: ${MODEL}`);
  if (!API_KEY) {
    console.warn('\n[WARN] ANTHROPIC_API_KEY is not set.');
    console.warn('        Copy .env.example to .env and fill in your key,');
    console.warn('        or export ANTHROPIC_API_KEY=sk-ant-... before starting.\n');
  } else {
    console.log('API key: loaded ✓\n');
  }
});

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  if (!filePath.startsWith(__dirname)) {
    return send(res, 403, 'text/plain', 'Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      return send(res, 404, 'text/plain', 'Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    fs.createReadStream(filePath).pipe(res);
  });
}

async function handleChat(req, res) {
  if (!API_KEY) {
    return send(res, 500, 'application/json',
      JSON.stringify({ error: 'ANTHROPIC_API_KEY not set on server.' }));
  }

  const body = await readJSON(req);
  if (!body || !Array.isArray(body.messages)) {
    return send(res, 400, 'application/json',
      JSON.stringify({ error: 'Expected { messages: [...] } in body.' }));
  }

  const messages = body.messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content }));

  if (messages.length === 0) {
    return send(res, 400, 'application/json',
      JSON.stringify({ error: 'No valid messages.' }));
  }

  const context = buildContextBlock(body.profile, body.journey);
  const systemPrompt = context
    ? `${AI_SENSEI_SYSTEM_PROMPT}\n\nUSER CONTEXT\n${context}`
    : AI_SENSEI_SYSTEM_PROMPT;

  const payload = {
    model: MODEL,
    max_tokens: 1500,
    system: systemPrompt,
    messages
  };

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    });

    const raw = await upstream.text();
    if (!upstream.ok) {
      console.error('[anthropic] error', upstream.status, raw);
      return send(res, upstream.status, 'application/json',
        JSON.stringify({ error: `Claude API error ${upstream.status}`, detail: safeJSON(raw) }));
    }

    const data = JSON.parse(raw);
    const reply = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n')
      .trim();

    return send(res, 200, 'application/json', JSON.stringify({ reply }));
  } catch (err) {
    console.error('[server] fetch error:', err);
    return send(res, 502, 'application/json',
      JSON.stringify({ error: 'Upstream request failed.', detail: String(err) }));
  }
}

function buildContextBlock(profile, journey) {
  const lines = [];
  if (profile && typeof profile === 'object') {
    if (profile.name) lines.push(`Name: ${String(profile.name).slice(0, 60)}`);
    if (profile.grade) lines.push(`Grade: ${String(profile.grade).slice(0, 60)}`);
    if (profile.role) lines.push(`Role: ${String(profile.role).slice(0, 60)}`);
    if (profile.prefs) lines.push(`Preferences: ${String(profile.prefs).slice(0, 300)}`);
  }
  if (journey && typeof journey === 'object') {
    if (journey.focus) lines.push(`Current focus: ${String(journey.focus).slice(0, 200)}`);
    if (journey.weakness) lines.push(`Weakness: ${String(journey.weakness).slice(0, 200)}`);
    if (journey.goal) lines.push(`Goal: ${String(journey.goal).slice(0, 200)}`);
    if (journey.notes) lines.push(`Recent notes: ${String(journey.notes).slice(0, 400)}`);
  }
  return lines.join('\n');
}

function send(res, status, type, body) {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

function readJSON(req, limit = 200 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('Request too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { resolve(null); }
    });
    req.on('error', reject);
  });
}

function safeJSON(str) {
  try { return JSON.parse(str); } catch { return str; }
}

function loadDotEnv(file) {
  try {
    if (!fs.existsSync(file)) return;
    const text = fs.readFileSync(file, 'utf8');
    text.split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
      if (!m) return;
      const key = m[1];
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    });
  } catch (err) {
    console.warn('[server] .env load skipped:', err.message);
  }
}
