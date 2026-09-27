// ─────────────────────────────────────────────────────────────────────────────
// KONFIGURASI API dibaca dari config.js (dimuat sebelum file ini di index.html)
// Jangan letakkan token/URL di sini — edit config.js saja.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Elemen DOM
// ─────────────────────────────────────────────────────────────────────────────

const chatWindow      = document.getElementById("chat-window");
const chatForm        = document.getElementById("chat-form");
const userInput       = document.getElementById("user-input");
const sendBtn         = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing-indicator");

// ─────────────────────────────────────────────────────────────────────────────
// Render helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tambahkan gelembung chat ke area chat.
 * @param {"user"|"ai"} role
 * @param {string}      text  Plain text (AI response may contain newlines)
 */
function appendMessage(role, text) {
  const isUser = role === "user";

  const row = document.createElement("div");
  row.className = `message-row flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${isUser ? "user-avatar" : "ai-avatar"}`;
  avatar.textContent = isUser ? "你" : "AI";

  const bubble = document.createElement("div");
  bubble.className = `bubble ${isUser ? "user-bubble" : "ai-bubble"}`;
  // Preserve line breaks from API response
  bubble.innerHTML = escapeHtml(text).replace(/\n/g, "<br/>");

  row.appendChild(avatar);
  row.appendChild(bubble);
  chatWindow.appendChild(row);
  scrollToBottom();
}

/** Escape HTML special chars to prevent XSS */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Scroll chat area ke paling bawah */
function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/** Tampilkan / sembunyikan typing indicator */
function setTyping(visible) {
  typingIndicator.classList.toggle("hidden", !visible);
  if (visible) scrollToBottom();
}

/** Aktifkan / nonaktifkan input & tombol kirim */
function setInputEnabled(enabled) {
  userInput.disabled = !enabled;
  sendBtn.disabled   = !enabled;
  if (enabled) userInput.focus();
}

// ─────────────────────────────────────────────────────────────────────────────
// API call
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Kirim pesan ke Langflow dan kembalikan teks balasan AI.
 * @param {string} userText
 * @returns {Promise<string>}
 */
async function callLangflowAPI(userText) {
  const payload = {
    input_value: userText,
    output_type: "chat",
    input_type:  "chat",
  };

  const headers = {
    "Content-Type": "application/json",
  };

  // LANGFLOW_API_URL & BEARER_TOKEN berasal dari config.js
  // Langflow lokal menggunakan header "x-api-key"
  if (typeof BEARER_TOKEN !== "undefined" && BEARER_TOKEN && BEARER_TOKEN !== "YOUR_BEARER_TOKEN_HERE") {
    headers["x-api-key"] = BEARER_TOKEN;
  }

  const url = (typeof LANGFLOW_API_URL !== "undefined") ? LANGFLOW_API_URL : "";
  if (!url) throw new Error("LANGFLOW_API_URL belum diisi di config.js");

  const response = await fetch(url, {
    method:  "POST",
    headers,
    body:    JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // ── Ekstraksi teks dari berbagai kemungkinan struktur respons Langflow ──
  // Format 1: data.outputs[0].outputs[0].results.message.text  (v1.x)
  // Format 2: data.output                                       (simplified)
  // Format 3: data.result                                       (legacy)
  try {
    return (
      data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
      data?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message ||
      data?.output ||
      data?.result ||
      JSON.stringify(data)
    );
  } catch {
    return JSON.stringify(data);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Event handler utama
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ambil teks input, tampilkan di chat, kirim ke API, tampilkan balasan.
 */
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  userInput.value = "";

  setInputEnabled(false);
  setTyping(true);

  try {
    const reply = await callLangflowAPI(text);
    setTyping(false);
    appendMessage("ai", reply);
  } catch (err) {
    setTyping(false);
    appendMessage(
      "ai",
      `⚠️ Gagal menghubungi server.\n${err.message}\n\nPastikan config.js sudah diisi dengan benar.`
    );
    console.error("[Langflow API]", err);
  } finally {
    setInputEnabled(true);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Event listeners
// ─────────────────────────────────────────────────────────────────────────────

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

userInput.focus();
