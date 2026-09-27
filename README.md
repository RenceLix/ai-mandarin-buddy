# 🀄 AI Mandarin Self-Study Buddy

Antarmuka chat berbasis web untuk belajar bahasa Mandarin menggunakan AI. Frontend statis (HTML/CSS/JS) yang terhubung ke backend **Langflow** melalui REST API.
---

## ✨ Fitur

- 💬 Antarmuka chat responsif mirip WhatsApp Web / ChatGPT
- 🀄 Tampilan bubble chat dengan teks Hanzi, Pinyin (merah italic), dan terjemahan
- ⌨️ Indikator *typing...* animasi saat menunggu balasan AI
- 🔐 Kredensial API tersimpan di `config.js` yang **tidak di-commit ke Git**
- 🎨 Tema warna hangat terinspirasi dari aplikasi belajar Mandarin profesional
- ⚡ Tidak membutuhkan framework JS — murni Vanilla JS + Tailwind CSS CDN

---

## 📁 Struktur Proyek

```
AI Mandarin Self Study Buddy/
├── index.html          # Struktur halaman utama (SPA)
├── style.css           # Custom CSS — tema warna, bubble, animasi
├── app.js              # Logika chat + integrasi Langflow API
├── config.js           # 🔒 Kredensial rahasia (TIDAK di-commit)
├── config.example.js   # Template config — aman untuk di-commit
├── server.js           # Server lokal Node.js (pengganti python -m http.server)
├── .gitignore          # Mengecualikan config.js dari Git
└── README.md           # Dokumentasi ini
```

---

## 🛠️ Prasyarat

Pastikan hal-hal berikut sudah terpasang di komputer Anda:

| Kebutuhan | Versi Minimum | Cek dengan |
|---|---|---|
| [Node.js](https://nodejs.org) | v18+ | `node --version` |
| [Langflow](https://langflow.org) | v1.x | Berjalan di `http://127.0.0.1:7860` |

> Langflow harus sudah berjalan secara lokal dan flow **AI Mandarin Self-Study Buddy** harus sudah dibuat sebelum menjalankan aplikasi ini.

---

## 🚀 Setup & Cara Menjalankan

### Langkah 1 — Clone atau Download Proyek

```bash
git clone https://github.com/USERNAME/ai-mandarin-buddy.git
cd ai-mandarin-buddy
```

Atau download ZIP dan ekstrak ke folder pilihan Anda.

---

### Langkah 2 — Buat File Konfigurasi

Salin template konfigurasi:

```powershell
# Windows PowerShell
Copy-Item config.example.js config.js
```

```bash
# Mac / Linux
cp config.example.js config.js
```

Lalu buka `config.js` dengan editor teks dan isi nilainya:

```js
const LANGFLOW_API_URL = "http://127.0.0.1:7860/api/v1/run/YOUR_FLOW_ID?stream=false";
const BEARER_TOKEN     = "YOUR_BEARER_TOKEN_HERE";
```

> **Jangan commit `config.js` ke Git.** File ini sudah otomatis diabaikan oleh `.gitignore`.

---

### Langkah 3 — Dapatkan Flow ID dari Langflow

Ada dua cara:

**Cara A — Lewat UI Langflow:**
1. Jalankan Langflow `http://127.0.0.1:7860`
2. Import langflow/AI Mandarin Self-Study Buddy dan Klik flow **AI Mandarin Self-Study Buddy**
3. Klik tombol **API** di pojok kanan atas
4. Salin Flow ID dari URL yang ditampilkan (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

**Cara B — Lewat PowerShell:**
```powershell
$r = Invoke-RestMethod `
  -Uri "http://127.0.0.1:7860/api/v1/flows/" `
  -Headers @{"x-api-key" = "ISI_TOKEN_ANDA"} `
  -Method GET

$r | Where-Object { $_.name -like "*Mandarin*" } | Select-Object name, id
```

---

### Langkah 4 — Dapatkan API Key Langflow

1. Buka `http://127.0.0.1:7860`
2. Klik ikon profil → **Settings** → **API Keys**
3. Klik **Create new API key**
4. Salin key tersebut (dimulai dengan `sk-...`) ke `config.js` sebagai `BEARER_TOKEN`

---

### Langkah 5 — Jalankan Server Lokal

```powershell
node server.js
```
Output yang muncul:

```
✅ Server berjalan di http://localhost:8080
   Tekan Ctrl+C untuk berhenti.
```

---

### Langkah 6 — Buka di Browser

Buka browser dan akses:

```
http://localhost:8080
```

Aplikasi siap digunakan! 🎉

---

## ⚙️ Konfigurasi Lanjutan

### Mengganti Port Server

Buka [`server.js`](server.js) dan ubah nilai `PORT`:

```js
const PORT = 8080; // ganti ke port lain jika 8080 sudah dipakai
```

### Mengganti Endpoint Langflow

Jika Langflow Anda berjalan di server/cloud (bukan localhost), ubah bagian host di `config.js`:

```js
const LANGFLOW_API_URL = "https://your-langflow-server.com/api/v1/run/YOUR_FLOW_ID?stream=false";
```

---

## 🔐 Keamanan Kredensial

| File | Status Git | Keterangan |
|---|---|---|
| `config.js` | ❌ Diabaikan | Berisi URL & token asli — **jangan di-push** |
| `config.example.js` | ✅ Di-commit | Template kosong — aman untuk dibagikan |
| `.gitignore` | ✅ Di-commit | Memblokir `config.js` secara otomatis |

Cara kerja: `config.js` dimuat **sebelum** `app.js` di `index.html`, sehingga variabel `LANGFLOW_API_URL` dan `BEARER_TOKEN` tersedia sebagai variabel global — tanpa hardcode di kode utama.

---

## 🐛 Troubleshooting

| Error | Penyebab | Solusi |
|---|---|---|
| `401 API key required` | Header auth salah atau token kosong | Pastikan `BEARER_TOKEN` di `config.js` diisi dengan benar |
| `404 Flow identifier not found` | Flow ID salah | Ikuti **Langkah 3** untuk mendapatkan Flow ID yang benar |
| `Failed to fetch` / `ERR_CONNECTION_REFUSED` | Langflow tidak berjalan | Jalankan Langflow terlebih dahulu di port 7860 |
| `LANGFLOW_API_URL belum diisi` | `config.js` belum dibuat | Ikuti **Langkah 2** untuk membuat `config.js` |
| Halaman kosong / error MIME | Dibuka langsung via `file://` | Gunakan `node server.js`, jangan buka HTML langsung |

---

## 🏗️ Teknologi yang Digunakan

| Teknologi | Versi | Keterangan |
|---|---|---|
| HTML5 / CSS3 | — | Struktur & styling dasar |
| [Tailwind CSS](https://tailwindcss.com) | v3 (CDN) | Utility classes untuk layout responsif |
| Vanilla JavaScript | ES2020+ | Logika chat, Fetch API, DOM manipulation |
| [Node.js](https://nodejs.org) | v18+ | Server HTTP lokal (`server.js`) |
| [Langflow](https://langflow.org) | v1.x | Backend AI flow (dijalankan terpisah) |

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pembelajaran. Bebas digunakan dan dimodifikasi.
