// AI Sensei — client app
// Tab switching, chat UI, local storage, and render for Kata / Conditioning / History / Profile / Journey.

(function () {
  'use strict';

  const LS_KEYS = {
    chat: 'ai-sensei.chat',
    journey: 'ai-sensei.journey',
    log: 'ai-sensei.log',
    profile: 'ai-sensei.profile'
  };

  // ---------- Tabs ----------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabButtons.forEach(b => b.classList.toggle('active', b === btn));
      panels.forEach(p => p.classList.toggle('active', p.id === target));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ---------- Chat ----------
  const chatLog = document.getElementById('chat-log');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const clearBtn = document.getElementById('clear-chat');

  let chatHistory = loadJSON(LS_KEYS.chat, []);
  restoreChat();

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage('user', text);
    chatHistory.push({ role: 'user', content: text });
    saveJSON(LS_KEYS.chat, chatHistory);
    chatInput.value = '';

    const typingEl = addTyping();
    sendBtn.disabled = true;

    try {
      const profile = loadJSON(LS_KEYS.profile, {});
      const journey = loadJSON(LS_KEYS.journey, {});
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          profile,
          journey
        })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = (data && data.reply) ? data.reply : 'No reply.';
      typingEl.remove();
      addMessage('assistant', reply);
      chatHistory.push({ role: 'assistant', content: reply });
      saveJSON(LS_KEYS.chat, chatHistory);
    } catch (err) {
      typingEl.remove();
      addMessage('assistant',
        'Connection to Sensei failed.\n\n' +
        'Check that the server is running and ANTHROPIC_API_KEY is set.\n\n' +
        'Error: ' + (err.message || err));
    } finally {
      sendBtn.disabled = false;
      chatInput.focus();
    }
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.requestSubmit();
    }
  });

  clearBtn.addEventListener('click', () => {
    if (!confirm('Clear chat history?')) return;
    chatHistory = [];
    saveJSON(LS_KEYS.chat, chatHistory);
    chatLog.innerHTML = '';
    addMessage('assistant', 'Osu. Fresh start. What will we work on?');
  });

  function restoreChat() {
    if (chatHistory.length === 0) return;
    chatHistory.forEach(m => addMessage(m.role, m.content, /*skipPersist=*/ true));
  }

  function addMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `msg ${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = formatText(text);
    wrap.appendChild(bubble);
    chatLog.appendChild(wrap);
    chatLog.scrollTop = chatLog.scrollHeight;
    return wrap;
  }

  function addTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'msg assistant typing';
    wrap.innerHTML = `<div class="bubble">Sensei is thinking…</div>`;
    chatLog.appendChild(wrap);
    chatLog.scrollTop = chatLog.scrollHeight;
    return wrap;
  }

  function formatText(text) {
    // Minimal markdown-ish: bold **x**, bullets, line breaks.
    const esc = (s) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    let html = esc(text);
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const blocks = html.split(/\n\n+/);
    return blocks.map(block => {
      const lines = block.split('\n');
      if (lines.every(l => /^\s*[-*]\s+/.test(l))) {
        return '<ul>' + lines.map(l => '<li>' + l.replace(/^\s*[-*]\s+/, '') + '</li>').join('') + '</ul>';
      }
      if (lines.every(l => /^\s*\d+\.\s+/.test(l))) {
        return '<ol>' + lines.map(l => '<li>' + l.replace(/^\s*\d+\.\s+/, '') + '</li>').join('') + '</ol>';
      }
      return '<p>' + lines.join('<br>') + '</p>';
    }).join('');
  }

  // ---------- Journey ----------
  const journeyForm = document.getElementById('journey-form');
  const jFocus = document.getElementById('j-focus');
  const jWeakness = document.getElementById('j-weakness');
  const jGoal = document.getElementById('j-goal');
  const jNotes = document.getElementById('j-notes');
  const journeySaved = document.getElementById('journey-saved');

  const journey = loadJSON(LS_KEYS.journey, {});
  jFocus.value = journey.focus || '';
  jWeakness.value = journey.weakness || '';
  jGoal.value = journey.goal || '';
  jNotes.value = journey.notes || '';

  journeyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveJSON(LS_KEYS.journey, {
      focus: jFocus.value.trim(),
      weakness: jWeakness.value.trim(),
      goal: jGoal.value.trim(),
      notes: jNotes.value.trim()
    });
    flashSaved(journeySaved, 'Saved.');
  });

  const logForm = document.getElementById('log-form');
  const logEntry = document.getElementById('log-entry');
  const logList = document.getElementById('log-list');
  let logEntries = loadJSON(LS_KEYS.log, []);
  renderLog();

  logForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = logEntry.value.trim();
    if (!text) return;
    logEntries.unshift({ text, date: new Date().toISOString() });
    saveJSON(LS_KEYS.log, logEntries);
    logEntry.value = '';
    renderLog();
  });

  function renderLog() {
    logList.innerHTML = '';
    logEntries.forEach((e, i) => {
      const li = document.createElement('li');
      const d = new Date(e.date);
      li.innerHTML = `
        <span>${escapeHTML(e.text)}</span>
        <span class="log-date">${d.toLocaleDateString()}</span>
      `;
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'del-btn';
      del.textContent = '✕';
      del.addEventListener('click', () => {
        logEntries.splice(i, 1);
        saveJSON(LS_KEYS.log, logEntries);
        renderLog();
      });
      li.appendChild(del);
      logList.appendChild(li);
    });
  }

  // ---------- Kata ----------
  const kataList = document.getElementById('kata-list');
  const kataDetail = document.getElementById('kata-detail');
  const kataSearch = document.getElementById('kata-search');

  renderKataList(KATA_DATA);

  kataSearch.addEventListener('input', () => {
    const q = kataSearch.value.trim().toLowerCase();
    const filtered = KATA_DATA.filter(k => k.name.toLowerCase().includes(q));
    renderKataList(filtered);
    kataDetail.classList.add('hidden');
  });

  function renderKataList(list) {
    kataList.innerHTML = '';
    list.forEach(k => {
      const card = document.createElement('div');
      card.className = 'kata-card';
      card.innerHTML = `
        <h3>${escapeHTML(k.name)}</h3>
        <span class="kata-tag">${escapeHTML(k.tag)}</span>
      `;
      card.addEventListener('click', () => showKata(k));
      kataList.appendChild(card);
    });
    if (list.length === 0) {
      kataList.innerHTML = '<p class="muted">No kata match your search.</p>';
    }
  }

  function showKata(k) {
    kataDetail.classList.remove('hidden');
    kataDetail.innerHTML = `
      <button class="back-btn" id="kata-back">← Back to list</button>
      <h3>${escapeHTML(k.name)}</h3>
      <span class="kata-tag">${escapeHTML(k.tag)}</span>

      <div class="detail-block">
        <h4>Purpose</h4>
        <p>${escapeHTML(k.purpose)}</p>
      </div>
      <div class="detail-block">
        <h4>Key movements</h4>
        <ul>${k.movements.map(m => `<li>${escapeHTML(m)}</li>`).join('')}</ul>
      </div>
      <div class="detail-block">
        <h4>Stance focus</h4>
        <p>${escapeHTML(k.stance)}</p>
      </div>
      <div class="detail-block">
        <h4>Common errors</h4>
        <ul>${k.errors.map(e => `<li>${escapeHTML(e)}</li>`).join('')}</ul>
      </div>
      <div class="detail-block">
        <h4>Short drills</h4>
        <ul>${k.drills.map(d => `<li>${escapeHTML(d)}</li>`).join('')}</ul>
      </div>
    `;
    document.getElementById('kata-back').addEventListener('click', () => {
      kataDetail.classList.add('hidden');
    });
    kataDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- Conditioning ----------
  const condList = document.getElementById('conditioning-list');
  CONDITIONING_DATA.forEach(block => {
    const card = document.createElement('div');
    card.className = 'cond-card';
    card.innerHTML = `
      <h3>${escapeHTML(block.focus)}</h3>
      ${block.drills.map(d => `
        <div class="drill">
          <div class="drill-name">${escapeHTML(d.name)}</div>
          <div class="drill-reps">${escapeHTML(d.reps)}</div>
          <div class="drill-focus">${escapeHTML(d.focus)}</div>
        </div>
      `).join('')}
    `;
    condList.appendChild(card);
  });

  // ---------- History ----------
  document.getElementById('history-content').innerHTML = HISTORY_CONTENT;

  // ---------- Profile ----------
  const profileForm = document.getElementById('profile-form');
  const pName = document.getElementById('p-name');
  const pGrade = document.getElementById('p-grade');
  const pRole = document.getElementById('p-role');
  const pPrefs = document.getElementById('p-prefs');
  const profileSaved = document.getElementById('profile-saved');

  const profile = loadJSON(LS_KEYS.profile, {});
  pName.value = profile.name || '';
  pGrade.value = profile.grade || '';
  pRole.value = profile.role || '';
  pPrefs.value = profile.prefs || '';

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveJSON(LS_KEYS.profile, {
      name: pName.value.trim(),
      grade: pGrade.value,
      role: pRole.value,
      prefs: pPrefs.value.trim()
    });
    flashSaved(profileSaved, 'Saved.');
  });

  // ---------- Utilities ----------
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  function escapeHTML(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function flashSaved(el, msg) {
    el.textContent = msg;
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.textContent = ''; }, 2000);
  }
})();
