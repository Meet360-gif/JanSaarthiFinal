// Jan AI — floating chat widget, restyled to match the Sign In page's
// violet/coral/gold theme (var(--ink1), var(--violet), var(--coral), etc.
// defined in index.html's :root). Drop this file into a page with
// <script src="assistant-widget-auth.js"></script> right before </body>.
// Talks to the real backend (/api/assistant/*) using the JWT saved at login;
// on the Sign In page (no token yet) it shows a friendly "please sign in" note.
(function () {
  const API_BASE = window.JANSAARTHI_API_BASE || 'http://localhost:4000/api';

  const css = `
  #jan-ai-btn{position:fixed; left:20px; bottom:24px; z-index:600; width:58px; height:58px;
    border-radius:50%; border:none; cursor:pointer; background:linear-gradient(135deg, var(--ink1, #241F5C) 0%, var(--violet, #6C4CE0) 100%); color:#fff; font-size:24px;
    box-shadow:0 10px 26px rgba(36,31,92,.45); display:flex; align-items:center; justify-content:center; transition:filter .15s;}
  #jan-ai-btn:hover{filter:brightness(1.08);}
  #jan-ai-panel{position:fixed; left:20px; bottom:92px; z-index:600; width:340px; max-width:90vw;
    height:460px; max-height:70vh; background:var(--card, #fff); border-radius:20px; box-shadow:0 20px 50px rgba(28,27,51,.4);
    display:none; flex-direction:column; overflow:hidden; font-family:'Inter',sans-serif; border:1px solid var(--line, #E6E4F2);}
  #jan-ai-panel.open{display:flex;}
  #jan-ai-head{background:linear-gradient(135deg, var(--ink1, #241F5C) 0%, var(--violet, #6C4CE0) 100%); color:#fff; padding:14px 16px; font-weight:700; font-size:14.5px;
    display:flex; align-items:center; justify-content:space-between; font-family:'Sora','Inter',sans-serif;}
  #jan-ai-head .sub{font-weight:500; font-size:11px; color:#D9D5F5; margin-top:2px; font-family:'Inter',sans-serif;}
  #jan-ai-close{background:none; border:none; color:#fff; font-size:18px; cursor:pointer; line-height:1;}
  #jan-ai-msgs{flex:1; overflow-y:auto; padding:14px; background:var(--bg, #F6F5FB); display:flex; flex-direction:column; gap:10px;}
  .jan-msg{max-width:82%; padding:9px 12px; border-radius:14px; font-size:13px; line-height:1.45; white-space:pre-wrap;}
  .jan-msg.user{align-self:flex-end; background:linear-gradient(135deg, var(--ink1, #241F5C) 0%, var(--violet, #6C4CE0) 100%); color:#fff; border-bottom-right-radius:4px;}
  .jan-msg.assistant{align-self:flex-start; background:#fff; color:var(--ink, #1C1B33); border:1px solid var(--line, #E6E4F2); border-bottom-left-radius:4px;}
  .jan-msg.system{align-self:center; background:var(--amber-bg, #FFF6E2); color:var(--amber, #B9820F); font-size:11.5px; border-radius:10px;}
  #jan-ai-form{display:flex; gap:8px; padding:10px; border-top:1px solid var(--line, #E6E4F2); background:#fff;}
  #jan-ai-input{flex:1; border:1.5px solid var(--line, #E6E4F2); border-radius:10px; padding:9px 11px; font-size:13px; font-family:inherit; resize:none;}
  #jan-ai-input:focus{outline:none; border-color:var(--violet, #6C4CE0);}
  #jan-ai-send{background:linear-gradient(135deg, var(--coral, #FF6B4A) 0%, var(--coral-dark, #E14E30) 100%); color:#fff; border:none; border-radius:10px; padding:0 14px; font-weight:700; cursor:pointer; font-size:13px;}
  #jan-ai-send:disabled{opacity:.5; cursor:not-allowed;}
  .jan-typing{align-self:flex-start; font-size:12px; color:var(--ink-soft, #6B6A85); padding:0 4px;}
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
