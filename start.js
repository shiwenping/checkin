const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const os = require("os");

const PORT = 3000;
const DIR = __dirname;

// ── HTTP Server ──────────────────────────────────────────
const MIME = {
  ".html": "text/html;charset=utf-8",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".json": "application/json",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".svg":  "image/svg+xml",
};

function serve(req, res) {
  let url = req.url.split("?")[0];
  if (url === "/") url = "/index.html";
  const filePath = path.join(DIR, url);
  if (!filePath.startsWith(DIR + path.sep)) {
    res.writeHead(403); return res.end("Forbidden");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(DIR, "index.html"), (e2, d2) => {
        if (e2) { res.writeHead(500); return res.end("500"); }
        res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        res.end(d2);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(serve);
server.listen(PORT, () => {
  console.log("✓ 本地服务器已启动");
  console.log("  http://localhost:" + PORT + "\n");
});

// ── SSH Tunnel ───────────────────────────────────────────
console.log("正在建立公网隧道 ...");

const ssh = spawn("ssh", [
  "-o", "StrictHostKeyChecking=no",
  "-o", "ServerAliveInterval=60",
  "-R", "80:localhost:" + PORT,
  "nokey@localhost.run"
], { stdio: ["ignore", "pipe", "pipe"] });

let urlFound = false;

ssh.stdout.on("data", (data) => {
  const text = data.toString();
  const match = text.match(/https?:\/\/[a-z0-9]+\.lhr\.life/);
  if (match && !urlFound) {
    urlFound = true;
    console.log("\n" + "=".repeat(50));
    console.log("  公网地址: " + match[0]);
    console.log("=".repeat(50));
    console.log("\n  把这个网址发给朋友，他们就能访问你的打卡页了！");
    console.log("  按 Ctrl+C 停止服务\n");
  }
});

ssh.stderr.on("data", (data) => {
  const text = data.toString();
  // Show connection progress
  if (text.includes("authenticated") || text.includes("tunneled") || text.includes("connection id")) {
    process.stdout.write("  " + text.replace(/\n/g, "\n  "));
  }
  const match = text.match(/https?:\/\/[a-z0-9]+\.lhr\.life/);
  if (match && !urlFound) {
    urlFound = true;
    console.log("\n" + "=".repeat(50));
    console.log("  公网地址: " + match[0]);
    console.log("=".repeat(50));
    console.log("\n  把这个网址发给朋友，他们就能访问你的打卡页了！");
    console.log("  按 Ctrl+C 停止服务\n");
  }
});

ssh.on("close", (code) => {
  console.log("\nSSH 隧道已关闭 (exit code: " + code + ")");
  if (!urlFound) {
    console.log("公网隧道建立失败，可以在局域网内访问：");
    const nets = os.networkInterfaces();
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (net.family === "IPv4" && !net.internal) {
          console.log("  http://" + net.address + ":" + PORT);
        }
      }
    }
  }
});

// ── Cleanup ──────────────────────────────────────────────
function cleanup() {
  console.log("\n正在停止服务...");
  ssh.kill();
  server.close();
  process.exit(0);
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Show LAN IPs for reference
console.log("局域网地址（同 WiFi 可用）：");
const nets = os.networkInterfaces();
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === "IPv4" && !net.internal) {
      console.log("  http://" + net.address + ":" + PORT);
    }
  }
}
