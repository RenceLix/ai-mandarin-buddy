// Server lokal sederhana untuk AI Mandarin Self-Study Buddy
// Jalankan: node server.js
// Buka:     http://localhost:8080

const http = require("http");
const fs   = require("fs");
const path = require("path");

const PORT = 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".ico":  "image/x-icon",
  ".svg":  "image/svg+xml",
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split("?")[0]; // abaikan query string
  if (urlPath === "/") urlPath = "/index.html";

  const filePath = path.join(__dirname, urlPath);
  const ext      = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(`404 Not Found: ${urlPath}`);
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n✅ Server berjalan di http://localhost:${PORT}\n   Tekan Ctrl+C untuk berhenti.\n`);
});
