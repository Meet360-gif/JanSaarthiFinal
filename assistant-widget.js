// Jan AI — floating chat widget. Drop this one file into any page with
// <script src="assistant-widget.js"></script> right before </body>.
// Talks to the real backend (/api/assistant/*) using the JWT saved at login.
(function () {
  const API_BASE = window.JANSAARTHI_API_BASE || 'http://localhost:4000/api';

  const css = `
  #jan-ai-btn{position:fixed; left:20px; bottom:24px; z-index:600; width:58px; height:58px;
    border-radius:50%; border:none; cursor:pointer; background:#0B4F4A; color:#fff; font-size:24px;
    box-shadow:0 6px 18px rgba(0,0,0,.3); display:flex; align-items:center; justify-content:center;}
  #jan-ai-panel{position:fixed; left:20px; bottom:92px; z-index:600; width:340px; max-width:90vw;
    height:460px; max-height:70vh; background:#fff; border-radius:18px; box-shadow:0 20px 50px rgba(0,0,0,.35);
    display:none; flex-direction:column; overflow:hidden; font-family:'Inter',sans-serif;}
  #jan-ai-panel.open{display:flex;}
  #jan-ai-head{background:#0B4F4A; color:#fff; padding:14px 16px; font-weight:700; font-size:14.5px;
    display:flex; align-items:center; justify-content:space-between;}
  #jan-ai-head .sub{font-weight:500; font-size:11px; color:#B8DCD6; margin-top:2px;}
  #jan-ai-close{background:none; border:none; color:#fff; font-size:18px; cursor:pointer; line-height:1;}
  #jan-ai-msgs{flex:1; overflow-y:auto; padding:14px; background:#F5F7F6; display:flex; flex-direction:column; gap:10px;}
  .jan-msg{max-width:82%; padding:9px 12px; border-radius:14px; font-size:13px; line-height:1.45; white-space:pre-wrap;}
  .jan-msg.user{align-self:flex-end; background:#0B4F4A; color:#fff; border-bottom-right-radius:4px;}
  .jan-msg.assistant{align-self:flex-start; background:#fff; color:#1B2733; border:1px solid #E3E8EB; border-bottom-left-radius:4px;}
  .jan-msg.system{align-self:center; background:#FBF1DE; color:#7a5b0f; font-size:11.5px; border-radius:10px;}
  #jan-ai-form{display:flex; gap:8px; padding:10px; border-top:1px solid #E3E8EB; background:#fff;}
  #jan-ai-input{flex:1; border:1.5px solid #E3E8EB; border-radius:10px; padding:9px 11px; font-size:13px; font-family:inherit; resize:none;}
  #jan-ai-input:focus{outline:none; border-color:#116259;}
  #jan-ai-send{background:#0B4F4A; color:#fff; border:none; border-radius:10px; padding:0 14px; font-weight:700; cursor:pointer; font-size:13px;}
  #jan-ai-send:disabled{opacity:.5; cursor:not-allowed;}
  .jan-typing{align-self:flex-start; font-size:12px; color:#647380; padding:0 4px;}
  `;
  const styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <button id="jan-ai-btn" aria-label="Chat with Jan AI">💬</button>
    <div id="jan-ai-panel">
      <div id="jan-ai-head">
        <div><div>Jan AI</div><div class="sub">JanSaarthi's AI assistant</div></div>
        <button id="jan-ai-close" aria-label="Close chat">✕</button>
      </div>
      <div id="jan-ai-msgs"></div>
      <form id="jan-ai-form">
        <textarea id="jan-ai-input" rows="1" placeholder="Ask me anything…"></textarea>
        <button id="jan-ai-send" type="submit">Send</button>
      </form>
    </div>
  `
  );

  const btn = document.getElementById('jan-ai-btn');
  const panel = document.getElementById('jan-ai-panel');
  const closeBtn = document.getElementById('jan-ai-close');
  const msgsEl = document.getElementById('jan-ai-msgs');
  const form = document.getElementById('jan-ai-form');
  const input = document.getElementById('jan-ai-input');
  const sendBtn = document.getElementById('jan-ai-send');

  let loadedHistory = false;

  function addMessage(role, content) {
    const div = document.createElement('div');
    div.className = 'jan-msg ' + role;
    div.textContent = content;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return div;
  }

  function getToken() {
    return localStorage.getItem('jansaarthi_token');
  }

  async function loadHistory() {
    const token = getToken();
    if (!token) {
      addMessage('system', 'Sign in to JanSaarthi to chat with Jan AI — your conversation is saved to your account.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/assistant/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.messages && data.messages.length) {
        data.messages.forEach((m) => addMessage(m.role, m.content));
      } else if (res.ok) {
        addMessage('assistant', "Hi, I'm Jan AI 👋 Ask me anything about JanSaarthi, banking terms, or anything else on your mind.");
      }
    } catch (err) {
      addMessage('system', 'Could not reach the assistant right now.');
    }
  }

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && !loadedHistory) {
      loadedHistory = true;
      loadHistory();
    }
  });
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 90) + 'px';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const token = getToken();
    if (!token) {
      addMessage('system', 'Please sign in first — go to the sign-in page to continue.');
      return;
    }

    addMessage('user', text);
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    const typingEl = document.createElement('div');
    typingEl.className = 'jan-typing';
    typingEl.textContent = 'Jan AI is typing…';
    msgsEl.appendChild(typingEl);
    msgsEl.scrollTop = msgsEl.scrollHeight;

    try {
      const res = await fetch(`${API_BASE}/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      typingEl.remove();
      if (!res.ok) {
        addMessage('system', data.error || 'Something went wrong.');
      } else {
        addMessage('assistant', data.reply);
      }
    } catch (err) {
      typingEl.remove();
      addMessage('system', 'Could not reach the assistant right now.');
    } finally {
      sendBtn.disabled = false;
    }
  });
})();
